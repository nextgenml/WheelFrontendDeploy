/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Countdown from "react-countdown";
import CustomCountDown from "./components/countdown";
import DateIcon from "./components/Icons/DateIcon";
import Wheel from "./components/wheel";
import WinnersTable from "./components/WinnersTable";
import { DateToString } from "./utils";
import "react-calendar/dist/Calendar.css";
import { useAccount } from "wagmi";
import { fetchNextEligibleUsersAPI } from "./API/Spinwheel.js";
import {
  Button,
  MenuItem,
  Select,
  Typography,
  FormControl,
} from "@mui/material";
import { customFetch } from "./API";

const SPIN_TYPES = [
  ["daily", "Daily"],
  ["weekly", "Weekly"],
  ["biweekly", "Biweekly"],
  ["monthly", "Monthly"],
  ["yearly", "Yearly"],
  ["adhoc", "Adhoc"],
];

export default function SpinAndWin() {
  var api_url = "/";
  if (process.env["NODE_ENV"] === "development") {
    api_url = "http://0.0.0.0:8000/";
  }

  const { isConnected, address } = useAccount();

  const [loading, setLoading] = useState(false);
  const [wheel_items, setWheelItems] = useState<any[] | undefined>(undefined);
  const [winners_data, setWinnersData] = useState<any>();

  const [timer_end_date, setTimerEndDate] = useState<Date>();
  const [timer_start_date, setTimerStartDate] = useState<Date>(new Date());
  const [winner, setWinner] = useState<number | null>(null);
  const [nextTypeSpinAt, setNextTypeAt] = useState<string | null>(null);

  // For filtering winners in the table
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [typeValue, setTypeValue] = useState("adhoc");
  const [spinTypes, setSpinTypes] = useState({
    prev_spin_type: "",
    next_spin_type: "",
  });
  const [nextUsersCount, setNextUsersCount] = useState(0);

  useEffect(() => {
    fetchWinners();
  }, [typeValue]);

  const fetchNextEligibleUsers = async () => {
    const data = await fetchNextEligibleUsersAPI();
    setNextUsersCount(data.count);
  };
  useEffect(() => {
    if (winners_data) {
      fetchWinners();
      fetchSpinnerData();
    }
    if (isConnected) fetchNextEligibleUsers();
  }, [isConnected]);

  const setSpinnerData = (spinner_data: any) => {
    setWheelItems(spinner_data.participants);

    let curr_winners = (spinner_data.winners || []).filter((w: string) => !!w);

    if (spinner_data.participants && curr_winners.length > 0) {
      setWinner(
        spinner_data.participants.indexOf(curr_winners[curr_winners.length - 1])
      );
    }
  };

  const fetchWinners = async () => {
    const f_start = moment(startDate).format("YYYY-MM-DD");
    const f_end = moment(endDate).format("YYYY-MM-DD");

    const url =
      api_url +
      "winners-data?" +
      new URLSearchParams({
        from: f_start,
        to: f_end,
        type: typeValue,
        walletAddress: (address || "").toString(),
      });

    const winners_data_res = await customFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const winners_data = await winners_data_res.json();
    setWinnersData(winners_data.data);
    setNextTypeAt(winners_data.next_spin_at);
  };
  const fetchSpinnerData = async () => {
    const spinnerURL =
      api_url +
      "spinner-data?" +
      new URLSearchParams({
        walletAddress: (address || "").toString(),
      });

    let spinner_data_res = await customFetch(spinnerURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let spinner_data = await spinner_data_res.json();
    setSpinnerData(spinner_data);

    const wCount = (spinner_data.winners || []).filter(
      (x: string) => !!x
    ).length;

    setLoading(false);
    setSpinTypes({
      prev_spin_type: spinner_data.prev_spin_type,
      next_spin_type: spinner_data.next_spin_type,
    });

    return {
      start_time: new Date(spinner_data["start_time"]),
      end_time: new Date(spinner_data["end_time"]),
      spins_remaining: spinner_data.no_of_winners - wCount,
      spin_delay: spinner_data.spin_delay,

      canRun:
        spinner_data &&
        spinner_data.participants &&
        spinner_data.participants.length > 0,
    };
  };

  const onCountDownComplete = async () => {
    let { spins_remaining, canRun, end_time, spin_delay } =
      await fetchSpinnerData();

    if (canRun && spins_remaining > 0) {
      let end_time = new Date();

      end_time?.setSeconds(end_time.getSeconds() + spin_delay);
      setTimerEndDate(end_time);
      setTimerStartDate(new Date());
    } else {
      setTimerEndDate(new Date(end_time));
      setTimerStartDate(new Date());
    }
  };

  useEffect(() => {
    fetchSpinnerData().then(({ start_time, end_time }) => {
      setTimerEndDate(end_time);
      setTimerStartDate(start_time);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="main">
      {!loading && (
        <>
          <div
            style={{ gap: "4rem", minHeight: "90vh", padding: "1rem 0" }}
            className="flex w-fit lg:gap-20 flex-row flex-wrap justify-center items-center mx-auto py-9"
          >
            {wheel_items && wheel_items.length ? (
              <div>
                <Wheel
                  onFinish={() => setTimeout(fetchWinners, 1000)}
                  selected_item={winner}
                  items={wheel_items}
                />
                <div className="spin-wheel-title">
                  {spinTypes.prev_spin_type?.toUpperCase()} SPIN
                </div>
              </div>
            ) : (
              <p style={{ fontSize: "20px" }}>
                No Spin As Minimum Wallet Requirement Is Not Met
              </p>
            )}
            {spinTypes.next_spin_type && (
              <CustomCountDown
                on_Complete={onCountDownComplete}
                start_date={timer_start_date}
                end_date={timer_end_date ? timer_end_date : new Date()}
                spinType={spinTypes.next_spin_type}
                nextUsersCount={nextUsersCount}
              />
            )}
          </div>

          <div
            style={{ padding: "0 5rem", marginTop: "30px" }}
            className="flex flex-col  "
          >
            <h2 className="font-medium mx-auto  text-center text-4xl">
              Winners on the selected date range
            </h2>
            <div
              style={{
                marginTop: "3rem",
                gap: "0.2rem",
                border: "1px solid #d5d0d0",
                padding: "8px",
                borderRadius: "8px",
                display: "flex",
              }}
              className="flex flex-row  items-center justify-center mt-8 lg:justify-end w-full"
            >
              {!showStart && (
                <>
                  <DateIcon />
                  <Typography
                    variant="subtitle1"
                    onClick={() => setShowStart(true)}
                  >
                    {DateToString(startDate)}
                  </Typography>
                </>
              )}
              <span
                style={{
                  marginLeft: "16px",
                  marginRight: "16px",
                }}
              >
                to
              </span>
              {showStart && (
                <Calendar
                  className={"date-calender"}
                  // @ts-ignore
                  onChange={(
                    new_date: Date,
                    event: React.MouseEvent<HTMLButtonElement>
                  ) => {
                    setShowStart(false);
                    setStartDate(new_date);
                  }}
                  calendarType="US"
                  defaultActiveStartDate={new Date()}
                />
              )}
              {!showEnd && (
                <>
                  <DateIcon />
                  <Typography
                    variant="subtitle1"
                    onClick={() => setShowEnd(true)}
                  >
                    {DateToString(endDate)}
                  </Typography>
                </>
              )}
              {showEnd && (
                <Calendar
                  className={"date-calender"}
                  // @ts-ignore
                  onChange={(new_date: Date) => {
                    setShowEnd(false);
                    setEndDate(new_date);
                  }}
                  calendarType="US"
                  defaultActiveStartDate={new Date()}
                />
              )}

              <FormControl>
                <Select
                  id="select-spin"
                  value={typeValue}
                  onChange={(e) => setTypeValue(e.target.value)}
                  sx={{ ml: 2 }}
                >
                  {SPIN_TYPES.map(([value, text]) => {
                    return <MenuItem value={value}>{text}</MenuItem>;
                  })}
                </Select>
              </FormControl>

              <Button variant="outlined" onClick={fetchWinners} sx={{ ml: 2 }}>
                Get Winners
              </Button>
              {nextTypeSpinAt && (
                <>
                  <span className="next-spin-time">
                    Next {typeValue} spin is in
                  </span>
                  <Countdown
                    date={
                      typeValue === spinTypes.next_spin_type && timer_end_date
                        ? timer_end_date
                        : nextTypeSpinAt
                    }
                    key={Math.floor(Math.random() * 100)}
                    className="spin-timer"
                  />
                </>
              )}
            </div>
          </div>
          {winners_data && <WinnersTable winners_data={winners_data} />}
        </>
      )}

      {loading && (
        <div
          style={{
            backgroundColor: "#3caeee",
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
          className="spinner-grow inline-block w-12 h-12  rounded-full opacity-0"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
    </div>
  );
}
