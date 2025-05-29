import { contextBridge, ipcRenderer } from 'electron';

// Debug message
console.log('Preload script executing...');

contextBridge.exposeInMainWorld('electronAPI', {
  captureSignature: () => {
    console.log('Renderer calling captureSignature');
    return ipcRenderer.invoke('capture-signature');
  },
  finishCapture: () => {
    console.log('Renderer calling finishCapture');
    return ipcRenderer.invoke('finish-capture');
  }
});