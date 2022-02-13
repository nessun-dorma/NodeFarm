const fileSystem = require("fs");
const httpServ = require("http");
const url = require("url");

const replaceTemplate = require('./modules/replaceTemplate');

// TEMPLATES
const tempOverview = fileSystem.readFileSync(`${__dirname}/templates/template_overview.html`, "utf-8");
const tempProduct = fileSystem.readFileSync(`${__dirname}/templates/template_prod.html`, "utf-8");
const tempCard = fileSystem.readFileSync(`${__dirname}/templates/template_card.html`, "utf-8");


// DATA
const data = fileSystem.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data)



// SERVER
const serverObj = httpServ.createServer((req, res)=>{
    const {query, pathname} = url.parse(req.url, true);

    //ROUTES
    if(pathname === "/" || pathname === "/overview"){
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    } else if (pathname === "/product"){
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    } else if (pathname === "/api"){
        res.writeHead(200, {"Content-type": "application/json"});
        res.end(data);
    } else {
        res.writeHead(404)
        res.end("Error");
    }

})

serverObj.listen(8080)