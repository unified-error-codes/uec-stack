import { useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Layout as UILayout } from "~/ui/Layout";
import { type Id as MenuItemId } from "~/ui/Menu";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const onMenuSelect = useCallback(
    (id: MenuItemId) => {
      navigate(mapMenuItemIdToRoute(id));
    },
    [navigate]
  );

  const selectedMenuItemId = mapRouteToMenuItemId(location.pathname);

  return (
    <UILayout onMenuSelect={onMenuSelect} selected={selectedMenuItemId}>
      <Outlet />
    </UILayout>
  );
}

const mapMenuItemIdToRoute = (item: MenuItemId) => {
  if (item === "home") return "/";
  return `/${item}`;
};

const mapRouteToMenuItemId = (pathname: string): MenuItemId => {
  if (pathname === "/") return "home";
  // Remove leading slash
  return pathname.slice(1) as MenuItemId;
};
