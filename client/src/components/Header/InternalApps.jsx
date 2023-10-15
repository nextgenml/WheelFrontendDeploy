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
import MemoryIcon from "@mui/icons-material/Memory";
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
  const isChoresApp = process.env.REACT_APP_PROJECT_NAME === "TWITTER_CHORES";

  const { isConnected } = useAccount();
  const connectedApps = isChoresApp
    ? [
        {
          name: "Campaigns",
          path: "/twitter-campaigns",
          icon: <CampaignIcon />,
        },
        {
          name: "Chores",
          path: "/",
          icon: <GroupWorkIcon />,
        },
      ]
    : [
        {
          name: "Own a Memory",
          path: "/own-a-memory",
          icon: <MemoryIcon />,
        },
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
  const publicApps = isChoresApp
    ? []
    : [
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
  const adminApps = isChoresApp
    ? []
    : [
        {
          name: "Holders Admin",
          path: "/holders",
          icon: <PersonIcon />,
        },
        {
          name: "Spins Admin",
          path: "/scheduled_spins",
          icon: <AttractionsIcon />,
        },
        {
          name: "Work Area Admin",
          path: "/social-sharing-admin",
          icon: <GroupWorkIcon />,
        },
        {
          name: "Allocation Admin",
          path: "/allocations-admin",
          icon: <TokenIcon />,
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
