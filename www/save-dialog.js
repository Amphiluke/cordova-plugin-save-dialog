let exec = require("cordova/exec");
let moduleMapper = require("cordova/modulemapper");
let FileReader = moduleMapper.getOriginalSymbol(window, "FileReader") || window.FileReader;

module.exports = {
    saveFile(blob, name = "") {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, "SaveDialog", "locateFile", [blob.type || "application/octet-stream", name]);
        }).then(uri => {
            let reader = new FileReader();
            reader.onload = () => {
                exec(resolve, reject, "SaveDialog", "saveFile", [uri, reader.result]);
            };
            reader.onerror = () => {
                reject(reader.error);
            };
            reader.onabort = () => {
                reject("Blob reading has been aborted");
            };
            reader.readAsArrayBuffer(blob);
        });
    }
};
