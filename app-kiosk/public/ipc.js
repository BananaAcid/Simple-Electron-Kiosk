// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


// ESLint will warn about any use of eval(), even this one
// eslint-disable-next-line
window.eval = global.eval = function () {
    throw new Error(`Sorry, this app does not support window.eval().`)
}

// make jQuery available to the outside as well
window.$ = window.jQuery = require('./jquery-3.3.1.min.js');

// IPC
const {ipcRenderer} = require('electron');


// msg receiver
ipcRenderer.on('hello', data => console.warn('received', data) );


// auto bind to all elements with the attribute <element ipc="msg-identificator" ipc-data="some additional data" />
//  it will first try to use ipc-data then $().val() 
const identificator = 'ipc';
$(`[${identificator}]`).each( function (idx) {
    console.info('set', this);
    let $self = $(this);

    $self.on('click', function(ev) {
        console.info('click', $self.attr(identificator), $self.attr(`${identificator}-data`) || $self.val(), $self[0]);
        ipcRenderer.send( $self.attr(identificator), $self.attr(`${identificator}-data`) || $self.val() );
    });
});


// log loading
ipcRenderer.on('system-log-get-result', (sender,data) => {$('xmp').text(data); console.log('data received from', {sender: sender, data: data}); } );
// trigger on start
$(() => ipcRenderer.send('system-log-get') );
