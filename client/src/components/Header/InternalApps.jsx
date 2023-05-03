import * as React from "react";
import { Button, ListItemIcon } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AttractionsIcon from "@mui/icons-material/Attractions";
import TokenIcon from "@mui/icons-material/Token";
import CampaignIcon from "@mui/icons-material/Campaign";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaymentsIcon from "@mui/icons-material/Payments";
import BookIcon from "@mui/icons-material/Book";
import PersonIcon from "@mui/icons-material/Person";
import config from "../../config";
export default function InternalApps() {
  const { address } = useAccount();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();
  const handleClose = (path) => {
    setAnchorEl(null);
    navigate(path);
  };

  const { isConnected } = useAccount();
  const connectedApps = [
    {
      name: "Campaigns",
      path: "/user-campaigns",
      icon: <CampaignIcon />,
    },
    {
      name: "Work Area",
      path: "/social-sharing",
      icon: <GroupWorkIcon />,
    },
    {
      name: "Referrals",
      path: "/referrals",
      icon: <PersonAddIcon />,
    },
    {
      name: "Earnings",
      path: "/payments",
      icon: <PaymentsIcon />,
    },
    {
      name: "Posted Blogs",
      path: "/posted-blogs",
      icon: <BookIcon />,
    },
  ];
  const publicApps = [
    {
      name: "Launch Wheel",
      path: "/spin-wheel",
      icon: <AttractionsIcon />,
    },
    {
      name: "Allocation",
      path: "/tokens",
      icon: <TokenIcon />,
    },
  ];
  const adminApps = [
    {
      name: "Holders",
      path: "/holders",
      icon: <PersonIcon />,
    },
    {
      name: "Spins",
      path: "/scheduled_spins",
      icon: <AttractionsIcon />,
    },
  ];
  return (
    <div>
      <Button
        variant="outlined"
        endIcon={<KeyboardArrowDownIcon />}
        onClick={handleClick}
      >
        Apps
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {publicApps.map((a) => (
          <MenuItem onClick={() => handleClose(a.path)} key={a.name}>
            <ListItemIcon>{a.icon}</ListItemIcon>
            {a.name}
          </MenuItem>
        ))}
        {isConnected &&
          connectedApps.map((a) => (
            <MenuItem onClick={() => handleClose(a.path)} key={a.name}>
              <ListItemIcon>{a.icon}</ListItemIcon>
              {a.name}
            </MenuItem>
          ))}
        {isConnected &&
          config.ADMIN_WALLET === address &&
          adminApps.map((a) => (
            <MenuItem onClick={() => handleClose(a.path)} key={a.name}>
              <ListItemIcon>{a.icon}</ListItemIcon>
              {a.name}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}
