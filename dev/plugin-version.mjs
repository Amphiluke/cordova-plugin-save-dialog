import {readFile, writeFile} from "node:fs/promises";
import packageJSON from "../package.json" assert {type: "json"};

let pluginXMLURL = new URL("../plugin.xml", import.meta.url);
let pluginXMLContent = await readFile(pluginXMLURL, {encoding: "utf8"});
let pluginXMLNewContent = pluginXMLContent.replace(/(?<=<plugin[^>]*? version=")[^"]+(?=")/, packageJSON.version);
if (pluginXMLNewContent !== pluginXMLContent) {
    await writeFile(pluginXMLURL, pluginXMLNewContent);
    console.info("Version in plugin.xml has been set to", packageJSON.version);
}
