const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { performXlsxAutomation } = require('./opration/actionFunction');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
var windObject = null;
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  // windObject = mainWindow;
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

  windObject = createWindow();
  ipcMain.on("dialog:openFile", handleFileOpen)

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function handleFileOpen() {
  console.log("handleFileOpen is called");
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
      return
  } else {
      console.log(filePaths[0]);
      windObject.webContents.send('update-status', { status: 1, message: "file get", file_path: filePaths[0] })
      performXlsxAutomation(windObject, filePaths[0])
      return filePaths[0]
      // ipcRenderer.sendSync()
  }
}
