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

const NavBar = () => {
  return (
    <div>
      <List className={styles.navList}>
        <ListItemButton>
          <ListItemIcon>
            <StarOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="New" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <KeyOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Old" />
        </ListItemButton>
        <Divider />
        <ListItemButton>
          <ListItemIcon>
            <FavoriteBorderOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Like" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <ContentCopyIcon />
          </ListItemIcon>
          <ListItemText primary="Retweet" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <ModeCommentOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Comment" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <AddBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Follow" />
        </ListItemButton>
      </List>
    </div>
  );
};
export default NavBar;
