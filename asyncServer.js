const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const async = require('async');
const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.get('/I/want/title',function(req,res){
    var address = req.query.address;
    if(!Array.isArray(address))
        address = [address];
    var index =0,len = address.length;
    var tasks = [];
    address.forEach(function(addr){
        tasks.push(
            function(next){
                request(checkURL(addr), function (error, response, body) {
                    if(error || response.statusCode != 200 ){
                        next(null,{
                            address:addr,
                            title: 'NO RESPONSE'
                        });
                    }
                    else{
                        next(null,{
                            address:addr,
                            title: pullTitle(body)
                        });
                    }
                });
            }.bind(addr)
        );
    });
    //now launching request
    async.parallel(tasks,function(err,result){
        res.render('index',{titles:result});
    });
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