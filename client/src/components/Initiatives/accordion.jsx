import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Grid, Button, Link } from "@mui/material";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router";

let borderStyle = {
  backgroundColor: "#fb9c01",
  // border: "3px solid #802600",
  borderRadius: "10px",
  my: 3,
};

export default function AccordionElement({
  title,
  subTitle,
  disableCondition,
  imageUrl,
  extArticleUrl,
  extVideoUrl,
}) {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  return (
    <Accordion disabled={disableCondition} sx={{ ...borderStyle }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography
          sx={{
            fontFamily: "Audiowide",
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box className="initiative-section">
          <Grid container spacing={2}>
            <Grid item md={6}>
              <Typography>{subTitle}</Typography>
            </Grid>
            <Grid item md={6} sx={{ overflow: "hidden" }}>
              <img
                src={imageUrl}
                width={1024}
                height={576}
                alt={title}
                className="initiative-image"
              />
              {isConnected && (
                <>
                  <Link target="_blank" style={{ textDecoration: "none" }}>
                    <Button
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => navigate(extArticleUrl)}
                    >
                      BLOG
                    </Button>
                  </Link>
                  {/* <Link
                    href={extVideoUrl}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                  >
                    <Button className="initiative-btn">VIDEO</Button>
                  </Link> */}
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
