/**
    onmessage: Callback function to show the user a message.
 **/
var midi = { };

if (navigator.requestMIDIAccess) {
    var _controlMap = { };
//    var _controlMap = { };
    var _learning = false;
    var _learnSource = null; // Midi signal
    var _learnTarget = null; // DOM element
    var _outputs = [ ];

    var userMessage = function(msg) {
        if (typeof midi.onmessage === 'function') {
            midi.onmessage(msg);
        }
    };

    var loadControlMap = function() {
        var map = JSON.parse(localStorage.getItem('midiMap') || '{}');
        for (var command in map) {
            if (map.hasOwnProperty(command)) {
                _controlMap[command] = document.getElementById(map[command]);
            }
        }
    };

    var saveControlMap = function() {
        var map = { };
        for (var command in _controlMap) {
            if (_controlMap.hasOwnProperty(command)) {
                map[command] = _controlMap[command].id;
            }
        }
        localStorage.setItem('midiMap', JSON.stringify(map));
    };

    var send = function(type, receiver, value) {
        _outputs.forEach(function(dev) {
            dev.send([type, receiver, value]);
        });
    };

    midi.isLearning = function() {
        return _learning;
    };

    midi.startLearning = function() {
        _learning = true;
        _learnSource = { };
        _learnTarget = { };
        userMessage('Learning...');
    };

    midi.stopLearning = function() {
        _learning = false;
        if (_learnSource.type && _learnSource.type == _learnTarget.type) {
            var oldTarget = null;
            for (var i in _controlMap) {
                if(_controlMap[i] == _learnTarget) {
                    oldTarget = _learnTarget;
                    break;
                }
            }
            if ((!_controlMap[_learnSource.elem] ||
                 confirm('Replace old midi binding?')) &&
                (oldTarget === null ||
                 confirm('Control already bound. Bind it anyway? (All bound controls can be used)'))) {
                _controlMap[_learnSource.elem] = _learnTarget.elem;
                saveControlMap();
                userMessage('Midi control mapped successful.');
            }
        } else {
            userMessage('Types of source and target do not match.');
        }
    };

    midi.leftBar = function(value) {
        send(180, 80, Math.round(value * 15) + 48);
    };

    midi.rightBar = function(value) {
        send(180, 81, Math.round(value * 15) + 48);
    };

    var sliderClicked = function() {
        if (_learning){
            _learnTarget = {
                type: 'slider',
                elem: this
            };
        }
    };

    var buttonClicked = function() {
        if (this.type == 'checkbox') {
            for (var command in _controlMap) {
                if (_controlMap.hasOwnProperty(command) &&
                    _controlMap[command] == this) {
                    send(148, command.split('/')[2], this.checked ? 1 : 0);
                }
            }
        }
        if (_learning) {
            _learnTarget = {
                type: 'button',
                elem: this
            };
        }
    };

    var init = function() {
        loadControlMap();

        var buttons = document.querySelectorAll(
            'button:not(#learnButton), input[type=button], input[type=checkbox]'
            );
        for (var i = 0; i < buttons.length; ++i) {
            buttons[i].addEventListener('click', buttonClicked);
        }

        var sliders = document.querySelectorAll('input[type=range]');
        for (var i = 0; i < sliders.length; ++i) {
            sliders[i].addEventListener('click', sliderClicked);
        }
    };

    var processSliderMessage = function(msg) {
        var address = msg.srcElement.id + '/' + msg.data[0] + '/' +
                      msg.data[1];
        var elem = _controlMap[address];

        if (elem) {
            var min = parseFloat(elem.min);
            var max = parseFloat(elem.max);
            elem.value = (msg.data[2] / 128.0) * (max - min) + min;
            elem.dispatchEvent(new Event('input'));
        }

        if (_learning) {
            _learnSource = {
                type: 'slider',
                elem: address
            };
        }
    };

    var processButtonDownMessage = function(msg) {
        send(148, msg.data[1], 1);

        var address = msg.srcElement.id + '/' + msg.data[0] + '/' +
                      msg.data[1];
        var elem = _controlMap[address];

        if (elem) {
            elem.click();
        }

        if (_learning) {
            _learnSource = {
                type: 'button',
                elem: address
            };
        }
    };

    var processButtonUpMessage = function(msg) {
        var address = msg.srcElement.id + '/' + msg.data[0] + '/' +
                      msg.data[1];
        var elem = _controlMap[address];
        if (!elem || elem.type != 'checkbox') {
            send(148, msg.data[1], 0);
        }
    }

    var processMessage = function(msg) {
        var t = (msg.data[0] >> 4);
        if (t == 0x9) processButtonDownMessage(msg);
        if (t == 0x8) processButtonUpMessage(msg);
        if (t == 0xB) processSliderMessage(msg);
    };

    var requestSuccess = function(MIDIAccess) {
        var inputs = MIDIAccess.inputs;
        if (inputs.size <= 0) {
            console.log('No MIDI controller found.');
        } else {
            console.log(MIDIAccess.outputs);
            for (var input of inputs.values()) {
                input.onmidimessage = processMessage;
                for (var output of MIDIAccess.outputs.values()) {
                    if (output.name === input.name) {
                        _outputs[_outputs.length] = output;
                    }
                }
            }
        }
    };

    var requestError = function() {
        console.log('Midi access denied.');
    };

    navigator.requestMIDIAccess().then(requestSuccess, requestError);
    window.addEventListener('DOMContentLoaded', init);
} else {
    console.log('Midi API not found.');
}
