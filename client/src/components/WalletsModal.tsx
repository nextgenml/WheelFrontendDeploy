/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

interface Props {
  data: any;
  onClose: () => void;
}
const WalletsModal = (props: Props) => {
  console.log("data", props.data);
  const { data } = props;
  useEffect(() => {
    if (props.data) {
      fetchData();
    }
  }, [props.data]);

  const [wallets, setWallets] = useState([]);
  const fetchData = async () => {
    const winners_data_res = await fetch(
      `/spin-participants?day=${data.day}&spin_no=${data.spin}&type=${data.type}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const res = await winners_data_res.json();
    setWallets(res);
  };
  return (
    <div>
      <Modal
        open={props.data && props.data.spin > 0}
        onClose={() => props.onClose()}
      >
        <p className="wallets-title">Wallets participated in spin</p>
        <br></br>
        <ul className="wallets-list">
          {wallets.map((w, index) => {
            return (
              <li>
                {index + 1}. {w}
              </li>
            );
          })}
        </ul>
      </Modal>
    </div>
  );
};

export default WalletsModal;
