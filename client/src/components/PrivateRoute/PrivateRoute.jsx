import { Box, Link, Typography } from "@mui/material";
import { useAccount } from "wagmi";
import { getAuthToken } from "../../API/index.js";

const PrivateRoute = ({ component }) => {
  const { isConnected } = useAccount();
  const token = getAuthToken();
  if (token && isConnected) return <>{component}</>;
  else
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Please connect your wallet and sign the message to login. If logged
          in, please refresh the page to sign the message
        </Typography>

        <Typography variant="h5" sx={{ mb: 20 }}>
          To connect wallet, please follow steps in video:&nbsp;&nbsp;
          <Link href="https://www.youtube.com/watch?v=T_EppmwS8HM&ab_channel=nexgenML">
            Youtube
          </Link>
        </Typography>

        {/* <Typography variant="h5" sx={{ mb: 20 }}>
          Once connected to Metamask, the application will switch to Goreli Test
          Network
        </Typography> */}
      </Box>
    );
};
export default PrivateRoute;
