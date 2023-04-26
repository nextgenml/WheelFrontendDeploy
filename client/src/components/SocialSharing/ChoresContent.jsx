/* eslint-disable react-hooks/exhaustive-deps */
import {
  List,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TablePagination,
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
import { markChoreAsDoneAPI, validateChoreAPI } from "../../API/SocialSharing";
import { customFetch } from "../../API/index.js";
import { getTotalCountOfTab } from "./Util";

const ChoresContent = ({ tab, walletId, menuOption, stats }) => {
  const [chores, setChores] = useState();
  const [filter, setFilter] = useState("todo");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const fetchStats = async () => {
    setLoading(true);
    const res = await customFetch(
      `${
        config.API_ENDPOINT
      }/social-sharing-chores?mediaType=${tab}&walletId=${walletId}&type=${menuOption.toLowerCase()}&filter=${filter}&pageNo=${page}&pageSize=10`,
      {
        method: "GET",
      }
    );
    const data = await res.json();
    setChores(data.data);
    setLoading(false);
  };
  useEffect(() => {
    fetchStats();
  }, [menuOption, filter, page]);
  useEffect(() => {
    setPage(0);
  }, [menuOption]);
  const markAsDone = async (choreId, payload) => {
    const res = await markChoreAsDoneAPI(walletId, choreId, payload);
    if (res) {
      const chore = chores.filter((c) => c.id === choreId)[0];
      chore.completed_by_user = 1;
      setChores([...chores]);
    }
  };

  const validateChore = async (choreId, action, payload) => {
    const res = await validateChoreAPI(walletId, choreId, action, payload);
    if (res) {
      const chore = chores.filter((c) => c.id === choreId)[0];
      chore.completed_by_user = 1;
      setChores([...chores]);
    }
  };
  const renderContent = () => {
    if (chores.length)
      return (
        <>
          <List>
            {chores.map((chore, index) => {
              return (
                <Chore
                  chore={chore}
                  index={index}
                  markAsDone={markAsDone}
                  validateChore={validateChore}
                />
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
  if (loading) return <Loading loading />;
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
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={getTotalCountOfTab(stats, menuOption)}
        rowsPerPage={10}
        page={page}
        onPageChange={(e, val) => setPage(val)}
      />
      {renderContent()}
    </>
  ) : (
    <Loading loading />
  );
};
export default ChoresContent;
