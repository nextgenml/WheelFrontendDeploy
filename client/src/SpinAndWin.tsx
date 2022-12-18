import moment from "moment";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import AboutSection from "./components/About";
import CountDown from "./components/countdown";
import DateIcon from "./components/Icons/DateIcon";
import Wheel from "./components/wheel";
import WinnersTable from "./components/WinnersTable";
import { DateToString } from "./utils";

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

  // For filtering winners in the table
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [spinDelay, setSpinDelay] = useState(20);

  const setSpinnerData = (spinner_data: any) => {
    setWheelItems(spinner_data.participants);

    let curr_winners = (spinner_data.winners || []).filter((w: string) => !!w);

    if (spinner_data.participants && curr_winners.length > 0) {
      setWinner(
        spinner_data.participants.indexOf(curr_winners[curr_winners.length - 1])
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
    setSpinnerData(spinner_data);

    const f_start = moment(startDate).format("YYYY-MM-DD");
    const f_end = moment(endDate).format("YYYY-MM-DD");
    const winners_data_res = await fetch(
      api_url + `winners-data?from=${f_start}&to=${f_end}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const winners_data = await winners_data_res.json();
    setWinnersData(winners_data);
    setLoading(false);

    const wCount = (spinner_data.winners || []).filter(
      (x: string) => !!x
    ).length;

    setSpinDelay(spinner_data.spin_delay);
    return {
      start_time: new Date(spinner_data["start_time"]),
      end_time: new Date(spinner_data["end_time"]),
      spins_remaining: spinner_data.no_of_winners - wCount,
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
      end_time?.setSeconds(end_time.getSeconds() + spinDelay);
      setTimerEndDate(end_time);
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
      <nav
        style={{ margin: "1rem auto" }}
        className="flex flex-row items-center justify-center object-cover w-fit"
      >
        <a className="text-white font-medium first-letter:" href="/">
          Contact Us{" "}
        </a>
        <img src="logo.png" className="w-60 h-60" alt="logo" />
        <a className="text-white font-medium first-letter:" href="/">
          About Us{" "}
        </a>
      </nav>
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
              <button onClick={fetchSpinnerData} className="get-winners-btn">
                Get Winners
              </button>
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
      <AboutSection />
    </div>
  );
}
