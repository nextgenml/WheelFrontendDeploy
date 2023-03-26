import Backdrop from "@mui/material/Backdrop";
import { HashLoader } from "react-spinners";

export default function Loading({ loading }) {
  return (
    <div>
      <Backdrop sx={{ zIndex: "10000" }} open={loading}>
        <HashLoader color="#FB9C03" loading={loading} />
      </Backdrop>
    </div>
  );
}
