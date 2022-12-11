import { useEffect, useState } from "react";
import Wheel from "./components/wheel";
import CountDown from "./components/countdown";
import WinnersTable from "./components/WinnersTable";
import Calendar from "react-calendar";
import { next_spin_delay } from "./config";
import { DateToString, stringToDate } from "./utils";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
const spinner_colors = [
  "#CBE4F9",
  "#CDF5F6",
  "#EFF9DA",
  "#F9EBDF",
  "#F9D8D6",
  "#D6CDEA",
];

function App() {
  var api_url = "/";
  if (process.env["NODE_ENV"] === "development") {
    api_url = "http://0.0.0.0:8000/";
  }

  const [loading, setLoading] = useState(true);
  const [wheel_items, setWheelItems] = useState<any[] | undefined>(undefined);
  const [winners_data, setWinnersData] = useState<[] | undefined>(undefined);
  const [winners_data_1, setWinnersData_1] = useState<any>();
  const [timer_end_date, setTimerEndDate] = useState<Date>();
  const [timer_start_date, setTimerStartDate] = useState<Date>(new Date());
  const [selected_date, setSelectedDate] = useState<Date>(new Date());
  const [winner, setWinner] = useState<number | null>(null);

  const [no_of_spins_remaining, setNoOfSpinsRemaining] = useState(3);
  const [show_calender, setShowCalender] = useState(false);
  const [no_of_winner_display, setNoOfWinnersDisplay] = useState(0);
  const [spinner_color, setSpinnerColor] = useState(
    spinner_colors[Math.floor(Math.random() * spinner_colors.length)]
  );

  const [is_no_spinner_data, setIsNoSpinnerData] = useState(false);

  const setSpinnerData = (_selected_date: Date) => {
    const spinner_data = JSON.parse(localStorage.getItem("spinner_data")!);
    const winners_data = JSON.parse(localStorage.getItem("winners_data")!);
    let winners_data_dates = Object.keys(winners_data); //*Automatically sorts
    let spinner_data_dates = Object.keys(spinner_data);
    let spins_remaining = 3;
    let curr_winners = winners_data[DateToString(_selected_date)];
    let wheel_items = spinner_data[DateToString(_selected_date)]
      ? spinner_data[DateToString(_selected_date)]["items"]
      : undefined;

    if (!curr_winners && winners_data_dates.length > 0) {
      //* getting recent date winners
      curr_winners =
        winners_data[winners_data_dates[winners_data_dates.length - 1]];
      setSelectedDate(
        stringToDate(winners_data_dates[winners_data_dates.length - 1])
      );
    }

    if (!wheel_items) {
      wheel_items = [];
      if (spinner_data_dates.length > 3) {
        wheel_items = spinner_data[
          spinner_data_dates[spinner_data_dates.length - 4]
        ]["items"] as string[];
      }
    }
    //* Adding all winners into the wheel
    if (curr_winners) {
      let last_hour = "0";
      for (const hour in curr_winners) {
        wheel_items.push(
          ...curr_winners[hour]["winners"].filter((e: string) => e != null)
        );
        last_hour = hour;
      }

      let winners;
      if (winners_data[DateToString(_selected_date)]) {
        winners =
          winners_data[DateToString(_selected_date)][last_hour]["winners"];
        console.log({ winners });

        if (winners) {
          winners.map((winner: string) => {
            if (winner != null) {
              spins_remaining--;
              return winner;
            }
          });
          setNoOfWinnersDisplay(winners.length - spins_remaining);
        } else {
          setNoOfWinnersDisplay(0);
          winners = [];
        }
      }

      console.log({ spins_remaining });
      console.log({ last_hour });
      console.log({ winners });
      console.log({ no_of_winner_display: winners.length - spins_remaining });
      setNoOfSpinsRemaining(spins_remaining);

      if (!winners) {
        winners = winners_data[
          winners_data_dates[winners_data_dates.length - 1]
        ][last_hour]["winners"] as string[];
        winners = winners.filter((winner) => winner != null);
      }
      setWinner(wheel_items.indexOf(winners[winners.length - 1]));
      setWheelItems(wheel_items);
    } else {
      setWheelItems(wheel_items);
    }
    return { spins_remaining };
  };

  const fetchSpinnerData = async () => {
    let spinner_data_res = await fetch(api_url + "spinner-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let spinner_data = await spinner_data_res.json();
    if (Object.keys(spinner_data).length <= 3) {
      setIsNoSpinnerData(true);
    } else {
      setIsNoSpinnerData(false);
    }

    let winners_data_res = await fetch(api_url + "winners-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let winners_data = await winners_data_res.json();

    let end_time = new Date(spinner_data["end_time"]);
    let start_time = new Date(spinner_data["start_time"]);
    console.log("fetching again", end_time, start_time);
    localStorage.setItem("spinner_data", JSON.stringify(spinner_data));
    localStorage.setItem("winners_data", JSON.stringify(winners_data));

    let { spins_remaining } = setSpinnerData(start_time);
    setSelectedDate(start_time);
    setWinnersData(winners_data);

    const formatted_date = moment(selected_date).format("YYYY-MM-DD");
    let winners_data_res_1 = await fetch(
      api_url + `winners-data-1?date=${formatted_date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let winners_data_1 = await winners_data_res_1.json();
    setWinnersData_1(winners_data_1);
    setLoading(false);
    return {
      start_time,
      end_time,
      spins_remaining,
    };
  };

  const onCountDownComplete = async () => {
    let { spins_remaining } = await fetchSpinnerData();
    console.log("on onCountDownComplete");
    console.log({ spins_remaining, no_of_winner_display });

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

    if (spins_remaining > 0) {
      console.log("fetching new ....... 1");
      let end_time = new Date();
      end_time?.setSeconds(end_time.getSeconds() + next_spin_delay);
      setTimerEndDate(end_time);
      setTimerStartDate(new Date());
      setNoOfSpinsRemaining(spins_remaining - 1);
    }
    if (no_of_winner_display < 4) {
      console.log("fetching new ....... 2");
      await fetchSpinnerData();
    }
  };

  useEffect(() => {
    fetchSpinnerData().then(({ start_time, end_time }) => {
      setTimerEndDate(end_time);
      setTimerStartDate(start_time);
    });
  }, []);

  return (
    <div className="main">
      <nav
        style={{ margin: "1rem auto" }}
        className="flex flex-row items-center justify-center object-cover w-fit"
      >
        <a className="text-white font-medium first-letter:" href="#">
          {" "}
          Contact Us{" "}
        </a>
        <img src="logo.png" className="w-60 h-60" />
        <a className="text-white font-medium first-letter:" href="#">
          {" "}
          About Us{" "}
        </a>
      </nav>
      {!loading && (
        <>
          <div
            style={{ gap: "4rem", minHeight: "90vh", padding: "1rem 0" }}
            className="flex w-fit lg:gap-20 flex-row flex-wrap justify-center items-center mx-auto py-9"
          >
            {!is_no_spinner_data && wheel_items && (
              <Wheel
                spinner_wheel_color={spinner_color}
                onFinish={() => {
                  setNoOfWinnersDisplay(no_of_winner_display + 1);
                }}
                selected_item={winner}
                items={wheel_items}
              />
            )}
            <CountDown
              on_Complete={onCountDownComplete}
              start_date={timer_start_date}
              end_date={timer_end_date ? timer_end_date : new Date()}
            />
          </div>

          <div style={{ padding: "0 5rem" }} className="flex flex-col  ">
            {winners_data && (
              <h2 className="text-white font-medium mx-auto  text-center text-4xl">
                Today Winners
              </h2>
            )}
            <div
              style={{ marginTop: "3rem", gap: "0.2rem" }}
              className="flex flex-row  items-center justify-center mt-8 lg:justify-end w-full"
            >
              {!show_calender && winners_data && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-calendar"
                  >
                    <rect x={3} y={4} width={18} height={18} rx={2} ry={2} />
                    <line x1={16} y1={2} x2={16} y2={6} />
                    <line x1={8} y1={2} x2={8} y2={6} />
                    <line x1={3} y1={10} x2={21} y2={10} />
                  </svg>

                  <p
                    onClick={() => setShowCalender(true)}
                    className="cursor-pointer font-medium text-white"
                  >
                    {DateToString(selected_date)}
                  </p>
                </>
              )}
              {show_calender && winners_data && (
                <Calendar
                  className={"date-calender"}
                  onChange={(new_date: Date) => {
                    setShowCalender(false);
                    setSelectedDate(new_date);
                  }}
                  value={selected_date}
                  calendarType="US"
                  defaultActiveStartDate={selected_date}
                  minDate={stringToDate(Object.keys(winners_data)[0])}
                  maxDate={new Date()}
                />
              )}
            </div>
          </div>
          {winners_data_1 && <WinnersTable winners_data={winners_data_1} />}
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

export default App;
