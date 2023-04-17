import { Box, Grid, Typography, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import styles from './BuyNextGen.module.css'
let borderStyle = {
  borderRight: "2px solid #3B7AAA",
  borderLeft: "2px solid #3B7AAA",
  borderTop: "2px solid rgb(251, 156, 3)",
  borderBottom: "2px solid rgb(251, 156, 3)",
};
export default function BuyNextGen() {
  return (
    <Box my={5} id="buy-nexgen">
      <Typography
        color="#3B7AAA"
        sx={{
          fontFamily: "Audiowide",
          textAlign: "center",
        }}
        variant="h4"
      >
        BUY NEXGEN ML
      </Typography>

      <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <Typography variant="h6" className={styles.contractText}>Contract - 0x3858daD8A5b3364BE56DE0566AB59e3D656c51F6</Typography>
        <Button>
            <ContentCopyIcon
              onClick={() =>
                navigator.clipboard.writeText(
                  '0x3858daD8A5b3364BE56DE0566AB59e3D656c51F6'
                )
              }
            />
        </Button>
      </Box>
      

      <Grid container mt={4} spacing={3}>
        <Grid item xs={12}>
          <iframe
            title="buy_nextgenml"
            src="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x3858dad8a5b3364be56de0566ab59e3d656c51f6"
            height="660px"
            width="100%"
            style={{
              ...{
                border: "0",
                margin: "0 auto",
                marginBottom: ".5rem",
                display: "block",
                borderRadius: "10px",
                maxWidth: "960px",
                minWidth: "300px",
              },
              ...borderStyle,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
