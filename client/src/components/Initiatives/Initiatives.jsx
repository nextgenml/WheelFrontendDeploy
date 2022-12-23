import moment from "moment";
import React from "react";
import AccordionElement from "./accordion";
const launchDate = "2022-12-18 12:00:00";
export default function Initiatives() {
  console.log(
    +moment(launchDate).add(120, "days").format("x") > +moment().format("x")
  );
  return (
    <>
      <AccordionElement
        title={"Initiative 1"}
        subTitle="Must purchase minimum 0.01 worth of PLUTONIUM to qualify. Must hold the token, The longer you hold the more chances you get to WIN. With every purchase, wallet addresses will be monitored and entered into giveaway as long as wallet qualifies. There is no limit to entries. We want to reward our loyal community members with special MODERN WAREFARE II items such as CALL OF DUTY points, double xp, merch, games etc on all gaming platforms PS5, XBOX, PC etc"
        disableCondition={
          +moment(launchDate).add(0, "days").format("x") > +moment().format("x")
        }
        imageUrl="https://plutoniumprotocol.com/wp-content/uploads/2022/12/mw2-reveal-meta-share-1024x576.jpg"
      />
      <AccordionElement
        title={"Initiative 2"}
        subTitle="240 days from Launch"
        disableCondition={
          +moment(launchDate).add(240, "days").format("x") >
          +moment().format("x")
        }
      />
      <AccordionElement
        title={"Initiative 3"}
        subTitle="360 days from Launch"
        disableCondition={
          +moment(launchDate).add(360, "days").format("x") >
          +moment().format("x")
        }
      />
      <AccordionElement
        title={"Initiative 4"}
        subTitle="480 days from Launch"
        disableCondition={
          +moment(launchDate).add(480, "days").format("x") >
          +moment().format("x")
        }
      />
      <AccordionElement
        title={"Initiative 5"}
        subTitle="600 days from Launch"
        disableCondition={
          +moment(launchDate).add(600, "days").format("x") >
          +moment().format("x")
        }
      />
      <AccordionElement
        title={"Initiative 6"}
        subTitle="720 days from Launch"
        disableCondition={
          +moment(launchDate).add(720, "days").format("x") >
          +moment().format("x")
        }
      />
      <AccordionElement
        title={"Initiative 8"}
        subTitle="1080 days from Launch"
        disableCondition={
          +moment(launchDate).add(1080, "days").format("x") >
          +moment().format("x")
        }
      />
      <AccordionElement
        title={"Initiative 9"}
        subTitle="1200 days from Launch"
        disableCondition={
          +moment(launchDate).add(1200, "days").format("x") >
          +moment().format("x")
        }
      />
      <AccordionElement
        title={"Initiative 10"}
        subTitle="1200 days from Launch"
        disableCondition={
          +moment(launchDate).add(1320, "days").format("x") >
          +moment().format("x")
        }
      />
    </>
  );
}
