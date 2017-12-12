const url = require('url');
const path = require('path');
const autoUpdater = require('./auto-update');

const {app, BrowserWindow} = require('electron');

require('./main_process/index.js');

let mainWindow;

function singleInstance(){
    if(process.mas) return false;

    return app.makeSingleInstance(function(){
        if(mainWindow){
            if(mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus()
        }
    })
}

function createWindow(){
    mainWindow = new BrowserWindow({
        // width: 440+400,
        width: 440,
        height: 650,
        resizable: false,
        // frame: false,
        autoHideMenuBar: true,
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:'
    }));

    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function(){
        mainWindow = null;
    })
}

function initialize(){
    if(singleInstance()) return app.quit();

    app.on('ready', createWindow);

    app.on('window-all-closed', function(){
        if(process.platform !== 'darwin'){
            app.quit();
        }
    });

    app.on('activate', function(){
        if(mainWindow === null){
            createWindow();
        }
    });
}

switch(process.argv[1]){
    case '--squirrel-install':
        autoUpdater.createShortcut(function(){
            app.quit();
        });
        break;

    case '--squirrel-uninstall':
        autoUpdater.removeShortcut(function(){
            app.quit();
        });
        break;

    case '--squirrel-obsolete':
    case '--squirrel-updated':
        app.quit();
        break;

    default:
        initialize();
}