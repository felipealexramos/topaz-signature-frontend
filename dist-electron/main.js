"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const edge = require("electron-edge-js");
// Set path to your built DLL
const topazBridgeDllPath = path.join(__dirname, '../libs/TopazBridge.dll');
// Create the Edge.js function to call your C# method
const captureSignatureFunc = edge.func({
    assemblyFile: topazBridgeDllPath,
    typeName: 'TopazWrapper',
    methodName: 'CaptureSignature'
});
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
    });
    const isDev = !electron_1.app.isPackaged;
    if (isDev) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools({ mode: 'detach' });
    }
    else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}
// Set up IPC handler for signature capture
electron_1.ipcMain.handle('capture-signature', async () => {
    return new Promise((resolve, reject) => {
        captureSignatureFunc(null, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        });
    });
});
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
