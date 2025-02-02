import {ipcMain, app, nativeImage, BrowserWindow, Tray} from 'electron';
import log from "electron-log";
import path from 'path';
import {is} from "electron-util";

type IconTypes = 'offline' | 'normal' | 'badge';

// Decide app icon based on favicon URL
const decideIcon = (href: string): IconTypes => {
  let type: IconTypes = 'offline';
  debugger;
  log.debug("icon = "+href);
  if (href.match(/favicon_chat_r/) ||
    href.match(/favicon_chat_new_non_notif_r/)) {
    type = 'normal';
  } else if (href.match(/favicon_chat_new_notif_r/)) {
    type = 'badge';
  }

  return type;
}

export default (window: BrowserWindow, trayIcon: Tray) => {

  ipcMain.on('faviconChanged', (evt, href) => {
    const type = decideIcon(String(href));

    const size = is.macos ? 16 : 32;
    const icon = nativeImage.createFromPath(path.join(app.getAppPath(), `resources/icons/${type}/${size}.png`))
    trayIcon.setImage(icon);
  });

  ipcMain.on('unreadCount', (event, count: number) => {
    app.setBadgeCount(Number(count))
  });
}
