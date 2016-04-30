var ipc = require('ipc');

var configuration = require('../configuration.js');

var closeEl = document.querySelector('.save');
closeEl.addEventListener('click', function (e) {
    var radios = document.getElementsByName("timeLimit");
    var newTimeLimit = null;
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            newTimeLimit = radios[i].value;
            break;
        }
    }
    if (newTimeLimit != null)
    {
        configuration.saveSettings('timeLimit', Number(newTimeLimit));
    }
    ipc.send('close-settings-window');
});



