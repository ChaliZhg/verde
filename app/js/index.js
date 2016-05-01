
count=0;
potato=0;

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

var configJson = require(getUserHome() + '/verde-config.json');

// configJson.timeLimit;
function runTest()
{
    count++;
    if (count==1)
    {
        var initialTime = new Date();
        var timeInterval = configJson.timeInterval
        var timeInSeconds = configJson.timeLimit*60*1000;
        // timeLimit = 60*1000;
        tol = 1.e-4;
        var timeString;
        testHandle = setInterval(clock, timeInterval);
        // document.getElementById("p1").innerHTML = Math.random();
        function clock()
        {
            var currentTime = new Date();
            var timeDifference = new Date;
            timeDifference.setTime(currentTime.getTime()-initialTime.getTime());
            var ratio = (currentTime.getTime() - initialTime.getTime())/timeInSeconds;
            if (ratio<1+tol)
            {
                move(ratio*100);
                function convert(value)
                {
                    if (Number(value) < 10)
                    {
                        return '0'+String(value);
                    }
                    else
                    {
                        return String(value);
                    }
                }
                timeString = convert(timeDifference.getMinutes())+':'+convert(timeDifference.getSeconds());
                document.getElementById("display").innerHTML = timeString;
                // document.title=ratio;
            }
            else
            {
                potato++;
                document.title = potato+'|'+ '100%';
                document.getElementById("label").innerHTML = '100.00%';
                clearTimeout( testHandle );
            }
                
        } 
      
    }
}

function resetTest()
{
    clearTimeout( testHandle );
    document.getElementById("display").innerHTML = '00:00';
    move(0);
    count=0;
}

function move(data) {
  var elem = document.getElementById("myBar");   
  elem.style.width = data + '%'; 
  document.getElementById("label").innerHTML = data.toFixed(2) + '%';
  document.title = potato+'|'+data.toFixed(2) + '%';

}

// var ipc = require('ipc');
var ipc = require('electron').ipcRenderer;

var closeEl = document.querySelector('.close');
closeEl.addEventListener('click', function () {
    ipc.send('close-main-window');
});

// to open setting page
var settingsEl = document.querySelector('.setting');
settingsEl.addEventListener('click', function () {
    ipc.send('open-settings-window');
});

// for tray and menu
var remote = require('remote');
var Tray = remote.require('tray');
var Menu = remote.require('menu');
var path = require('path');

var trayIcon = null;

if (process.platform === 'darwin') {
    trayIcon = new Tray(path.join(__dirname, 'img/verde.png'));
}
else {
    trayIcon = new Tray(path.join(__dirname, 'img/verde.png'));
}

var trayMenuTemplate = [
    {
        label: 'Verde',
        enabled: false
    },
    {
        label: String(configJson.timeLimit)+' min',
        enabled: false
    },
    {
        label: 'Config',
        click: function () {
            ipc.send('open-settings-window');
        }
    },
    {
        label: 'Quit',
        click: function () {
            ipc.send('close-main-window');
        }
    }
];

var trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
trayIcon.setContextMenu(trayMenu);

// for global shortcuts
ipc.on('global-shortcut', function (event, arg) {
    if (arg=='start')
    {
        runTest();
    }
    else
    {
        resetTest();
    }
});

ipc.on('new-setting', function (event, arg) {
    // become effective next time, not now
    // resetTest();
    // document.getElementById("display").innerHTML = arg;
    // configJson = require(getUserHome() + '/mato-config.json');
});