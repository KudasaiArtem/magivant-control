const HID = require("node-hid");
const { usb } = require("usb");
const EventEmitter = require("events");

const VID = 0x2FC6;
const PID = 0xF13B;

let DAC = null;

class ConnectionManager {
    static VID = 0x2FC6;
    static PID = 0xF13B;
    static device = null;

    static events = new EventEmitter();

    static async start() {
        if (await this._isDeviceConnected()) {
            await this._connect();
        }

        usb.addEventListener("connect", async(connectedDevice) => {
            if (connectedDevice.device.vendorId === this.VID && connectedDevice.device.productId === this.PID) {
                await this._connect();
            }
        })

        usb.addEventListener("disconnect", (connectedDevice) => {
            if (connectedDevice.device.vendorId === this.VID && connectedDevice.device.productId === this.PID) {
                this._disconnect();
            }
        })
    }

    static async _isDeviceConnected() {
        const isConnected = await HID.devicesAsync(this.VID, this.PID);
        if (isConnected.length > 0) {
            return true;
        } else return false;
    }

    static async _connect() {
        try {
            this.device = await HID.HIDAsync.open(VID, PID);
            this.events.emit("connected");
            console.log("DAC connected");
            //console.dir(this.device);
            return true;
        } catch (error) {
            this.device = null;
            console.error(error);
            // this.events.emit("error");
            return false;
        }
    }

    static _disconnect() {
        if (this.device) {
            this.device.close();
            this.device = null;
            this.events.emit("disconnected");
            console.log("DAC disconnected");
            return true;
        } else return false;
    }

    static on(eventName, listener) {
        this.events.on(eventName, listener);
    }
}

module.exports = ConnectionManager;