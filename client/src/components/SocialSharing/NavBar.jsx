import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddBoxIcon from "@mui/icons-material/AddBox";
import styles from "./SocialSharing.module.css";
import { useState } from "react";

const NavBar = ({ stats, onMenuChange }) => {
  const [selected, setSelected] = useState("New");
  const navItems = [
    {
      text: "New",
      icon: <StarOutlinedIcon />,
      stat: stats.newTotal,
    },
    {
      text: "Old",
      icon: <KeyOutlinedIcon />,
      stat: stats.old,
    },
    {
      text: "Like",
      icon: <FavoriteBorderOutlinedIcon />,
      stat: stats.like,
    },
    {
      text: "Retweet",
      icon: <ContentCopyIcon />,
      stat: stats.retweet,
    },
    {
      text: "Comment",
      icon: <ModeCommentOutlinedIcon />,
      stat: stats.comment,
    },
    {
      text: "Follow",
      icon: <AddBoxIcon />,
      stat: stats.follow,
    },
  ];
  return (
    <div>
      <List className={styles.navList}>
        {navItems.map((item) => {
          return (
            <ListItemButton
              key={item.text}
              onClick={() => {
                setSelected(item.text);
                onMenuChange(item.text);
              }}
              className={selected === item.text ? styles.selectedListItem : ""}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={`${item.text} ($${item.stat})`} />
            </ListItemButton>
          );
        })}
      </List>
    </div>
  );
};
export default NavBar;
