const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.get('/ping',function(req,res){
    res.send('pong');
});

app.get('/I/want/title',function(req,res){
    var address = req.query.address;
    if(!Array.isArray(address))
        address = [address];
    var index =0,len = address.length, titles=[];
    address.forEach(function(addr){
        request(checkURL(addr), function (error, response, body) {
            if(error || response.statusCode != 200 ){
                titles.push({
                    address:addr,
                    title: 'NO RESPONSE'
                });
                shouldRespond();
            }
            else{
                titles.push({
                    address:addr,
                    title: pullTitle(body)
                });
                shouldRespond();
            }
            
            });
    });
    function shouldRespond(){
        if(++index == len){
        res.render('index',{titles:titles});
        }
    }
});
app.use('*', function (req, res) {
    res.sendStatus(404);
});

function checkURL(url){
    if(url.indexOf('http:') == -1 || url.indexOf('https:') == -1)
        return 'http://'+url;
    return url;
}

function pullTitle(body){
    body = body.toString();
    var startIndex = body.indexOf('<title>'), endIndex = body.indexOf('</title>'), title='NO RESPONSE';
    if(startIndex > -1){
        title = body.slice(startIndex+7,endIndex);
    }
    return title;
}


module.exports = app;