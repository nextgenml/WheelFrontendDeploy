/* eslint-disable react-hooks/exhaustive-deps */
import {
  List,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
// import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import config from "../../config";
import Loading from "../loading";
// import RichTextEditor from "../RichTextEditor/RichTextEditor";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import styles from "./SocialSharing.module.css";
// import { convert } from "html-to-text";
import Chore from "./Chore";

const ChoresContent = ({ tab, walletId, menuOption }) => {
  const [chores, setChores] = useState();
  const [filter, setFilter] = useState("todo");

  const fetchStats = async () => {
    const res = await fetch(
      `${
        config.API_ENDPOINT
      }/social-sharing-chores?mediaType=${tab}&walletId=${walletId}&type=${menuOption.toLowerCase()}&filter=${filter}`,
      {
        method: "GET",
      }
    );
    const data = await res.json();
    setChores(data.data);
  };
  useEffect(() => {
    fetchStats();
  }, [menuOption, filter]);

  const markAsDone = async (choreId) => {
    const res = await fetch(
      `${config.API_ENDPOINT}/mark-chore-as-done?walletId=${walletId}&choreId=${choreId}`,
      {
        method: "POST",
      }
    );

    if (res.ok) {
      const chore = chores.filter((c) => c.id === choreId)[0];
      chore.completed_by_user = 1;
      setChores([...chores]);
    } else alert("Something went wrong. Please try later");
  };

  const renderContent = () => {
    if (chores.length)
      return (
        <>
          <List>
            {chores.map((chore, index) => {
              return (
                <Chore chore={chore} index={index} markAsDone={markAsDone} />
              );
            })}
          </List>
        </>
      );
    else
      return (
        <div style={{ textAlign: "center" }}>
          <NewspaperIcon className={styles.blankIcon} />
          <Typography variant="subtitle1">No chores present</Typography>
        </div>
      );
  };
  return chores ? (
    <>
      <FormControl sx={{ ml: 2 }}>
        <FormLabel>Chores</FormLabel>
        <RadioGroup
          row
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <FormControlLabel value="todo" control={<Radio />} label="To Do" />
          <FormControlLabel
            value="completed"
            control={<Radio />}
            label="Completed"
          />
          <FormControlLabel value="all" control={<Radio />} label="All" />
        </RadioGroup>
      </FormControl>
      {renderContent()}
    </>
  ) : (
    <Loading loading />
  );
};
export default ChoresContent;
