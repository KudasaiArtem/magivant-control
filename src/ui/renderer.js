const version = document.querySelector("#version");
const isConnectedStatus = document.querySelector("#is-connected");

usbAPI.usbConnected(() => {
    isConnectedStatus.innerText = "Connected";
})

usbAPI.usbDisconnected(() => {
    isConnectedStatus.innerText = "Disconnected";
})

version.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;
