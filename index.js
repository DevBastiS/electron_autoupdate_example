const {electron, ipcMain, app, BrowserWindow} = require('electron');
const {autoUpdater} = require('electron-updater');
const path = require('path');
const url = require('url');

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

// Catch the update-available event
autoUpdater.addListener('update-available', (info) => {
  mainWindow.webContents.send('update-available');
});

// Catch the update-not-available event
autoUpdater.addListener('update-not-available', (info) => {
  mainWindow.webContents.send('update-not-available');
});

// Catch the download-progress events
autoUpdater.addListener('download-progress', (info) => {
  mainWindow.webContents.send('prog-made');
});

// Catch the update-downloaded event
autoUpdater.addListener('update-downloaded', (info) => {
  autoUpdater.quitAndInstall();
});

// Catch the error events
autoUpdater.addListener('error', (error) => {
  mainWindow.webContents.send('error', error.toString());
});

ipcMain.on('quitAndInstall', (event, arg) => {
  autoUpdater.quitAndInstall();
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

}
