import moment from "moment";
import React from "react";
import AccordionElement from "./accordion";
import NXMLChat from '../NXMLChat/NXMLChat'
import { Redirect } from 'react-router-dom';

const launchDate = "2022-12-18 12:00:00";
export default function Initiatives() {
  console.log(
    +moment(launchDate).add(120, "days").format("x") > +moment().format("x")
  );
  return (
    <>
      <AccordionElement
        title={"Initiative 1"}
        subTitle="Social Media helps with the connectivity and reach of technology that connects humans to the real and virtual world. Moreover, there is a plethora of data from users and their activities that require processing. As a result, ANN offers its solutions to comprehend the potential to analyze users' behaviors, which can help determine whether the content you see on social media is true or false (scam prevention and fake info). It also helps with competitive analysis using various data sources from social media sites and their features of interactions."
        // disableCondition={
        //   +moment(launchDate).add(120, "days").format("x") > +moment().format("x")
        // }
        disableCondition={
          +moment(launchDate).add(0, "days").format("x") > +moment().format("x")
        }
        imageUrl="/initiative1.jpg"
        extVideoUrl="https://www.google.com"
        extArticleUrl="/nxml-blog-chat/social-media"
      />
      <AccordionElement
        title={"Initiative 2"}
        subTitle="The Healthcare industry deals with a large amount of data daily, considering the increase in patients and their reports. Healthcare professionals and institutions also generate large amounts of data with the increase in specializations. Token uses Artificial Neural Nets (ANN) to ensure that the data from various sources are easy to analyze and manage. Most importantly, it enables the opportunities to discover new solutions and medications to help patients and professionals."
        imageUrl="/initiative1.jpg"
        extVideoUrl="https://www.google.com"
        extArticleUrl="/nxml-blog-chat/healthcare"
        // disableCondition={
        //   +moment(launchDate).add(240, "days").format("x") >
        //   +moment().format("x")
        // }
        disableCondition={
          +moment(launchDate).add(0, "days").format("x") > +moment().format("x")
        }
      />
      <AccordionElement
        title={"Initiative 3"}
        subTitle="AI systems can readily acquire and process knowledge. They can rapidly build up vast representations of bodies of knowledge, which can be harnessed to help us develop our understanding and learn facts. This is easiest in well-defined subject areas, such as science and math but can also be harnessed in other disciplines which require knowledge of facts without context."
        imageUrl="/initiative1.jpg"
        extVideoUrl="https://www.google.com"
        extArticleUrl="/nxml-blog-chat/education"
        // disableCondition={
        //   +moment(launchDate).add(360, "days").format("x") >
        //   +moment().format("x")
        // }
        disableCondition={
          +moment(launchDate).add(0, "days").format("x") > +moment().format("x")
        }
      />
      <AccordionElement
        title={"Initiative 4"}
        subTitle="The Future of Energy shows that the industry is undergoing a profound transformation. The supply of energy is shifting to renewables and lower emissions fuels. Consumers and industrial users are becoming more active participants in the energy market. They are choosing new technologies, products, and data to meet their needs. At the same time, the grid is changing, becoming more distributed and reliant on a diverse range of energy sources and storage. Sectors are converging, presenting new opportunities and challenges. Data and artificial intelligence availability have increased, demanding flexibility and energy efficiency. The latest technologies such as the Internet of Things and artificial intelligence, are also essential. The more intelligence we can build into the energy system, the more resilient it becomes."
        imageUrl="/initiative1.jpg"
        extVideoUrl="https://www.google.com"
        extArticleUrl="/nxml-blog-chat/energy"
        // disableCondition={
        //   +moment(launchDate).add(480, "days").format("x") >
        //   +moment().format("x")
        // }
        disableCondition={
          +moment(launchDate).add(0, "days").format("x") > +moment().format("x")
        }
      />
      <AccordionElement
        title={"Initiative 5"}
        subTitle="Artificial intelligence (AI) in agriculture could offer a suitable solution to the challenges endangering global food security. Precision agriculture refers to farming methods that measure and respond to crop variability, allowing land management to optimize efficiency and reduce waste. AI could be used to support both crops and soil to perform better. Climate change, increasing populations, competing demands on land to produce biofuels, and declining soil quality have all made it more and more challenging to feed global citizens."
        imageUrl="/initiative1.jpg"
        extVideoUrl="https://www.google.com"
        extArticleUrl="/nxml-blog-chat/food-production"
        // disableCondition={
        //   +moment(launchDate).add(600, "days").format("x") >
        //   +moment().format("x")
        // }
        disableCondition={
          +moment(launchDate).add(0, "days").format("x") > +moment().format("x")
        }
      />
      <AccordionElement
        title={"Initiative 6"}
        subTitle="It is expected that as technology advances in AI and machine learning, real-time data and analytics will be the centerpiece for fighting against cybercrimes. This will allow cybersecurity experts to use machines to overcome the industry skills shortage and perform various security tasks quickly and efficiently."
        imageUrl="/initiative1.jpg"
        extVideoUrl="https://www.google.com"
        extArticleUrl="/nxml-blog-chat/security"
        // disableCondition={
        //   +moment(launchDate).add(720, "days").format("x") >
        //   +moment().format("x")
        // }
        disableCondition={
          +moment(launchDate).add(0, "days").format("x") > +moment().format("x")
        }
      />
      <AccordionElement
        title={"Initiative 7"}
        subTitle="Humanity is on the verge of establishing a permanent extraterrestrial colony for the first time in human history. This brings a lot of opportunity and many concerns as space exploration will start being a commercial activity rather than a tightly controlled state endeavor."
        imageUrl="/initiative1.jpg"
        extVideoUrl="https://www.google.com"
        extArticleUrl="/nxml-blog-chat/space"
        // disableCondition={
        //   +moment(launchDate).add(1080, "days").format("x") >
        //   +moment().format("x")
        // }
        disableCondition={
          +moment(launchDate).add(0, "days").format("x") > +moment().format("x")
        }
      />
      <AccordionElement
        title={"Initiative 8"}
        subTitle="Artificial intelligence (AI) is a double-edged sword for development. AI deployment can increase productivity and create new products, leading to job creation and economic growth. AI's impact is likely to affect populations in the developing world disproportionately."
        imageUrl="/initiative1.jpg"
        extVideoUrl="https://www.google.com"
        extArticleUrl="/nxml-blog-chat/economic-development"
        // disableCondition={
        //   +moment(launchDate).add(1080, "days").format("x") >
        //   +moment().format("x")
        // }
        disableCondition={
          +moment(launchDate).add(0, "days").format("x") > +moment().format("x")
        }
      /><AccordionElement
        title={"Initiative 9"}
        subTitle="Digitalization is changing how people interact with the world around them. A unique relationship: Cognitive capabilities allow machines to interact with humans more seamlessly. The decentralization of data: The power shifts to the individual. Digitalization means less waste, a lower carbon footprint, and greater productivity per input. Social awareness of environmental sustainability pushes the industry towards becoming more digitally enabled."
        imageUrl="/initiative1.jpg"
        extVideoUrl="https://www.google.com"
        extArticleUrl="/nxml-blog-chat/social-welfare"
        // disableCondition={
        //   +moment(launchDate).add(1200, "days").format("x") >
        //   +moment().format("x")
        // }
        disableCondition={
          +moment(launchDate).add(0, "days").format("x") > +moment().format("x")
        }
      />
      <AccordionElement
        title={"Initiative 10"}
        subTitle="Sustainability and environmental protection are now part of our daily lives. What we eat, where we travel, the clothes we wear – each of these impacts our environmental footprint, and now the importance of these issues has made its way into the political arena. Taking care of the planet, we call home needs to be a priority. Using new and emerging technologies will play a critical role in combating climate change. AI is and will continue to be a valuable technology from which many industries will benefit. Applying AI-powered solutions to better the environment must be considered if the goal is to make the future more sustainable."
        imageUrl="/initiative1.jpg"
        extVideoUrl="https://www.google.com"
        extArticleUrl="/nxml-blog-chat/environment-protection"
        // disableCondition={
        //   +moment(launchDate).add(1320, "days").format("x") >
        //   +moment().format("x")
        // }
        disableCondition={
          +moment(launchDate).add(0, "days").format("x") > +moment().format("x")
        }
      />
    </>
  );
}
