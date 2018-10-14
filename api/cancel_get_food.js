//sqlデータベース設定
var mssql = require('mssql');

var conf=require('../dbpass/dbpass.js');
var config=conf.config;

function getcancel(request,body,query,callback){
    var error=0;
    var i=0;
    request.input('id',mssql.NVarChar,body.id);
    request.input('foodnum',mssql.NVarChar,body.foodnum);
    request.input('')
}

var api={
    "post": function (req, res, next) {
        
    }
};
module.exports = api;
