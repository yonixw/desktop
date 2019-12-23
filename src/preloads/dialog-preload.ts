import { webFrame, ipcRenderer } from 'electron';

(async function() {
  const w = await webFrame.executeJavaScript('window');
  w.require = (id: string) => {
    if (id === 'electron') {
      return { ipcRenderer };
    }
    return undefined;
  };
})();
