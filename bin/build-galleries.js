#!/usr/bin/env node
const jimp = require("jimp");
const fs = require('fs');
const md = require("markdown-it")();
const _ = require("lodash");
const parse5 = require("parse5");
const path = require("path");
const figure = "templates/item.template.html";
const gallery = "templates/gallery.template.html";

function Category(name) 
{
    return {name : name};
}

function CategoryView(category)
{
    return {model:category,title:"Шкафы купе", head : "Примеры шкафов купе", contentDescription: "Шкафы купе."};
}

function Content(category)
{
    return {textDir :"content/"+ category.name + "/", imagesDir : "./images/gallery/"+ category.name +"/"};
}

let category = new Category("shkaf_kupe");
let content = new Content(category);
let fg = fs.readFileSync(figure, 'utf8');
let gl = fs.readFileSync(gallery, 'utf8');

let allFlags = fs.readdirSync(content.textDir);

let items = allFlags.map(x => {
  let itemText = fs.readFileSync(content.textDir + x, 'utf8');
  console.log(itemText);
  let parsed = md.parse(itemText);
  let title = parsed[2].children[0].content.split("title: ")[1];
  let description = parsed[2].children[2].content.split("description: ")[1];
  let photo1 = parsed[2].children[4].content.split("photo1: ")[1].replace("/im","im");
  let body = parsed[5].children[0].content;
  return {title : title, description : description, photo1 : photo1, body : body};
});

function transform(from,to) 
{
    let images = {};
    console.log(from);
    console.log(to);
            jimp.read(from, function (err, img) {
                if (err) throw err;
                images.width = img.bitmap.width;
                images.height = img.bitmap.height;
                let thumb = img.scaleToFit(256, 256)
                    .quality(60)
                    .write(to);
                 images.thumb_width = thumb.bitmap.width;
                 images.thumb_height = thumb.bitmap.height;   
            });
    return images;
}

let templatedItems = items.map(x=> 
{
    let basename = path.basename(x.photo1);
    let photo1_thumb = content.imagesDir + "thumb/" + basename;
    let img = transform(x.photo1, photo1_thumb);
    return _.template(fg)({'photo1' : x.photo1, "description": x.description, "photo1_thumb" : photo1_thumb.replace("./im","im"), "body" : x.body});
});

let allBodies = templatedItems.join('\n');

let r2 = _.template(gl)({"gallery": allBodies});
fs.writeFile(category.name + ".html", r2, 'utf8');

