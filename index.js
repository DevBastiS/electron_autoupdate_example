const {electron, ipcMain, app, BrowserWindow} = require('electron');
const {autoUpdater} = require('electron-updater');
const path = require('path');
const url = require('url');

let window;

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (window === null) {
    createWindow()
  }
})



//Functions

function createWindow () {

  let window = new BrowserWindow({width: 800, height: 600});

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  window.webContents.openDevTools();

  window.on('closed', function () {
    window = null;
  });

  // Let autoUpdater check for updates, it will start downloading it automatically
  autoUpdater.checkForUpdates();

  // Catch the update-available event
  autoUpdater.addListener('update-available', (info) => {
    window.webContents.send('update-available');
  });

  // Catch the update-not-available event
  autoUpdater.addListener('update-not-available', (info) => {
    window.webContents.send('update-not-available');
  });

  // Catch the download-progress events
  autoUpdater.addListener('download-progress', (info) => {
    window.webContents.send('prog-made');
  });

  // Catch the update-downloaded event
  autoUpdater.addListener('update-downloaded', (info) => {
    window.webContents.send('update-downloaded');
  });

  // Catch the error events
  autoUpdater.addListener('error', (error) => {
    window.webContents.send('error', error.toString());
  });

  ipcMain.on('quitAndInstall', (event, arg) => {
    autoUpdater.quitAndInstall();
  });
}
