import { Typography } from "@mui/material";
import { useAccount } from "wagmi";
import { getAuthToken } from "../../API";

const PrivateRoute = ({ component }) => {
  const { isConnected } = useAccount();
  const token = getAuthToken();
  if (token && isConnected) return <>{component}</>;
  else
    return (
      <Typography variant="h6" sx={{ mb: 20 }}>
        Please connect your wallet and sign the message to login. If logged in,
        please refresh the page to sign the message
      </Typography>
    );
};
export default PrivateRoute;
