const  express = require('express');

const app = express()

const puppeteer = require("puppeteer"); 
const cheerio = require("cheerio");    

const port=3000

app.get('/',(req,res) => {
    res.send('helo world')
})
app.listen(port,() => {
    console.log("app listeniang on http://localhost:3000/")
})

app.get('/time',(req,res)=>{
scrap_main_section(res,1);
})

app.get('/all_links',(req,res)=>{
    
scrap_main_section(res,0);


})
function scrap_main_section (res,val){
    var url="https://time.com";
    
    puppeteer
    .launch()
    .then(function (browser) {
        console.log("entered 2")
        
        return browser.newPage();
    })
    .then(function (page) {
        console.log("entered 3")

        return page.goto(url, { waitUntil: "load", timeout: 0 }).then(function () {
        console.log("entered 4")
              
            return page.content();
        });
    })
    .then(async function (html) {
        console.log("entered")
        let title = "";
        
        const $ = cheerio.load(html)
        let linkObjects=[]
        $("title", html).each(function () {                 //getting webstie title
            title = $(this).text();                        

        });
        console.log("website :" + title);
        
        if(val==1)
         linkObjects = $(".dek a", html);                   //getting webstie links
        else
         linkObjects=$("a",html)
        

        let total = linkObjects.length;


        let links = [];
 
        console.log(total)
        for (let i = 0; i < total; i++) {
            
            // console.log(linkObjects[i].attribs.href)
            // console.log($(linkObjects[i]).text().trim())

                links.push({
                    href: linkObjects[i].attribs.href.startsWith('/') ? url+linkObjects[i].attribs.href : linkObjects[i].attribs.href,
                    text: $(linkObjects[i]).text().trim()
                });
            
        }
            console.log(links)

res.status(200).send(links) 

    })
    .catch(err => {
        console.log(err.message);
    });

}



