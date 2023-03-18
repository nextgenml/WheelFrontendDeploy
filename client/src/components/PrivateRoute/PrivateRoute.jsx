import { Typography } from "@mui/material";
import { useAccount } from "wagmi";

const PrivateRoute = ({ component }) => {
  const { isConnected } = useAccount();

  if (isConnected) return <>{component}</>;
  else
    return (
      <Typography variant="h6" sx={{ mb: 20 }}>
        Please connect your wallet
      </Typography>
    );
};
export default PrivateRoute;
