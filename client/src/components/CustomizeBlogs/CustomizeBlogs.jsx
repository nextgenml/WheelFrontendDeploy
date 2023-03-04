/* eslint-disable react-hooks/exhaustive-deps */
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Grid, TextField, Button } from "@mui/material";
import { useAccount } from "wagmi";
import styles from "./CustomizeBlogs.module.css";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import config from "../../config";

export default function CustomizeBlogs() {
  const { isConnected, address } = useAccount();
  const [context, setContext] = useState(null);
  const [eligible, setEligible] = useState(false);
  const [prompts, setPrompts] = useState([
    {
      id: 1,
      value: null,
    },
  ]);
  useEffect(() => checkEligibility(), [isConnected]);
  if (!isConnected) return null;

  const checkEligibility = async () => {
    const res = await fetch(
      `${config.API_ENDPOINT}/custom-blogs-eligibility?walletId=${address}`
    );
    if (res.ok) {
      const { isEligible } = await res.json();
      setEligible(isEligible);
    }
  };
  const handleAddMore = () => {
    setPrompts((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        value: null,
      },
    ]);
  };
  const handlePromptChange = (id, event) => {
    const prompt = prompts.filter((p) => p.id === id)[0];

    if (prompt) {
      prompt.value = event.target.value;
      setPrompts([...prompts]);
    }
  };

  return (
    <Accordion className={styles.main}>
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
        <Typography className={styles.heading}>
          Customize and Promote Blogs
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {eligible && (
          <Box>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <TextField
                      variant="outlined"
                      label="Enter blog context to generate prompts"
                      placeholder="List 10 ways in which technology can be improved"
                      fullWidth
                      value={context}
                      sx={{ mb: 2 }}
                      onChange={(e) => setContext(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      component="label"
                      disabled={!context}
                      onClick={() =>
                        window.open(
                          `/nxml-blog-chat/blog-customization?context=${context}`,
                          "_blank"
                        )
                      }
                    >
                      Generate
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6}>
                <Grid container spacing={2}>
                  <Grid item md={10}>
                    {prompts.map((x) => (
                      <TextField
                        variant="outlined"
                        label="Enter prompt"
                        fullWidth
                        sx={{ mb: 2 }}
                        key={x.id}
                        value={x.value}
                        onChange={(e) => handlePromptChange(x.id, e)}
                      />
                    ))}

                    <Button
                      variant="contained"
                      component="label"
                      disabled={prompts.filter((p) => !!p.value).length === 0}
                      onClick={() => {
                        const promptString = prompts
                          .filter((p) => !!p.value)
                          .map((x) => x.value)
                          .join("||");
                        window.open(
                          `/nxml-blog-chat/blog-customization?prompts=${promptString}`,
                          "_blank"
                        );
                      }}
                    >
                      Generate
                    </Button>
                  </Grid>
                  <Grid item md={2}>
                    <AddIcon
                      fontSize="large"
                      className={styles.addMore}
                      onClick={handleAddMore}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
        <Grid container sx={{ mt: 2 }}>
          <Grid item md={12}>
            <Button
              variant="contained"
              component="label"
              onClick={() =>
                window.open(`/nxml-blog-chat/promote-blogs`, "_blank")
              }
            >
              Promote Blogs
            </Button>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
