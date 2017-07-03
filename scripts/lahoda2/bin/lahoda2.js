#!/usr/bin/env node
const jimp = require("jimp");
const fs = require('fs');


console.log("Starting Lahoda.");

const rootDir = './images/gallery/detskaya/';
const outFileName = rootDir + 'thumb/';


fs.readdir(rootDir, (err, files) => {
    files.forEach(file => {
        if (!file.endsWith("thumb")) {
            jimp.read(rootDir + file, function (err, lenna) {
                if (err) throw err;

                lenna.scaleToFit(256, 256)
                    .quality(60)
                    .write(outFileName + file);

            });
        }
    });
})



