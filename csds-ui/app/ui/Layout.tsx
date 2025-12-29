import type React from "react";
import { Menu, DrawerHeader, type Id as MenuItemId } from "./Menu";
import { Box, CssBaseline } from "@mui/material";

export const Layout: React.FC<{
  children: React.ReactNode;
  onMenuSelect: (id: MenuItemId) => void;
  selected: MenuItemId;
}> = ({ children, onMenuSelect, selected }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Menu onClick={onMenuSelect} selected={selected} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
};
