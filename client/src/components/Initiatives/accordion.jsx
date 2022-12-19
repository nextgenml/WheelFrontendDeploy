import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

let borderStyle = {
  borderRight: "2px solid #3B7AAA",
  borderLeft: "2px solid #3B7AAA",
  borderTop: "2px solid rgb(251, 156, 3)",
  borderBottom: "2px solid rgb(251, 156, 3)",
  background:
    "linear-gradient(0deg, rgba(251,156,5,1) 0%, rgba(59,122,170,1) 100%)",
  borderRadius: "10px",
  my: 3,
  "&:hover": {
    borderBottom: "2px solid #3B7AAA",
    borderRight: "2px solid rgb(251, 156, 3)",
    borderTop: "2px solid #3B7AAA",
    borderLeft: "2px solid rgb(251, 156, 3)",
  },
};

export default function AccordionElement({
  title,
  subTitle,
  disableCondition,
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
        <Typography color="white">{subTitle}</Typography>
      </AccordionDetails>
    </Accordion>
  );
}
