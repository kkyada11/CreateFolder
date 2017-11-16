/**
 * 각 스탭별 observer 생성.
 * */

const fs = require('fs');
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;

let folderPath, filePath;

ipc.on('Ob-folder-path', (e) =>{
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, (path) =>{
        if(path){
            folderPath = `${path}`;
            e.sender.send('send-folder-path', path);
        }
    })
});

ipc.on('Ob-excel-file', (e) =>{
    dialog.showOpenDialog({
        properties: ['openFile']
    }, (files) =>{
        if(files){
            filePath = files;
            e.sender.send('send-excel-file', files);
        }
    })
});

// ipc.on('Ob-run', (e, Config) =>{
//     jsonFileExtraction((fileName)=> {
//         e.sender.send('path-file-list', fileName)
//     }, Config);
// });