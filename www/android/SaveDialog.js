let exec = require("cordova/exec");
let {keep: keepBlob, get: getBlob, clear: clearBlob} = require("./BlobKeeper");
let moduleMapper = require("cordova/modulemapper");
let FileReader = moduleMapper.getOriginalSymbol(window, "FileReader") || window.FileReader;

let locateFile = (type, name) => new Promise((resolve, reject) => {
    exec(resolve, reject, "SaveDialog", "locateFile", [type || "application/octet-stream", name]);
});

let saveFile = (uri, blob) => new Promise((resolve, reject) => {
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

module.exports = {
    saveFile(blob, name = "") {
        return keepBlob(blob) // see the “resume” event handler below
            .then(() => locateFile(blob.type, name))
            .then(uri => saveFile(uri, blob))
            .then(uri => {
                clearBlob();
                return uri;
            })
            .catch(reason => {
                clearBlob();
                return Promise.reject(reason);
            });
    }
};

// If Android OS has destroyed the Cordova Activity in background, try to complete the Save operation
// using the URI passed in the payload of the “resume” event and the blob stored by the BlobKeeper.
// https://cordova.apache.org/docs/en/10.x/guide/platforms/android/plugin.html#launching-other-activities
document.addEventListener("resume", ({pendingResult = {}}) => {
    if (pendingResult.pluginServiceName !== "SaveDialog") {
        return;
    }
    if (pendingResult.pluginStatus !== "OK" || !pendingResult.result) {
        clearBlob();
        return;
    }
    getBlob().then(blob => {
        if (blob instanceof Blob) {
            saveFile(pendingResult.result, blob).catch(reason => {
                console.warn("[SaveDialog]", reason);
            });
        }
        clearBlob();
    });
}, false);
