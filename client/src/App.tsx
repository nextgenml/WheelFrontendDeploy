import { useEffect, useState } from "react";
import Wheel from "./components/wheel";
import CountDown from "./components/countdown";
import WinnersTable from "./components/WinnersTable";
import Calendar from "react-calendar";
import { next_spin_delay } from "./config";
import { DateToString, stringToDate } from "./utils";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import AboutSection from "./components/About";
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

  const [no_of_winner_display, setNoOfWinnersDisplay] = useState(0);
  const [spinner_color, setSpinnerColor] = useState(
    spinner_colors[Math.floor(Math.random() * spinner_colors.length)]
  );

  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [is_no_spinner_data, setIsNoSpinnerData] = useState(false);
  const setSpinnerData = (spinner_data: any) => {
    setWheelItems(spinner_data.items);

    let curr_winners = (spinner_data.winners || []).filter((w: string) => !!w);

    if (spinner_data.items && curr_winners.length > 0) {
      setWinner(
        spinner_data.items.indexOf(curr_winners[curr_winners.length - 1])
      );
    }
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

    let end_time = new Date(spinner_data["end_time"]);
    let start_time = new Date(spinner_data["start_time"]);
    console.log("fetching again", end_time, start_time);
    localStorage.setItem("spinner_data", JSON.stringify(spinner_data));
    // localStorage.setItem("winners_data", JSON.stringify(winners_data_temp));

    setSpinnerData(spinner_data);

    let wCount = (spinner_data.winners || []).filter((x: string) => !!x).length;

    setSelectedDate(start_time);
    // setWinnersData(winners_data_temp);

    const f_start = moment(startDate).format("YYYY-MM-DD");
    const f_end = moment(endDate).format("YYYY-MM-DD");
    let winners_data_res_1 = await fetch(
      api_url + `winners-data-1?from=${f_start}&to=${f_end}`,
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
      spins_remaining: 3 - wCount,
    };
  };

  const onCountDownComplete = async () => {
    let { spins_remaining } = await fetchSpinnerData();

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
            {!is_no_spinner_data && wheel_items ? (
              <Wheel
                spinner_wheel_color={spinner_color}
                onFinish={() => {
                  setNoOfWinnersDisplay(no_of_winner_display + 1);
                }}
                selected_item={winner}
                items={wheel_items}
              />
            ) : (
              <p style={{ color: "white", fontSize: "20px" }}>
                No Spin Last Time As Minimum Wallet Requirement Is Not Met
              </p>
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
                Winners on the selected date range
              </h2>
            )}
            <div
              style={{ marginTop: "3rem", gap: "0.2rem" }}
              className="flex flex-row  items-center justify-center mt-8 lg:justify-end w-full"
            >
              {!showStart && (
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
                  defaultActiveStartDate={selected_date}
                />
              )}
              {!showEnd && (
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
                  defaultActiveStartDate={selected_date}
                />
              )}
              <button
                onClick={fetchSpinnerData}
                style={{
                  color: "white",
                  border: "1px solid orange",
                  marginLeft: "16px",
                  padding: "8px",
                  borderRadius: "8px",
                }}
              >
                Get Winners
              </button>
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
      <AboutSection />
    </div>
  );
}

export default App;
