// Basic init
const electron = require('electron')
const {app, BrowserWindow} = electron

const sudo = require('sudo-prompt');
const sudoOptions = {
  name: 'Electron',
};

const PKTCHIP_KRNL = '4.4.13-ntc-mlc';
const PKTCHIP_ARCH = 'armv7l';

const exec = require('child_process').exec;
let arch;
let krnl;

exec('uname -m', function (error, stdout, stderr) {
  if (error) throw error;
  arch = stdout;
});

exec('uname -r', function (error, stdout, stderr) {
  if (error) throw error;
  krnl = stdout;
});

// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname)

// To avoid being garbage collected
let mainWindow

app.on('ready', () => {
    if (arch === PKTCHIP_ARCH && krnl === PKTCHIP_KRNL) {
      sudo.exec('echo heartbeat | tee /sys/class/leds/chip\:white\:status/trigger > /dev/null', sudoOptions,
        function(error, stdout, stderr) {
          if (error) throw error;
          console.log('stdout: ' + stdout);
        }
      );
    }

    mainWindow = new BrowserWindow({width: 480, height: 272})

    mainWindow.loadURL(`file://${__dirname}/app/index.html`)

})

app.on('before-quit',function()
{
  if (arch === PKTCHIP_ARCH && krnl === PKTCHIP_KRNL) {
    sudo.exec('echo none | tee /sys/class/leds/chip\:white\:status/trigger > /dev/null', sudoOptions,
      function(error, stdout, stderr) {
        if (error) throw error;
        console.log('stdout: ' + stdout);
      }
    );
  }
})
