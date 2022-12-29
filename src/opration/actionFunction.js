const { dialog } = require("electron");
const xlsAll = require("xlsx")
var fs = require('fs');

let worksheets_of_read = {}

async function handleFileOpen(windObject) {
    console.log("handleFileOpen is called");
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (canceled) {
        return
    } else {
        console.log(filePaths[0]);
        windObject.webContents.send('update-status', { status: 1, message: "file get", file_path: filePaths[0] })
        return filePaths[0]
        // ipcRenderer.sendSync()
    }
}

function performXlsxAutomation(windObject, file_path) {
    console.log("now start the automation on file", file_path);
    let data = [];
    if (file_path != undefined) {
        const read_file = xlsAll.readFile(file_path)
        console.log(read_file.SheetNames);

        for (const sheetname of read_file.SheetNames) {
            worksheets_of_read[sheetname] = xlsAll.utils.sheet_to_json(read_file.Sheets[sheetname])
        }

        let sheet1_worksheet_data = worksheets_of_read.Sheet1;
        // console.log("sheet1_worksheet_data : ", sheet1_worksheet_data);

        if (sheet1_worksheet_data.length > 0) {
            sheet1_worksheet_data.map((ele, index) => {
                // one way
                // delete ele["Temp_automation_number"];

                // second way
                // console.log("ele => ||", ele, " || index[", index, "]");
                // let result = Object.keys(ele).filter(key =>
                //     key !== 'Temp_automation_number').reduce((obj, key) => {
                //         obj[key] = ele[key];
                //         return obj;
                //     }, {})
                //     console.log("resut \n", result);

                // third way
                Object.keys(ele).map((objele, indexele) => {
                    if(indexele != 0){
                        // console.log("objele =>|",objele,"| indexele =>[",indexele,"]");
                        fs.stat(ele[objele], (err, stats) => {
                            if( !err ){
                                 if(stats.isFile()){
                                     console.log('is file ['+indexele+']? ' + stats.isFile(), " objele=>", objele," of => ", index);
                                 }
                            
                                 else if(stats.isDirectory()){
                                     console.log('is directory ['+indexele+']? ' + stats.isDirectory());
                                 }
                             }
                             else
                             console.log("error => ==>", err);
                                // throw err; 
                          })
                    }
                })
            })
            console.log("other snaple obvject => \n", sheet1_worksheet_data);
        } else {
            console.log("sorray sheet is empty : ", sheet1_worksheet_data);
        }
    }
}

module.exports = {
    handleFileOpen,
    performXlsxAutomation
}