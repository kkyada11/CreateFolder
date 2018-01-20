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
let colCode = '';
let colTotal = 0;


let Config = {},
    $body = $('body'),
    storage = {
        data : []
    },
    $folderPath = $('.folder-path', $body),
    $folderPathPrint = $('span[id=printPath]', $folderPath),
    $folderPathButton = $('button[class=folder]', $folderPath),
    $excelFile = $('.excel-file', $body),
    $excelPrint = $('span[id=printExcel]', $excelFile),
    $excelFileButton = $('button[class=excel]', $excelFile),
    $createButton = $('button[class=create]', $body),
    $folderOpenButton = $('button[class=folderOpen]', $body),
    $selectSheetBox = $('select[name=sheet]', $body),
    $selectColBox = $('select[name=col]', $body),
    $logBox = $('textarea[id=logBox]', $body);

String.prototype.ignore = function (){
    // 특수 문자 제거.
    // let regExp = /[\{\}\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    let regExp = /[\{\}\/?:|\)*~`!^\<>@\#$%&\\\=\(\'\"]/gi;
    let tmp = this.replace(regExp, '');
    return tmp.replace(/[\s]/g, '\\ ');
};

let excel = {
    url : [],
    workBook:null,
    init : (obj) => {
        $.each(obj, (i, v) => {
            excel.url.push(v);
            excel.load(v);
        });
    },

    load : (u) => {
        try {
            this.workbook = XLSX.readFile(u);
            let sheet_name_list = this.workbook.SheetNames;

            settingOption.sheetSetting(sheet_name_list);
        }catch (e){
            alert('문서 형식이 잘못 되었습니다');
        }
    },

    sheetLoad : (sheetName) => {
        let workSheet = this.workbook.Sheets[sheetName];
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
        storage.data = data;
        //settingOption.init(headers);
        // let count = 0;
        // for(let item in storage.data) {
        //     if (!storage.data[item][colCode]) continue;
        //     // console.log(storage.data[item][colCode]);
        //     count++;
        // }
        settingOption.colSetting(headers);
    },

    colTotal : (v) => {
        let count = 0;
        for(let item in storage.data) {
            if (!storage.data[item][v]) continue;
            // console.log(storage.data[item][colCode]);
            count++;
        }
        return count;
    }

};

let log = {
    msg : (idx, m) => {
        let massage = '폴더 생성 했습니다 ('+idx+'/'+colTotal+')\n';
        $logBox.append(massage);
    }
};

let settingOption = {
    sheetSetting : (sheetGroup) => {
        $selectSheetBox.empty();
        $selectSheetBox.append(new Option('시트를 선택해주세요.', ''));
        for(let item in sheetGroup) {
            $selectSheetBox.append(new Option(sheetGroup[item], sheetGroup[item]));
        }
    },

    colSetting : (colGroup) => {
        let optionIndex = 0;
        $selectColBox.empty();
        $selectColBox.append(new Option('열를 선택해주세요.', ''));

        for(let item in colGroup) {
            $selectColBox.append(new Option(colGroup[item], item),optionIndex++);
        }
    }
};

$selectSheetBox.on('change', (e) =>{
    let $t = $(e.currentTarget);
    let sheetName = $t.val();
    excel.sheetLoad(sheetName);
});

$selectColBox.on('change', (e) =>{
    let $t = $(e.currentTarget);
    colCode = $t.val();
    colTotal = excel.colTotal($t.val());
});

$folderPathButton.on('click', (e) =>{
    IPC.send('Ob-folder-path');
});

$excelFileButton.on('click', (e) =>{
    IPC.send('Ob-excel-file');
});

$folderOpenButton.on('click', (e) =>{
    IPC.send('Ob-folder-open', selectPath[0]);
});

$createButton.on('click', (e) =>{
    if (!storage.data.length) {
        alert('폴더 리스트를 선택해 주세요.');
        return false;
    }

    if (!selectPath) {
        alert('생성할 폴더 경로를 지정해 주세요.');
        return false;
    }

    if (!$selectSheetBox.val()) {
        alert('생성할 폴더 시트를 지정해 주세요.');
        return false;
    }

    $logBox.html('');
    let count = 0;

    for(let item in storage.data) {
        if (!storage.data[item][colCode]) continue;
        let targetPath = PATH.join(selectPath[0],storage.data[item][colCode]);
        let path = 'mkdir '+targetPath;
        let el = new ExecLimiter(1);
        el.add(path, (e, idx) => {
            if(e === null){
                log.msg(++count, targetPath);
            }else {
                console.dir(e);
                return false;
            }
        })
    }
});

IPC.on('send-folder-path', (e, path) => {
    $folderPathPrint.text(path);
    selectPath = path;
    $folderOpenButton.prop({'disabled': false});
});

IPC.on('send-excel-file', (e, filePath) => {
    $excelPrint.text(filePath);
    excel.init(filePath);
});
