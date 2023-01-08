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

const NavBar = () => {
  const [selected, setSelected] = useState("New");
  const navItems = [
    {
      text: "New",
      icon: <StarOutlinedIcon />,
    },
    {
      text: "Old",
      icon: <KeyOutlinedIcon />,
    },
    {
      text: "Like",
      icon: <FavoriteBorderOutlinedIcon />,
    },
    {
      text: "Retweet",
      icon: <ContentCopyIcon />,
    },
    {
      text: "Comment",
      icon: <ModeCommentOutlinedIcon />,
    },
    {
      text: "Follow",
      icon: <AddBoxIcon />,
    },
  ];
  return (
    <div>
      <List className={styles.navList}>
        {navItems.map((item) => {
          return (
            <ListItemButton
              key={item.text}
              onClick={() => setSelected(item.text)}
              className={selected === item.text ? styles.selectedListItem : ""}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>
    </div>
  );
};
export default NavBar;
