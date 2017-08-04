#!/usr/bin/env node
const jimp = require("jimp");
const fs = require('fs');
const md = require("markdown-it")();
const _ = require("lodash");
const parse5 = require("parse5");
const path = require("path");
const figure = "templates/item.template.html";
const gallery = "templates/gallery.template.html";


function Category(name) {
    return { name: name };
}

function CategoryView(category, headtitle, bodyh2, contentDescription) {
    return { model: category, headtitle: headtitle, bodyh2: bodyh2, contentDescription: contentDescription };
}

function Content(category) {
    return { textDir: "content/" + category.name + "/", imagesDir: "./images/gallery/" + category.name + "/" };
}

let fg = fs.readFileSync(figure, 'utf8');
let gl = fs.readFileSync(gallery, 'utf8');

function buildCategry(category, content, categoryView) {
    let allFlags = fs.readdirSync(content.textDir);

    let items = allFlags.map(x => {
        let itemText = fs.readFileSync(content.textDir + x, 'utf8');
        let parsed = md.parse(itemText);
        let title = parsed[2].children[0].content.split("title: ")[1];
        let description = parsed[2].children[2].content.split("description: ")[1];
        let photo1 = parsed[2].children[4].content.split("photo1: ")[1].replace("/im", "im");
        let body = parsed[5].children[0].content;
        return { title: title, description: description, photo1: photo1, body: body };
    });

    function transform(from, to, fillImage) {
        return jimp.read(from).then(img => {
            let images = {};
            images.width = img.bitmap.width;
            images.height = img.bitmap.height;
            let thumb = img.scaleToFit(256, 256)
                .quality(60)
                .write(to);
            images.thumb_width = thumb.bitmap.width;
            images.thumb_height = thumb.bitmap.height;
            return fillImage(images);
        });
    }

    function fillImage(x, photo1_thumb, img) {
        let model = {
            'photo1': x.photo1, 'description': x.description, 'photo1_thumb': photo1_thumb.replace("./im", "im"), 'body': x.body,
            'width': img.width, 'height': img.height, 'thumb_height': img.thumb_height, 'thumb_width': img.thumb_width
        };
        return _.template(fg)(model);
    }

    let templatedItems = items.map(x => {
        let basename = path.basename(x.photo1);
        let photo1_thumb = content.imagesDir + "thumb/" + basename;
        let qwe = (zzz) => fillImage(x, photo1_thumb, zzz);
        return transform(x.photo1, photo1_thumb, qwe);
    });

    Promise.all(templatedItems)
        .then(x => {
            var qe = x.join('\n');
            let r2 = _.template(gl)({ "gallery": qe, "bodyh2": categoryView.bodyh2, "headtitle": categoryView.headtitle, "contentDescription": categoryView.contentDescription, "name": categoryView.model.name });
            fs.writeFile(category.name + ".html", r2, 'utf8');
        });
}

let category = new Category("shkaf_kupe");
let content = new Content(category);
let categoryView = new CategoryView(category, "Шкафы купе", "Примеры шкафов купе", "Шафы-купе, дверцы у них открываются не настежь, а в сторону, экономя при этом пространство комнаты. Встроенные шкафы купе максимально эффективно используют пространство.");
buildCategry(category,content, categoryView);

let category2 = new Category("detskaya");
let content2 = new Content(category2);
let categoryView2 = new CategoryView(category2, "Детская мебель.", "Примеры сделанной мной детской мебели.", "");
buildCategry(category2,content2, categoryView2);