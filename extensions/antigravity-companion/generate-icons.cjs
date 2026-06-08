const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'icons');

if (!fs.existsSync(iconsDir)){
    fs.mkdirSync(iconsDir);
}

// Base64 representations of simple solid cyan rounded icons (with varying sizes)
const icon16Base64 = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAW0lEQVR42mNkEPr/nwGPwDwGBvQCZDFGg1EBGA1GBUAZDEyMDIxQjCwGUgwMDAyoEizEGiCsAMIg4gCMAuIBIAVYAURB2AHEW0AagDgLiACQYAFpAGIQcQBGAfEAAJp+JvF/yKmbAAAAAElFTkSuQmCC";
const icon48Base64 = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAd0lEQVR42u3XsQ0AIAwEsYf9d2YGNmAEj6ruKgIJiX+K2gC1AWoD1AaoDVAbIDdAXoD8AKwAOwAzALgBmAEYARgBGAGUAVgBlAFYARgBGAGUAVgBlAFYARgBGAGUAVgBlAFYARgBGAGUAVgBlAFYAb8aoDZAbYDagH8NsAAK/S3xdq1uGAAAAABJRU5ErkJggg==";
const icon128Base64 = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAu0lEQVR42u3XsQ0AIAwEsYf9d2YGNgR6V3VXEUhI/FPUBqgNUBugNkBtgNoAuQHyAuQHYAXYAZgBwA3ADMAMwAjACMAMoAzACqAMwAqgDMAIoAzACqAMwArACqAMwAqgDMAIoAzACqAMwArACqAMwAqgDMAIoAzACqAMwArACqAMwArACqAMwAqgDMAIoAzACqAMwArACqAMwArACqAMwArACqAMwAqgDMAIoAzACqAMwArACqAMwArACqAMwArACqAMwAqgNuC2AV60M/F3M1GzAAAAAElFTkSuQmCC";

const writeIcon = (filename, base64Str) => {
  const filePath = path.join(iconsDir, filename);
  fs.writeFileSync(filePath, Buffer.from(base64Str, 'base64'));
  console.log(`Generated ${filePath}`);
};

writeIcon('icon16.png', icon16Base64);
writeIcon('icon48.png', icon48Base64);
writeIcon('icon128.png', icon128Base64);

console.log("Icon assets successfully generated!");
