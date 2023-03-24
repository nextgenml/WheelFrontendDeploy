import { useEffect } from "react";
import "./index.css";

interface Props {
  end_date: Date;
  start_date: Date;
  on_Complete?: Function;
  spinType: string;
  nextUsersCount: number;
}
var _id: NodeJS.Timer;
export default function CountDown({
  end_date,
  start_date,
  on_Complete,
  spinType,
  nextUsersCount,
}: Props) {
  const countDown = () => {
    let today = start_date;
    today.setSeconds(today.getSeconds() + 1);
    let vDate = end_date;
    const t = vDate.getTime() - today.getTime();
    var day = Math.floor(t / (1000 * 60 * 60 * 24));
    var hour = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minute = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    var sec = Math.floor((t % (1000 * 60)) / 1000);
    // console.log('timer time  : ',hour,minute,sec);

    if (day <= 0 && hour <= 0 && minute <= 0 && sec <= 0) {
      day = hour = minute = sec = 0;
      if (on_Complete) {
        on_Complete();
      }
      //* Stopping the timer.
      clearInterval(_id);
    }
    if (window && window.document) {
      let document: any = window.document;
      const hourDiv = document.getElementById("day_div");
      if (day > 0) {
        document.getElementById("day").innerText = day;
        hourDiv.style.display = "block";
      } else {
        hourDiv.style.display = "none";
      }
      document.getElementById("hour").innerText = hour;
      document.getElementById("min").innerText = minute;
      document.getElementById("sec").innerText = sec;
    }
  };
  useEffect(() => {
    _id = setInterval(countDown, 1000);
    return () => clearInterval(_id);
  }, [start_date, end_date]);

  return (
    <div className="container">
      <h1>Next Spin Eligible Users Count: {nextUsersCount}</h1>
      <h1>Next {spinType} Spin Is In</h1>
      <div className="timers">
        <div className="timer" id="day_div">
          <div>
            <span id="day" /> Day
          </div>
        </div>
        <div className="timer">
          <div>
            <span id="hour" /> Hour
          </div>
        </div>
        <div className="timer">
          <div>
            <span id="min" /> Minute
          </div>
        </div>
        <div className="timer">
          <div>
            <span id="sec" /> Second
          </div>
        </div>
      </div>
    </div>
  );
}
