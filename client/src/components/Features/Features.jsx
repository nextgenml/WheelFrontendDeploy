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
              Our vision is to create a world where individuals and businesses have control and ownership over their data, and can monetize it through the convergence of artificial intelligence and blockchain technology. We aim to empower data holders by providing secure and decentralized platforms for exchanging information and extracting value from it. This will drive a new era of data economy where individuals and businesses can reap the benefits of their data and shape the future of technology. Our mission is to empower individuals and businesses to take an active role in the data economy and unlock new sources of revenue. 
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
              Our mission is to revolutionize the way data is valued, shared, and utilized. We strive to empower individuals and businesses to monetize their data through the integration of artificial intelligence and blockchain technology. By providing secure and decentralized platforms for data exchange, we aim to give data holders control over their information and the ability to shape the data economy. Our focus is to foster a new era of data monetization, where individuals and businesses can realize the full potential of their data and generate new revenue streams. We believe that empowering data holders will drive innovation and growth in the digital economy. 
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
              Our culture is founded on the belief that individuals and businesses should have control over their data and the ability to monetize it. We use decentralized technology to create a fairer, more transparent, and secure data economy. Our passion for innovation drives us to harness the power of AI and blockchain technology. Trust and security are a top priority in everything we do to provide secure and decentralized solutions for data exchange and monetization. Our ultimate goal is to empower individuals and businesses to take an active role in the data economy, realize the full potential of their data, and shape the future of technology.
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
              Our platform and customer service approach is built on the foundation of empowering individuals and businesses to take control of their data and monetize it in a decentralized and secure environment. From our innovative blockchain AI solutions to our commitment to trust and security, everything we do is driven by our passion for putting the interests of our community first. With a focus on innovation and empowerment, our goal is to help shape the future of the data economy. It starts and ends with our commitment to putting our community first.
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
              Trust fueled by transparency is the foundation of everything we do, both internally and externally. This commitment to transparency and trust underlies all our teams and products, ensuring that we provide secure, innovative, and empowering solutions in the decentralized data economy.
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
              Our focus on innovation drives our mission to empower individuals and businesses to take control of their data and monetize it in a decentralized and secure environment. We leverage cutting-edge technology and a passion for innovation to make investing better, simpler, and more constructive for our token holders. Our goal is to provide secure, innovative, and empowering solutions in the decentralized data economy, with a focus on creating value for our community.
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
              Our philosophy is centered around the belief that simplicity is the ultimate sophistication. We strive to simplify complex challenges and processes through technology and design an intuitive user experience. Our mission is to empower individuals and businesses to take control of their data and monetize it in a decentralized and secure environment. We believe that by making technology simple, we can create a more powerful, intuitive, and valuable experience for our users.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
