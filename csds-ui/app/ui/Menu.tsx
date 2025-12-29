import * as React from "react";
import { styled } from "@mui/material/styles";
import type { Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import EvStationIcon from "@mui/icons-material/EvStation";
import InsightsIcon from "@mui/icons-material/Insights";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import Logo from "../assets/horizontal-logo.png";
import styles from "./Menu.module.scss";
import { useIntl } from "react-intl";

export type Id =
  | "home"
  | "live-data"
  | "errors-warnings"
  | "trends"
  | "sessions";

export interface MenuProps {
  onClick: (id: Id) => void;
  selected: Id;
}

export const Menu: React.FC<MenuProps> = ({ onClick, selected }) => {
  const items: Array<Item> = React.useMemo(() => {
    return [
      { id: "home", Icon: EvStationIcon },
      { id: "live-data", Icon: InsightsIcon },
      { id: "errors-warnings", Icon: WarningAmberIcon },
      { id: "trends", Icon: TimelineOutlinedIcon },
      { id: "sessions", Icon: ManageSearchOutlinedIcon },
    ];
  }, []);
  return <BarAndDrawer items={items} onClick={onClick} selected={selected} />;
};

interface Item {
  id: Id;
  Icon: React.ElementType;
}
const BarAndDrawer: React.FC<{
  items: Array<Item>;
  onClick: (id: Id) => void;
  selected: Id;
}> = ({ items, onClick, selected }) => {
  const [open, setOpen] = React.useState(false);
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <AppBar position="fixed" open={open} color="transparent">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleToggle}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Box className={styles.logoContainer}>
            <img className={styles.logo} src={Logo} alt="UEC logo" />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader onClick={handleToggle}>
          <IconButton>{open && <ChevronLeftIcon />}</IconButton>
        </DrawerHeader>
        <Divider />

        {items.map((item: Item) => (
          <MenuItem
            key={item.id}
            id={item.id}
            open={open}
            Icon={item.Icon}
            selected={selected === item.id}
            onClick={React.useCallback(
              () => onClick?.(item.id),
              [onClick, item.id]
            )}
          />
        ))}
      </Drawer>
    </>
  );
};

const MenuItem: React.FC<{
  id: Id;
  open: boolean;
  Icon: React.ElementType;
  selected: boolean;
  onClick?: () => void;
}> = ({ id, open, Icon, selected, onClick }) => {
  const intl = useIntl();
  const text = intl.formatMessage({ id: `nav.${id}` });
  return (
    <ListItem key={text} disablePadding sx={{ display: "block" }}>
      <ListItemButton selected={selected} onClick={onClick}>
        <Icon sx={{ mr: 3 }}></Icon>
        <ListItemText
          primary={text}
          sx={{
            opacity: open ? 1 : 0,
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));
