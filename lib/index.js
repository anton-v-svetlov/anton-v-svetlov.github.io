#!/usr/bin/env node
var Jimp = require("jimp")
console.log("Hello from lahoda module!");

var fileName = "images/gallery/массив/стол_стулья_массив_дерево.JPG";
var outFileName = "images/gallery/массив/стол_стулья_массив_дерево_маленькое.JPG";

Jimp.read(, function (err, lenna) {
    if (err) throw err;
    lenna.resize(128, 128)            // resize
         .quality(60)                 // set JPEG quality
         .write(outFileName); // save
});
