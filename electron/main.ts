import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as edge from 'electron-edge-js';
import * as fs from 'fs';

// Enhanced error handling for startup
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

console.log('Starting Electron app...');
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);

// Create a map to track registered handlers
const registeredHandlers = new Set();

// Helper function to safely register IPC handlers
function safeRegisterHandler(channel, handler) {
  if (registeredHandlers.has(channel)) {
    console.log(`Handler for ${channel} already registered, skipping`);
    return;
  }
  
  ipcMain.handle(channel, handler);
  registeredHandlers.add(channel);
  console.log(`Successfully registered handler for ${channel}`);
}

const topazBridgeDllPath = path.join(__dirname, '../libs/TopazBridge.dll');
if (!fs.existsSync(topazBridgeDllPath)) {
  console.error(`TopazBridge DLL not found at path: ${topazBridgeDllPath}`);
} else {
  console.log('TopazBridge DLL found successfully');
}

  // Create the Edge.js functions
  const captureSignatureFunc = edge.func({
    assemblyFile: topazBridgeDllPath,
    typeName: 'TopazWrapper',
    methodName: 'CaptureSignature'
  });

  const finishCaptureFunc = edge.func({
    assemblyFile: topazBridgeDllPath,
    typeName: 'TopazWrapper',
    methodName: 'FinishCapture'
  });

  function createWindow() {
    console.log('Creating window...');
    try {
      const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
          contextIsolation: true,
          nodeIntegration: false
        },
      });

      console.log('Preload script path:', path.join(__dirname, 'preload.js'));
      const preloadExists = fs.existsSync(path.join(__dirname, 'preload.js'));
      console.log('Preload script exists:', preloadExists);

      const isDev = !app.isPackaged;
      console.log('Running in development mode:', isDev);

      if (isDev) {
        console.log('Loading dev server URL: http://localhost:5173');
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools({ mode: 'detach' });
      } else {
        const htmlPath = path.join(__dirname, '../dist/index.html');
        console.log('Loading HTML file:', htmlPath);
        const htmlExists = fs.existsSync(htmlPath);
        console.log('HTML file exists:', htmlExists);
        win.loadFile(htmlPath);
      }
    } catch (windowError) {
      console.error('Error creating window:', windowError);
    }
  }

  // Set up IPC handlers - use safe registration to prevent duplicates
  safeRegisterHandler('capture-signature', async () => {
    console.log('Capture signature handler called');

    try {
      if (!captureSignatureFunc) {
        throw new Error('Edge function not initialized');
      }

      return await new Promise((resolve, reject) => {
        captureSignatureFunc(null, (error, result) => {
          if (error) {
            console.error('Signature capture error:', error);
            reject(error);
          } else {
            console.log('Signature capture initiated:', result);
            resolve(result);
          }
        });
      });
    } catch (err) {
      console.error('Exception in capture-signature handler:', err);
      throw err;
    }
  });

  safeRegisterHandler('finish-capture', async () => {
    console.log('Finish capture handler called');

    try {
      return await new Promise((resolve, reject) => {
        finishCaptureFunc(null, (error, result) => {
          if (error) {
            console.error('Finish capture error:', error);
            reject(error);
          } else {
            console.log('Signature captured successfully');
            resolve(result);
          }
        });
      });
    } catch (err) {
      console.error('Exception in finish-capture handler:', err);
      throw err;
    }
  });

  app.whenReady().then(() => {
    console.log('App ready, creating window...');
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        console.log('No windows, creating a new one...');
        createWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    console.log('All windows closed');
    if (process.platform !== 'darwin') {
      console.log('Quitting app');
      app.quit();
    }
  });
