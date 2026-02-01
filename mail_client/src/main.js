const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const fs = require("node:fs");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "assets/icons/app.ico"),
    webPreferences: {
      devTools: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

// handles the saving of settings
let appDataFolder;

function handleSettings(e, data) {
  if(!appDataFolder) return;

  fs.writeFileSync(`${appDataFolder}/settings.json`, JSON.stringify({
    backend: {
      host: data.backend.host,
      port: data.backend.port,
      secret: data.backend.secret
    }
  }, null, 2))
}

// adds the configs for data needed
function populateFolder(dataPath) {
  const validConfigs = ["settings.json", "emails.json"];
  const configData = {
    "settings.json": {
      backend: {
        host: "",
        port: 443,
        secret: ""
      }
    },
    "emails.json": {
      emails: [
        {
          to: "testing@test.com",
          subject: "example",
          dateMade: new Date(),
          placeholder: "Click to see more",
          id: new Date().getTime(),
          html: "<p>Test Email</p>"
        }
      ]
    }
  }

  const directoryData = fs.readdirSync(dataPath);

  validConfigs.forEach((config) => {
    if(!directoryData.includes(config)) {
      fs.writeFileSync(`${dataPath}/${config}`, JSON.stringify(configData[config], null, 2));
    }
  })
}

function handleAppDataFolder(e, folderPath) {
  appDataFolder = folderPath;

  populateFolder(folderPath);
}

ipcMain.handle('get-emails', () => {
  const fileData = fs.readFileSync(`${appDataFolder}/emails.json`, "utf-8");

  const parsed = JSON.parse(fileData);

  return parsed.emails;
})

ipcMain.handle('add-emails', (e, data) => {
  const fileData = fs.readFileSync(`${appDataFolder}/emails.json`, "utf-8");

  const parsed = JSON.parse(fileData);

  parsed.emails.push(data);

  fs.writeFileSync(`${appDataFolder}/emails.json`, JSON.stringify(parsed, null, 2));
})

ipcMain.handle("get-settings", () => {
  if(!appDataFolder) return false;
  
  const file = fs.readFileSync(`${appDataFolder}/settings.json`, "utf-8");
  const jsonFile = JSON.parse(file);
  jsonFile.directoryPath = appDataFolder;

  return jsonFile;
})

ipcMain.handle("get-dir-name", (e, filePath) => {
  return path.dirname(filePath);
})

ipcMain.handle("send-email", async (e, data) => {
  try {
    const response = await fetch(`${data.backend.host}:${data.backend.port}/mail/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authentication_key": data.backend.secret
      },
      body: JSON.stringify({
        email: data.email.to,
        subject: data.email.subject,
        html: data.email.html
      })
    })
    
    const json = await response.json();
    if(!json.status) return { status: false, message: json.error };

    return { status: true, message: json.message };
  } catch(e) {
    console.log(`Error: ${e}`);
  }
})

ipcMain.handle("get-total-users", async (e, settings) => {
  try {
    const response = await fetch(`${settings.host}:${settings.port}/info/total/users`, {
      method: "GET",
      headers: {
        "authentication_key": settings.secret
      }
    })

    const json = await response.json();
    return json;
  } catch(e) {
    console.log(`Error: ${e}`);
    return { status: false };
  }
})

ipcMain.handle('dialog:openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
    title: "Select a App Data Folder",
    buttonLabel: "Select Folder"
  })

  if(canceled) {
    return null;
  } else {
    return filePaths[0]
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // ip data
  ipcMain.on("save-settings", handleSettings);
  ipcMain.on('set-app-dir', handleAppDataFolder);

  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.