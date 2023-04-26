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
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
const NavBar = ({ stats, onMenuChange }) => {
  const [selected, setSelected] = useState("New");
  const navItems = [
    {
      text: "New",
      icon: <StarOutlinedIcon />,
      stat: stats.newTotal,
      count: stats.newTotalCount,
    },
    {
      text: "Old",
      icon: <KeyOutlinedIcon />,
      stat: stats.old,
      count: stats.oldCount,
    },
    {
      text: "Like",
      icon: <FavoriteBorderOutlinedIcon />,
      stat: stats.like,
      count: stats.likeCount,
    },
    {
      text: "Retweet",
      icon: <ContentCopyIcon />,
      stat: stats.retweet,
      count: stats.retweetCount,
    },
    {
      text: "Comment",
      icon: <ModeCommentOutlinedIcon />,
      stat: stats.comment,
      count: stats.commentCount,
    },
    {
      text: "Follow",
      icon: <AddBoxIcon />,
      stat: stats.follow,
      count: stats.followCount,
    },
    {
      text: "Validate",
      icon: <DomainVerificationIcon />,
      stat: stats.validate,
      count: stats.validateCount,
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
              <ListItemText
                primary={`${item.text} (${item.count}) ($${item.stat})`}
              />
            </ListItemButton>
          );
        })}
      </List>
    </div>
  );
};
export default NavBar;
