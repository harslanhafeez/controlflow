const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const q = require('q');
const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.get('/I/want/title',function(req,res){
    var address = req.query.address;
    if(!Array.isArray(address))
        address = [address];
    var index =0,len = address.length;
    var promises = address.map(function(addr){
        return fetchTitles(addr);
    })
    //now launching request
    q.all(promises).then(function(results){
        res.render('index',{titles:results});
    });
});
app.use('*', function (req, res) {
    res.sendStatus(404);
});
function fetchTitles(addr){
    var defer = q.defer();
    request(checkURL(addr), function (error, response, body) {
        if(error || response.statusCode != 200 ){
            defer.resolve({
                address:addr,
                title: 'NO RESPONSE'
            });
        }
        else{
            defer.resolve({
                address:addr,
                title: pullTitle(body)
            });
        }
    });
        return defer.promise;
}
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