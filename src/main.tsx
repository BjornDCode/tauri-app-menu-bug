import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  Menu,
  MenuItem,
  Submenu,
  PredefinedMenuItem,
} from "@tauri-apps/api/menu";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { getCurrent } from "@tauri-apps/api/window";

const appSubmenu = await Submenu.new({
  id: "app-submenu",
  text: "App",
  items: [await PredefinedMenuItem.new({ item: "Quit" })],
});
const fileSubmenu = await Submenu.new({
  id: "file-submenu",
  text: "File",
  items: [
    await MenuItem.new({
      id: "new-subwindow",
      text: "New sub window",
      enabled: true,
      action: () => {
        const handle = new WebviewWindow("subwindow", {
          width: 400,
          height: 400,
          url: "/",
          title: "Subwindow",
        });

        handle.listen("tauri://window-created", async () => {
          await subWindowMenu.setAsAppMenu();
        });

        handle.listen("tauri://destroyed", async () => {
          await menu.setAsAppMenu();
        });
      },
    }),
    await PredefinedMenuItem.new({ item: "CloseWindow" }),
  ],
});
const subwindowFileMenu = await Submenu.new({
  id: "subwindow-file-submenu",
  text: "File",
  items: [await PredefinedMenuItem.new({ item: "CloseWindow" })],
});

const menu = await Menu.new({
  id: "app",
  items: [appSubmenu, fileSubmenu],
});

const subWindowMenu = await Menu.new({
  id: "app",
  items: [appSubmenu, subwindowFileMenu],
});

const window = getCurrent();
if (window.label === "main") {
  await menu.setAsAppMenu();
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
