/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import "./index.css";

interface Props {
  items: string[];
  selected_item: number | null;
  onFinish?: Function;
}

const spinner_colors = [
  "#CBE4F9",
  "#CDF5F6",
  "#EFF9DA",
  "#F9EBDF",
  "#F9D8D6",
  "#D6CDEA",
];

export default function Wheel({ items, selected_item, onFinish }: Props) {
  const [spinning, setSpinning] = useState<"spinning" | "">("");
  const [wheelVars, setwheelVars] = useState<any>({});
  const spinner_color =
    spinner_colors[Math.floor(Math.random() * spinner_colors.length)];

  const bg_color: any = {
    "--wheel-color": spinner_color,
    // '--neutral-color':
  };

  useEffect(() => {
    setSpinning(selected_item !== null ? "spinning" : "");
    setwheelVars({
      "--nb-item": items.length,
      "--selected-item": selected_item,
    });
    spin_wheel();
    onComplete();
  }, [selected_item, items]);

  const onComplete = () => {
    setTimeout(() => {
      if (onFinish) {
        onFinish(selected_item, items);
      }
    }, 1000 * 3.5);
  };
  const spin_wheel = () => {
    setSpinning("");
    setTimeout(() => {
      setSpinning("spinning");
    }, 500);
  };

  return (
    <div className="wheel-container" style={bg_color}>
      <div className={`wheel ${spinning}`} id="spinner" style={wheelVars}>
        {items.map((item, index) => {
          const item_num: any = {
            "--item-nb": index,
          };
          return (
            <div className="wheel-item" key={index} style={item_num}>
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}
