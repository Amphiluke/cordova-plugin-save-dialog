# cordova-plugin-save-dialog

This Cordova plugin for Android displays the native Save dialog which allows users to store a file in the selected location. The plugin utilizes the Storage Access Framework to save a file in a user-selected location as described in the [Android developer guide](https://developer.android.com/training/data-storage/shared/documents-files#create-file). Platforms other than Android are not supported currently.

## Installation

```
cordova plugin add cordova-plugin-save-dialog --save
```

## API

The plugin’s functionality is accessible through the object `cordova.plugins.saveDialog`.

### saveFile

Call this method to open the Save dialog and store raw contents in a file. The method accepts two arguments:

* file contents as a Blob instance,
* optional file name to display on default (the user may change it manually though).

To construct a Blob representation for a file contents, either use the [`Blob` constructor](https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob) directly:

```javascript
let blob = new Blob(["file contents"], {type: "text/plain"});
let fileName = "my-file.txt";
cordova.plugins.saveDialog.saveFile(blob, fileName).then(() => {
    console.info("The file has been successfully saved");
}).catch(reason => {
    console.warn(reason);
});
```

or apply other methods of blob generation (such as [`Response.blob()`](https://developer.mozilla.org/en-US/docs/Web/API/Response/blob) for a network-fetched content):

```javascript
try {
    let response = await fetch(`https://avatars.dicebear.com/api/avataaars/${Math.random()}.svg`);
    let blob = await response.blob();
    await cordova.plugins.saveDialog.saveFile(blob, "random-avatar.svg");
} catch (e) {
    console.error(e);
}
```
