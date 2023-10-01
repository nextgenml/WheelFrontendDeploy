import { Box, Link, Typography } from "@mui/material";
import { useAccount } from "wagmi";

const PrivateRouteBasic = ({ component }) => {
  const { isConnected } = useAccount();
  if (isConnected) return <>{component}</>;
  else
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Please connect your wallet using metamask
        </Typography>

        <Typography variant="h5" sx={{ mb: 20 }}>
          To connect wallet, please follow steps in video:&nbsp;&nbsp;
          <Link href="https://www.youtube.com/watch?v=T_EppmwS8HM&ab_channel=nexgenML">
            Youtube
          </Link>
        </Typography>
      </Box>
    );
};
export default PrivateRouteBasic;
