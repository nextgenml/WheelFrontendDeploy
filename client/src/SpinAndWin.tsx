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

  const [loading, setLoading] = useState(true);
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
  const [spinDelay, setSpinDelay] = useState(20);
  const [typeValue, setTypeValue] = useState("daily");

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
    const winners_data_res = await fetch(
      api_url + `winners-data?from=${f_start}&to=${f_end}&type=${typeValue}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const winners_data = await winners_data_res.json();
    setWinnersData(winners_data.data);
    setNextTypeAt(winners_data.next_spin_at);
  };
  const fetchSpinnerData = async () => {
    let spinner_data_res = await fetch(api_url + "spinner-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let spinner_data = await spinner_data_res.json();
    setSpinnerData(spinner_data);
    setLoading(false);
    setSpinDelay(spinner_data.spin_delay);

    const wCount = (spinner_data.winners || []).filter(
      (x: string) => !!x
    ).length;

    await fetchWinners();
    return {
      start_time: new Date(spinner_data["start_time"]),
      end_time: new Date(spinner_data["end_time"]),
      spins_remaining: spinner_data.no_of_winners - wCount,
      canRun:
        spinner_data &&
        spinner_data.participants &&
        spinner_data.participants.length > 0,
    };
  };

  const onCountDownComplete = async () => {
    let { spins_remaining, canRun, end_time } = await fetchSpinnerData();

    if (spins_remaining === 0) {
      let end_date = new Date();
      end_date?.setHours(end_date.getHours() + 6);
      end_date?.setMinutes(end_date.getMinutes() + 15);
      end_date?.setSeconds(0);
      setTimerEndDate(end_date);
      setTimerStartDate(new Date());
      console.log("updating ...");
      console.log(end_date);
    }

    if (canRun && spins_remaining > 0) {
      console.log("fetching new ....... 1");
      let end_time = new Date();
      end_time?.setSeconds(end_time.getSeconds() + spinDelay);
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
              <Wheel
                onFinish={() => {}}
                selected_item={winner}
                items={wheel_items}
              />
            ) : (
              <p style={{ color: "white", fontSize: "20px" }}>
                No Spin As Minimum Wallet Requirement Is Not Met
              </p>
            )}
            <CustomCountDown
              on_Complete={onCountDownComplete}
              start_date={timer_start_date}
              end_date={timer_end_date ? timer_end_date : new Date()}
            />
          </div>

          <div style={{ padding: "0 5rem" }} className="flex flex-col  ">
            <h2 className="text-white font-medium mx-auto  text-center text-4xl">
              Winners on the selected date range
            </h2>
            <div
              style={{ marginTop: "3rem", gap: "0.2rem" }}
              className="flex flex-row  items-center justify-center mt-8 lg:justify-end w-full"
            >
              {!showStart && (
                <>
                  <DateIcon />
                  <p
                    onClick={() => setShowStart(true)}
                    className="cursor-pointer font-medium text-white"
                  >
                    {DateToString(startDate)}
                  </p>
                </>
              )}
              <span
                style={{
                  marginLeft: "16px",
                  marginRight: "16px",
                  color: "white",
                }}
              >
                to
              </span>
              {showStart && (
                <Calendar
                  className={"date-calender"}
                  onChange={(new_date: Date) => {
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
                  <p
                    onClick={() => setShowEnd(true)}
                    className="cursor-pointer font-medium text-white"
                  >
                    {DateToString(endDate)}
                  </p>
                </>
              )}
              {showEnd && (
                <Calendar
                  className={"date-calender"}
                  onChange={(new_date: Date) => {
                    setShowEnd(false);
                    setEndDate(new_date);
                  }}
                  calendarType="US"
                  defaultActiveStartDate={new Date()}
                />
              )}
              <select
                value={typeValue}
                className="type-selection"
                onChange={(e) => setTypeValue(e.target.value)}
              >
                {SPIN_TYPES.map(([value, text]) => {
                  return <option value={value}>{text}</option>;
                })}
              </select>
              <button onClick={fetchWinners} className="get-winners-btn">
                Get Winners
              </button>
              {nextTypeSpinAt && (
                <>
                  <span className="next-spin-time">
                    Next {typeValue} spin is in
                  </span>
                  <Countdown date={nextTypeSpinAt} className="spin-timer" />
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
