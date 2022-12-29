// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: (data) => ipcRenderer.send('dialog:openFile', data),
    getStatus: (callback) => ipcRenderer.on('update-status', callback),
})