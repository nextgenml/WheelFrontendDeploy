import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Grid, Button } from "@mui/material";

let borderStyle = {
  backgroundColor: "#f57a2f",
  // border: "3px solid #802600",
  borderRadius: "10px",
  my: 3,
};

export default function AccordionElement({
  title,
  subTitle,
  disableCondition,
  imageUrl,
}) {
  return (
    <Accordion disabled={disableCondition} sx={{ ...borderStyle }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography
          sx={{
            fontFamily: "Audiowide",
            color: "white",
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box className="initiative-section">
          <Grid container spacing={2}>
            <Grid item md={6}>
              <Typography color="white">{subTitle}</Typography>
            </Grid>
            <Grid item md={6}>
              <img
                src={imageUrl}
                width={1024}
                height={576}
                alt={title}
                className="initiative-image"
              />
              <Button className="initiative-btn">ARTICLE</Button>
              <Button className="initiative-btn">IMAGE</Button>
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
