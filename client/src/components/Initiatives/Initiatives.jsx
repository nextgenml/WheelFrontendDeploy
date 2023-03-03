import moment from "moment";
import React from "react";
import AccordionElement from "./accordion";
import NXMLChat from "../NXMLChat/NXMLChat";
import { Redirect } from "react-router-dom";
import CustomizeBlogs from "../CustomizeBlogs/CustomizeBlogs";

const launchDate = "2022-12-18 12:00:00";
export default function Initiatives() {
  console.log(
    +moment(launchDate).add(120, "days").format("x") > +moment().format("x")
  );
  return (
    <>
      <AccordionElement
        title={"Social Media"}
        subTitle="Blockchain and AI are transforming the way we think about social media. By leveraging these technologies, we can create a more trustworthy and accurate online environment that values honesty and authenticity. With verifiable user identities, fact-checking, and source tracking, we can reduce the spread of misinformation on social media. Meanwhile, AI-powered content moderation and trustworthy content recommendations help to ensure that users are exposed to accurate and reliable information. In addition, blockchain can be used to securely store user data and create encrypted communication channels, while user reputation systems and incentives can reward users for sharing accurate and trustworthy content. By using these technologies, we can create a social media landscape that not only promotes honesty and accuracy, but also allows users to monetize their content through the creation of unique digital assets."
        // disableCondition={
        //   +moment(launchDate).add(120, "days").format("x") > +moment().format("x")
        // }
        disableCondition={
          +moment(launchDate).add(0, "days").format("x") > +moment().format("x")
        }
        imageUrl="/socialmedia.png"
        extVideoUrl="https://www.google.com"
        extArticleUrl="/nxml-blog-chat/social-media"
      />
      <AccordionElement
        title={"Healthcare"}
        subTitle="Blockchain and AI are transforming the healthcare industry by providing new tools and technologies that can improve the accuracy, efficiency, and accessibility of medical care. By using AI to assist in the diagnosis of diseases, develop new treatments, and even prevent epidemics, we can help to improve patient outcomes and create a more effective healthcare system. Meanwhile, blockchain can be used to securely store and share medical data, track the progress of clinical trials, and manage the movement of medical supplies, enabling greater collaboration between healthcare professionals and improving the delivery of care. In addition, AI can be used to identify eligible participants for clinical trials, detect medical fraud, and support telemedicine and remote monitoring. By using these technologies, we can create a healthcare system that is more responsive to the needs of patients and providers, while also providing new opportunities for users to monetize their content through the creation of unique digital assets."
        imageUrl="/healthcare.png"
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
        title={"Education"}
        subTitle="Blockchain and AI are revolutionizing the way we approach education. By leveraging these technologies, we can create personalized learning experiences that support every holder in reaching their highest potential. With personalized curriculum, adaptive learning, and personalized feedback, AI algorithms can tailor education to the individual needs and abilities of each holder. Meanwhile, blockchain can be used to track and verify holder progress, creating personalized assessments and learning paths based on their needs. In addition, AI can provide learning analytics, virtual tutoring, and immersive virtual reality experiences, while blockchain can support personalized recommendations and tailored support. Together, these technologies offer a wealth of opportunities for enhancing the effectiveness and inclusivity of education."
        imageUrl="/education.png"
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
        title={"Energy"}
        subTitle="Blockchain and AI are transforming the way we think about energy, enabling us to create more sustainable and efficient energy systems. By using smart grids and renewable energy sources, we can reduce our reliance on fossil fuels and preserve our natural resources for future generations. By using AI to optimize energy production and distribution, we can improve the efficiency of our energy systems and reduce waste. Meanwhile, blockchain can be used to track and verify the origin and use of energy, facilitating the creation of new business models and incentives that encourage the adoption of sustainable energy practices. In addition, blockchain can be used to facilitate peer-to-peer energy trading, enabling individuals and businesses to buy and sell excess energy directly. By using these technologies, we can create an energy system that is more responsive to the needs of the planet and its inhabitants, while also providing new opportunities for users to monetize their content through the creation of unique digital assets."
        imageUrl="/energy.png"
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
        title={"Food Production"}
        subTitle="Blockchain and AI are transforming the way we think about food production, enabling us to create more efficient and sustainable food systems. By adopting innovations such as vertical farming and precision agriculture, we can produce food more efficiently while reducing our environmental impact. By using AI to optimize the production of crops and livestock, we can increase yields and reduce waste. Meanwhile, blockchain can be used to track and verify the origin and quality of food, enabling consumers to make informed choices and supporting the development of more sustainable food systems. In addition, blockchain can be used to optimize the food supply chain and prevent food fraud, while also supporting sustainable sourcing and animal welfare practices. By using these technologies, we can create a food system that is more responsive to the needs of the planet and its inhabitants, while also providing new opportunities for users to monetize their content through the creation of unique digital assets."
        imageUrl="/food.png"
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
        title={"Security"}
        subTitle="Blockchain and AI are transforming the way we think about security, enabling us to identify and respond to threats more effectively. By using AI to analyze data from various sources and identify patterns that may indicate the presence of a threat, we can take proactive measures to prevent them. Meanwhile, blockchain can be used to securely store and share security-related data, enabling greater collaboration between security professionals and improving the effectiveness of response efforts. In addition, blockchain can be used to create verifiable digital identities and secure access control systems, improving the security of online transactions and systems. By using these technologies, we can create a more secure and resilient society that is better equipped to deal with the challenges of the modern world. In addition, users can monetize their data through the creation of unique digital assets that can be bought and sold on the blockchain."
        imageUrl="/security.png"
        extVideoUrl="https://www.google.com"
        extArticleUrl="/nxml-blog-chat/security"
        // disableCondition={
        //   +moment(launchDate).add(1080, "days").format("x") >
        //   +moment().format("x")
        // }
        disableCondition={
          +moment(launchDate).add(0, "days").format("x") > +moment().format("x")
        }
      />
      <AccordionElement
        title={"Space Exploration"}
        subTitle="Blockchain and AI are transforming the way we think about space exploration, enabling us to develop intelligent robots that can assist us in exploring and colonizing other planets. By using AI to design and optimize intelligent robots for space exploration, we can create robots that are capable of adapting to new environments and performing a wide range of tasks, including exploration, analysis, and construction. Meanwhile, blockchain can be used to securely store and share data related to space exploration, enabling scientists, engineers, and other experts to collaborate more effectively. In addition, AI algorithms can be used to analyze data collected by intelligent robots or other sources, enabling scientists to make new discoveries and better understand other planets. By using these technologies, we can create a new era of space exploration that is more efficient, effective, and sustainable. In addition, users can monetize their data by creating unique digital assets that can be bought and sold on the blockchain."
        imageUrl="/space.png"
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
        title={"Economic Development"}
        subTitle="Blockchain and AI are transforming the way we think about economic development, enabling us to create new jobs and industries and distribute wealth more evenly. By using AI to optimize the allocation of resources and identify new opportunities for economic development, we can drive innovation and growth in a way that benefits all members of society. Meanwhile, blockchain can be used to create new financial instruments and platforms that enable more people to participate in the economy, reducing inequality and promoting economic development. In addition, users can monetize their data by creating unique digital assets that can be bought and sold on the blockchain. By focusing on these technologies, we believe that we can create a more prosperous and equitable economy that benefits all members of society. In addition, AI can be used to optimize supply chains, analyze market trends, and streamline contract processes, enabling companies and organizations to operate more efficiently and effectively. Blockchain can also be used to create verifiable digital identities and facilitate secure online transactions, reducing the risk of fraud and enabling businesses and individuals to access capital more easily."
        imageUrl="/economicdevelopment.png"
        extVideoUrl="https://www.google.com"
        extArticleUrl="/nxml-blog-chat/economic-development"
        // disableCondition={
        //   +moment(launchDate).add(1080, "days").format("x") >
        //   +moment().format("x")
        // }
        disableCondition={
          +moment(launchDate).add(0, "days").format("x") > +moment().format("x")
        }
      />
      <AccordionElement
        title={"Social Welfare"}
        subTitle="While addressing social problems is often a primary goal in and of itself, there are also ways in which individuals can monetize their data and participate in the digital economy while contributing to social welfare efforts. Artificial intelligence (AI) and blockchain technology can provide new opportunities for users to monetize their data by analyzing large data sets, providing personalized support, and leveraging smart contracts to automate and streamline social welfare processes. By using AI to better understand the value of their data and identifying potential buyers, users can generate revenue while also supporting social welfare efforts. Additionally, by participating in transparent and secure blockchain-based systems, users can contribute to the overall impact and effectiveness of social welfare programs."
        imageUrl="/socialwelfare.png"
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
        title={"Environmental Protection"}
        subTitle="Our vision is to use blockchain and artificial intelligence to create a platform that empowers users to monetize their data in a way that drives positive environmental and social change. By putting control of personal data back into the hands of individuals, we can provide economic opportunities for people while also supporting the efforts of environmental and social causes. To achieve this, we will implement strong security and privacy measures, establish transparent and ethical guidelines for data use, and invest in research and development to continuously improve the platform. We will also work with policymakers and industry leaders to advocate for policies that support the responsible use of data and its potential to drive positive change. By leveraging the power of blockchain and AI, we can create a secure and transparent framework for data transactions and derive insights from data in a way that maximizes its value and impact."
        imageUrl="/environmentprotection.png"
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
      <CustomizeBlogs />
    </>
  );
}
