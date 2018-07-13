import path from 'path';
import util from 'util';
import debug from 'debug';

const d = debug('app:kiosk');

import electron, {ipcMain, session} from 'electron';

// debug helper
function i(el) {
    console.info(util.inspect(el, { showHidden: true, depth: null }));
}

// enable to DISABLE a few things
const EASYDEBUG = false;


// proccess reference
const app = electron.app;

// window reference
let mainWindow;

// quit is usually blocked
let allowQuit = false;

// in case of windows msgs showing up, we keep focus - except the devtools have been opned
let allowFocus = true;


// __dirname is not available for node esm (ES-Modules), not required for babel
//if (!__dirname) var __dirname = path.resolve(path.dirname(decodeURI(new URL(imp     ort.meta.url).pathname))); // fucks up babel





{// button tests
    ipcMain.on('button-close', (event, arg)=> {
        d('button action received: button-close ');
        
        allowQuit = true;
        app.quit();
    });

    ipcMain.on('button-enabledev', (event, arg)=> {
        d('button action received: button-enabledev');
        
        //show the dev tools for debugging 
        mainWindow.webContents.openDevTools();
    });

    ipcMain.on('button-hello', (event, arg)=> {
        d('button action received: button-hello = ' + arg);
        event.sender.send('hello', 'button-hello was received: ' + arg);
    });
}


// creating main window and sewtting required info
function createWindow () {
    d('main window: creating ...');

    // initil values
    allowQuit = false;
    allowFocus = true;

    // create main window
    mainWindow = new electron.BrowserWindow({
        show: false,                                        // hide window, manually show it, when all is ready (no slow visual construction)
        frame: false,                                       // no borders
        backgroundColor: '#ccc',                            // basic background during any loading
        titleBarStyle: (!EASYDEBUG ? 'hidden':'visible'),   // no title bar (just in case)
        //icon: path.join(__dirname, 'src/64x64.png'),      // statusbar icon

        width: 500,                                         // for EASYDEBUG
        height: 500                                         // ...
    });


    // Load the app's interface
    mainWindow.loadURL(`file://${__dirname}/public/index.html`);
     
    // if all has been prepared, show the window
    mainWindow.once('ready-to-show', () => {
        d('event ready-to-show');

        if (!EASYDEBUG)
            mainWindow.setKiosk(true);

        mainWindow.show();
    });

    // do NOT allow CMD+Q and ALT+F4 -- Siri may open another app and thus leave the kiosk
    mainWindow.on('close', (ev) => (!EASYDEBUG && !allowQuit) && ev.preventDefault() );

    // make sure, we free the reference
    mainWindow.on('closed', () => mainWindow = null);

    // in case of windows msgs showing up
    setInterval(() => {
        if (!EASYDEBUG && allowFocus) {
            mainWindow.focus();
            mainWindow.webContents.focus();
        }
    }, 1000);

    mainWindow.webContents.on('devtools-opened', () => {
        allowFocus = false;
    });

    d('main window: created.');
}


export default {init: async () =>
{ // app proccess events

    d('initiated.');

    // set some security feature on first start
    app.once('ready', () => {
        // https://electronjs.org/docs/tutorial/security#6-define-a-content-security-policy
        session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
            callback({responseHeaders: `default-src 'self'`});
        });
    });

    // open an initial window
    app.on('ready', createWindow);

    // handle window closing
    app.on('window-all-closed', () => {
        d('event window-all-closed');
        if (mainWindow.isKiosk() || process.platform !== 'darwin') app.quit(); // OSX apps usually keep the container app open
    });

    // handle reactivating the proccess
    app.on('activate', () => {
        d('event activate');
        if (mainWindow === null) {
            createWindow();
        }
    });
}
}