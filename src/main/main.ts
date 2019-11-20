import { AppWindow } from './windows';
import { app, Menu, ipcMain, session } from 'electron';
import { isAbsolute, extname } from 'path';
import { existsSync } from 'fs';
import { getMainMenu } from './menus/main';
import { SessionsManager } from './sessions-manager';
import { checkFiles } from '~/utils/files';
import { Settings } from './models/settings';
import { isURL, prefixHttp } from '~/utils';
import { registerProtocol } from './models/protocol';
import { autoUpdater } from 'electron-updater';
import { Storage } from './models/storage';

export class Main {
  public windows: AppWindow[] = [];

  public currentWindow: AppWindow;

  public sessionsManager: SessionsManager;

  public settings = new Settings();

  public storage = new Storage();

  public constructor() {
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      app.quit();
      return;
    } else {
      app.on('second-instance', async (e, argv) => {
        const path = argv[argv.length - 1];

        if (isAbsolute(path) && existsSync(path)) {
          if (process.env.ENV !== 'dev') {
            const path = argv[argv.length - 1];
            const ext = extname(path);

            if (ext === '.html') {
              this.currentWindow.viewManager.create({
                url: `file:///${path}`,
                active: true,
              });
            }
          }
          return;
        } else if (isURL(path)) {
          this.currentWindow.viewManager.create({
            url: prefixHttp(path),
            active: true,
          });
          return;
        }

        this.createWindow();
      });
    }

    app.on('login', async (e, webContents, request, authInfo, callback) => {
      e.preventDefault();

      const window = this.findWindowByBrowserView(webContents.id);
      const credentials = await window.authDialog.requestAuth(request.url);

      if (credentials) {
        callback(credentials.username, credentials.password);
      }
    });

    ipcMain.on('create-window', (e, incognito = false) => {
      this.createWindow(incognito);
    });

    this.onReady();
  }

  private async onReady() {
    await app.whenReady();

    checkFiles();

    registerProtocol(session.defaultSession);

    this.storage.run();

    this.sessionsManager = new SessionsManager();

    this.createWindow();

    Menu.setApplicationMenu(getMainMenu());
    this.runAutoUpdaterService();

    app.on('activate', () => {
      if (this.windows.filter(x => x !== null).length === 0) {
        this.createWindow();
      }
    });
  }

  public createWindow(incognito = false) {
    const window = new AppWindow(incognito);
    this.windows.push(window);

    if (incognito) {
      this.sessionsManager.extensionsIncognito.addWindow(window);
      if (!this.sessionsManager.incognitoExtensionsLoaded) {
        this.sessionsManager.loadExtensions('incognito');
      }
    } else {
      this.sessionsManager.extensions.addWindow(window);
    }
  }

  public findWindowByBrowserView(webContentsId: number) {
    return this.windows.find(x => !!x.viewManager.views.get(webContentsId));
  }

  private runAutoUpdaterService() {
    ipcMain.on('update-install', () => {
      autoUpdater.quitAndInstall();
    });

    ipcMain.on('update-check', () => {
      if (process.env.ENV !== 'dev') {
        autoUpdater.checkForUpdates();
      }
    });

    autoUpdater.on('update-downloaded', ({ version }) => {
      for (const window of this.windows) {
        window.webContents.send('update-available', version);
      }
    });
  }
}
