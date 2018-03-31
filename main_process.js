// Basic init
const electron = require('electron');
const {app, BrowserWindow} = electron;

const PKTCHIP_KRNL = '4.4.13-ntc-mlc';
const PKTCHIP_ARCH = 'arm';

const os = require('os');

const { exec } = require('child_process');

// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname);

// To avoid being garbage collected
let mainWindow;

app.on('ready', () => {
    if (os.arch() === PKTCHIP_ARCH && os.release() === PKTCHIP_KRNL) {
      exec('echo heartbeat | tee /sys/class/leds/chip\:white\:status/trigger > /dev/null', (err, stdout, stderr) => {
        if (err) throw err;
      });
    }

    mainWindow = new BrowserWindow({width: 480, height: 272});

    mainWindow.setFullScreen(true);

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);

})

app.on('before-quit',function()
{
  if (os.arch() === PKTCHIP_ARCH && os.release() === PKTCHIP_KRNL) {
    exec('echo none | tee /sys/class/leds/chip\:white\:status/trigger > /dev/null', (err, stdout, stderr) => {
      if (err) throw err;
    });
  }
})
