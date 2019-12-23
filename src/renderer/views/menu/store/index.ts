import { ipcRenderer } from 'electron';
import { observable, computed } from 'mobx';
import { getTheme } from '~/utils/themes';
import { ISettings } from '~/interfaces';
import { DEFAULT_SETTINGS } from '~/constants';

export class Store {
  @observable
  public settings: ISettings = DEFAULT_SETTINGS;

  @computed
  public get theme() {
    return getTheme(this.settings.theme);
  }

  @observable
  public visible = false;

  @observable
  public id: number;

  @observable
  public windowId: number;

  @observable
  public alwaysOnTop = false;

  public constructor() {
    this.init();

    ipcRenderer.on('visible', (e, flag) => {
      this.visible = flag;
    });

    window.addEventListener('blur', () => {
      if (this.visible) {
        setTimeout(() => {
          this.hide();
        });
      }
    });

    ipcRenderer.send('get-settings');

    ipcRenderer.on('update-settings', (e, settings: ISettings) => {
      this.settings = { ...this.settings, ...settings };
    });
  }

  public async init() {
    this.id = await ipcRenderer.invoke('get-web-contents-id');
    this.windowId = await ipcRenderer.invoke(`get-window-id-${this.id}`);
  }

  public hide() {
    ipcRenderer.send(`hide-${this.id}`);
  }

  public async save() {
    ipcRenderer.send('save-settings', {
      settings: JSON.stringify(this.settings),
    });
  }
}

export default new Store();
