// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
console.log("PRELOAD EXECUTING")
const { contextBridge, ipcRenderer, webUtils } = require("electron/renderer");

contextBridge.exposeInMainWorld('electronAPI', {
    setSettings: (data) => ipcRenderer.send("save-settings", data),
    getFilePath: (file) => webUtils.getPathForFile(file),
    getFolderName: (filePath) => ipcRenderer.invoke('get-dir-name', filePath),
    selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
    setAppDir: (filePath) => ipcRenderer.send("set-app-dir", filePath),
    getSettings: () => ipcRenderer.invoke('get-settings'),
    getTotalUsers: (settings) => ipcRenderer.invoke("get-total-users", settings),
    sendEmail: (object) => ipcRenderer.invoke('send-email', object),
    getEmails: () => ipcRenderer.invoke("get-emails"),
    addEmails: (object) => ipcRenderer.invoke('add-emails', object)
})