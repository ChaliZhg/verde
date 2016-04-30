const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// var ipc = require('ipc');
var ipc = require('electron').ipcMain;

var globalShortcut = require('global-shortcut');

var configuration = require('./configuration');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // read configuration setting
  if (!configuration.readSettings('timeLimit')) {
        configuration.saveSettings('timeLimit', 25);
    }
  if (!configuration.readSettings('timeInterval')) {
        configuration.saveSettings('timeInterval', 1000);
    }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 110,
    center: true,
    frame: false,
    transparent: true,
    resizable: false,
    icon: __dirname + '/app/img/verde.png'
  });
  // mainWindow.setFullScreen(true);
  // mainWindow.setMenu(null);

  // and load the index.html of the app.
  //mainWindow.loadURL('http://chaozhang.in/index.html');
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

  // to set global shortcuts
  globalShortcut.register('ctrl+shift+s', function () {
      mainWindow.webContents.send('global-shortcut', 'start');
  });
  globalShortcut.register('ctrl+shift+r', function () {
      mainWindow.webContents.send('global-shortcut', 'reset');
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});


ipc.on('close-main-window', function () {
    app.quit();
});

// to create setting page
var settingsWindow = null;

ipc.on('open-settings-window', function () {
    if (settingsWindow) {
        return;
    }

    settingsWindow = new BrowserWindow({
        width: 800,
        height: 110,
        center: true,
        frame: false,
        transparent: true,
        resizable: false
    });

    settingsWindow.loadURL('file://' + __dirname + '/app/settings.html');

    settingsWindow.on('closed', function () {
        settingsWindow = null;
    });
});

// to close setting page
ipc.on('close-settings-window', function () {
    if (settingsWindow) {
        settingsWindow.close();
        mainWindow.webContents.send('new-setting', 'new');
    }
});

// to add configuration file
