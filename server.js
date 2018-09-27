const plainApp = require('./plain');
const asyncApp = require('./asyncServer');
const promiseApp = require('./promiseServer');

plainApp.listen(3000,function(){
    console.log('Plain server listening at port',3000);
});
asyncApp.listen(3001,function(){
    console.log('Async server listening at port',3001);
});
promiseApp.listen(3002,function(){
    console.log('Promise server listening at port',3002);
});