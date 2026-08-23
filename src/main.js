const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const ConnectionManager = require("./modules/connection");

const createWindow = async () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
    });

    //win.setMenu(null);

    await win.loadFile(path.join(__dirname, "ui", "index.html"));
}

app.whenReady().then(async() => {
    await createWindow();

    await ConnectionManager.start();
})

const getMainWindow = function() {
    const windows = BrowserWindow.getAllWindows();

    if (windows.length > 0) {
        return windows[0];
    }
}

ConnectionManager.on("connected", () => {
    const win = getMainWindow();
    win.webContents.send("usb-connected");
})

ConnectionManager.on("disconnected", () => {
    const win = getMainWindow();
    win.webContents.send("usb-disconnected");
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
