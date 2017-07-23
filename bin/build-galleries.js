#!/usr/bin/env node
const jimp = require("jimp");
const fs = require('fs');
const md = require("markdown-it")();
const _ = require("lodash");

const textsFolder = "content/shkaf_kupe/";
const figure = "templates/item.template.html";
const gallery = "templates/gallery.template.html";

let fg = fs.readFileSync(figure, 'utf8');
let gl = fs.readFileSync(gallery, 'utf8');

fs.readdir(textsFolder, (err, files) => {
    files.forEach(file => {
      let descriptions = textsFolder + file;
      fs.readFile(descriptions, 'utf8', (err,content) => {
        let parsed = md.parse(content);
        let title = parsed[2].children[0].content.split("title: ")[1];
        let description = parsed[2].children[2].content.split("description: ")[1];
        let photo1 = parsed[2].children[4].content.split("photo1: ")[1].replace("/im","im");
        let body = parsed[5].children[0].content;
        console.log(fg);
        let result = _.template(fg)({'photo1' : photo1, "description": description, "photo1_thumb" : photo1, "body" : body});
        let r2 = _.template(gl)({"gallery": result});
        fs.writeFile("shkaf_kupe.html", r2, 'utf8');
      });
    });
})



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



