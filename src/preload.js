const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
})

contextBridge.exposeInMainWorld("usbAPI", {
    sendData: () => ipcRenderer.invoke("data"),
    usbConnected: (callback) => {
        ipcRenderer.on("usb-connected", () => {
            callback();
        })
    },

    usbDisconnected: (callback) => {
        ipcRenderer.on("usb-disconnected", () => {
            callback();
        })
    }
})
