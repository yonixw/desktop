import { Menu, webContents } from 'electron';
import { defaultTabOptions } from '~/constants/tabs';
import { main } from '..';

// TODO: avoid repeating the same functions

export const getMainMenu = () => {
  return Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          accelerator: 'CmdOrCtrl+T',
          label: 'New tab',
          click() {
            main.currentWindow.viewManager.create(defaultTabOptions);
          },
        },
        {
          accelerator: 'CmdOrCtrl+N',
          label: 'New window',
          click() {
            main.createWindow();
          },
        },
        {
          accelerator: 'CmdOrCtrl+Shift+N',
          label: 'New incognito window',
          click() {
            main.createWindow(true);
          },
        },
        {
          type: 'separator',
        },
        {
          accelerator: 'CmdOrCtrl+W',
          label: 'Close tab',
          click() {
            main.currentWindow.webContents.send(
              'remove-tab',
              main.currentWindow.viewManager.selectedId,
            );
          },
        },
        {
          accelerator: 'CmdOrCtrl+Shift+W',
          label: 'Close current window',
          click() {
            main.currentWindow.close();
          },
        },
        {
          type: 'separator',
        },
        {
          role: 'quit',
          accelerator: 'CmdOrCtrl+Shift+Q',
        },
        {
          label: 'Reload',
          visible: false,
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            main.currentWindow.viewManager.selected.webContents.reload();
          },
        },
        {
          label: 'Reload',
          visible: false,
          accelerator: 'F5',
          click: () => {
            main.currentWindow.viewManager.selected.webContents.reload();
          },
        },
        {
          accelerator: 'CmdOrCtrl+F',
          label: 'Find in page',
          visible: false,
          click() {
            main.currentWindow.webContents.send('find');
          },
        },
        {
          accelerator: 'CmdOrCtrl+F4',
          label: 'Close tab',
          visible: false,
          click() {
            main.currentWindow.webContents.send(
              'remove-tab',
              main.currentWindow.viewManager.selectedId,
            );
          },
        },
        {
          accelerator: 'CmdOrCtrl+Shift+T',
          label: 'Revert closed tab',
          visible: false,
          click() {
            main.currentWindow.webContents.send('revert-closed-tab');
          },
        },
        {
          accelerator: 'CmdOrCtrl+Tab',
          label: 'Select next tab',
          visible: false,
          click() {
            main.currentWindow.webContents.send('select-next-tab');
          },
        },
        {
          accelerator: 'Ctrl+Space',
          label: 'Toggle Search',
          visible: false,
          click() {
            main.currentWindow.searchDialog.show();
          },
        },
        {
          accelerator: 'CmdOrCtrl+L',
          label: 'Toggle menu',
          visible: false,
          click() {
            main.currentWindow.menuDialog.show();
          },
        },
        {
          accelerator: 'Alt+F',
          label: 'Toggle Search',
          visible: false,
          click() {
            main.currentWindow.searchDialog.show();
          },
        },
        {
          accelerator: 'Alt+E',
          label: 'Toggle menu',
          visible: false,
          click() {
            main.currentWindow.menuDialog.show();
          },
        },
        {
          accelerator: 'CmdOrCtrl+Left',
          label: 'Go back',
          visible: false,
          click() {
            const { selected } = main.currentWindow.viewManager;
            if (selected) {
              selected.webContents.goBack();
            }
          },
        },
        {
          accelerator: 'CmdOrCtrl+Right',
          label: 'Go forward',
          visible: false,
          click() {
            const { selected } = main.currentWindow.viewManager;
            if (selected) {
              selected.webContents.goForward();
            }
          },
        },
        {
          accelerator: 'CmdOrCtrl+Shift+F12',
          label: 'Toggle developer tools (window)',
          visible: false,
          click() {
            setTimeout(() => {
              webContents
                .getFocusedWebContents()
                .openDevTools({ mode: 'detach' });
            });
          },
        },
        {
          accelerator: 'F12',
          label: 'Toggle developer tools (contents)',
          visible: false,
          click() {
            setTimeout(() => {
              main.currentWindow.viewManager.selected.webContents.toggleDevTools();
            });
          },
        },
        {
          accelerator: 'Ctrl+Shift+I',
          label: 'Toggle developer tools (contents)',
          visible: false,
          click() {
            setTimeout(() => {
              main.currentWindow.viewManager.selected.webContents.toggleDevTools();
            });
          },
        },
      ],
    },
    { role: 'editMenu' },
  ]);
};
