/**
 * 각 스탭별 이벤트 추가.
 * */
const $ = require('../js/jquery-1.11.3');
const PATH = require('path');
const XLSX = require('xlsx');
const IPC = require('electron').ipcRenderer;

// 교체 가능.
const ExecLimiter = require("exec-limiter");

let rootPath = PATH.join(__dirname, '..');
let selectPath = '';
let colCode = 'A';


let Config = {},
    $body = $('body'),
    storage = {},
    $folderPath = $('.folder-path', $body),
    $folderPathPrint = $('span[id=printPath]', $folderPath),
    $folderPathButton = $('button[class=folder]', $folderPath),
    $excelFile = $('.excel-file', $body),
    $excelPrint = $('span[id=printExcel]', $excelFile),
    $excelFileButton = $('button[class=excel]', $excelFile),
    $createButton = $('button[class=create]', $body),
    $selectBox = $('select[name=col]', $body),
    $logBox = $('textarea[id=logBox]', $body);

String.prototype.ignore = function (){
    // 특수 문자 제거.
    var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

    this.replace(regExp);

    return this.replace(/[\s]/g, '\\ ');
};

let excel = {
    url : [],
    init : (obj) => {
        $.each(obj, (i, v) => {
            excel.url.push(v);
            excel.load(v);
        });
    },
    load : (u) => {
        let workbook = XLSX.readFile(u);
        let sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach((sheetName) => {
            let workSheet = workbook.Sheets[sheetName];
            let headers = {};
            let data = [];
            for(let item in workSheet) {
                if(item[0] === '!') continue;
                //parse out the column, row, and value

                let tt = 0;
                for (let i = 0; i < item.length; i++) {
                    if (!isNaN(item[i])) {
                        tt = i;
                        break;
                    }
                };

                let col = item.substring(0,tt);
                let row = parseInt(item.substring(tt));
                let value = String(workSheet[item].v);

                headers[col] = col;

                if(!data[row]) data[row]={};
                data[row][headers[col]] = value.ignore();
            }
            //drop those first two rows which are empty
            data.shift();
            // console.log(data);
            storage.data = data;
            //settingOption.init(headers);
            let count = 0;
            for(let item in storage.data) {
                if (!storage.data[item][colCode]) continue;
                console.log(storage.data[item][colCode]);
                count++;
            }
            console.log(count);
            settingOption.init(headers);
        });
    }
};

let log = {
    msg : (m) => {
        let massage = m + ' 폴더 생성 했습니다\n';
        $logBox.prepend(massage);
    }
};

let settingOption = {
    init : (colGroup) => {
        let optionIndex = 0;
        $selectBox.empty();
        for(let item in colGroup) {
            $selectBox.append(new Option(colGroup[item], item),optionIndex++);
        }
    }
};

$selectBox.on('change', (e) =>{
    let $t = $(e.currentTarget);
    colCode = $t.val();
});

$folderPathButton.on('click', (e) =>{
    IPC.send('Ob-folder-path');
});

$excelFileButton.on('click', (e) =>{
    IPC.send('Ob-excel-file');
});

$createButton.on('click', (e) =>{
    if (!selectPath) {
        alert('생성할 폴더 경로를 지정해 주세요.');
        return false;
    }
    if (!storage.data.length) {
        alert('폴더 리스트를 선택해 주세요.');
        return false;
    }
    $logBox.html('');
    for(let item in storage.data) {
        if (!storage.data[item][colCode]) continue;
        let targetPath = PATH.join(selectPath[0],storage.data[item][colCode]);

        let path = 'mkdir '+targetPath;
        let el = new ExecLimiter(1);
        el.add(path, (e, idx) => {
            log.msg(targetPath);
        })
    }
});

IPC.on('send-folder-path', (e, path) => {
    $folderPathPrint.text(path);
    selectPath = path;
});

IPC.on('send-excel-file', (e, filePath) => {
    $excelPrint.text(filePath);
    excel.init(filePath);
});
