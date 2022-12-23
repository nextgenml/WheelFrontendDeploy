import { Box, Grid, Typography } from "@mui/material";
import React from "react";
let borderStyle = {
  borderRight: "2px solid #3B7AAA",
  borderLeft: "2px solid #3B7AAA",
  borderTop: "2px solid rgb(251, 156, 3)",
  borderBottom: "2px solid rgb(251, 156, 3)",
  "&:hover": {
    borderBottom: "2px solid #3B7AAA",
    borderRight: "2px solid rgb(251, 156, 3)",
    borderTop: "2px solid #3B7AAA",
    borderLeft: "2px solid rgb(251, 156, 3)",
  },
};

export default function Features() {
  return (
    <Box id="goals">
      <Typography
        color="#3B7AAA"
        sx={{
          fontFamily: "Audiowide",
          textAlign: "center",
        }}
        variant="h4"
      >
        OUR GOALS
      </Typography>
      <Grid container mt={4} spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="rgb(251, 156, 3)"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Vision
            </Typography>
            <Typography
              color="white"
              sx={{
                textAlign: "justify",
                mt: 2,
              }}
            >
              We help empower communities to own and monetize data in the
              decentralized world. Our advanced Blockchain AI solutions help
              with data automation, leading to new products, new services,
              tweaks to existing products to make them less costly or more
              valuable, and an array of other advantages. Ultimately, this will
              make the token more competitive in the rapidly changing digital
              landscape. 
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="rgb(251, 156, 3)"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Mission
            </Typography>
            <Typography
              color="white"
              sx={{
                textAlign: "justify",
                mt: 2,
              }}
            >
              We help empower communities to own and monetize data in the
              decentralized world. Our advanced Blockchain AI solutions help
              with data automation, leading to new products, new services,
              tweaks to existing products to make them less costly or more
              valuable, and an array of other advantages. Ultimately, this will
              make the token more competitive in the rapidly changing digital
              landscape. 
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography
            color="#3B7AAA"
            sx={{
              fontFamily: "Audiowide",
              textAlign: "center",
            }}
            variant="h4"
            id="values"
          >
            OUR VALUES
          </Typography>
          <Typography
            color="white"
            sx={{
              textAlign: "center",
              mt: 2,
            }}
          >
            The bedrock of our culture
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="rgb(251, 156, 3)"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Creating and enhancing the data to enable better AI via human
              intelligence & Blockchain
            </Typography>
            <Typography
              color="white"
              sx={{
                textAlign: "justify",
                mt: 2,
              }}
            >
              We help empower communities to own and monetize data in the
              decentralized world. Our advanced Blockchain AI solutions help
              with data automation, leading to new products, new services,
              tweaks to existing products to make them less costly or more
              valuable, and an array of other advantages. Ultimately, this will
              make the token more competitive in the rapidly changing digital
              landscape. 
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="rgb(251, 156, 3)"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Community First
            </Typography>
            <Typography
              color="white"
              sx={{
                textAlign: "justify",
                mt: 2,
              }}
            >
              It starts and ends here. Our complete platform and approach to
              customer service has been developed from the ground up to put the
              interests of our community first.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="rgb(251, 156, 3)"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Trust through transparency
            </Typography>
            <Typography
              color="white"
              sx={{
                textAlign: "justify",
                mt: 2,
              }}
            >
              Trust fuelled by transparency underlies everything we do,
              internally and externally, across teams and products.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="rgb(251, 156, 3)"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Innovation is fuelled by imagination.
            </Typography>
            <Typography
              color="white"
              sx={{
                textAlign: "justify",
                mt: 2,
              }}
            >
              We lean on innovation to make investing better, simpler, and more
              constructive for our token holders.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="rgb(251, 156, 3)"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Simplify complexity
            </Typography>
            <Typography
              color="white"
              sx={{
                textAlign: "justify",
                mt: 2,
              }}
            >
              "Simplicity is the ultimate sophistication" - we aspire to
              simplify the complicated by technology with an intuitive user
              experience.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
