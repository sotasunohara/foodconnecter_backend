//sqlデータベース設定
var mssql = require('mssql');

var conf=require('../dbpass/dbpass.js');
var config=conf.config;

var api={
    "get": function (req, res, next) {
        //urlパース設定
        var url=require('url');
        var url_parse=url.parse(req.url,true);
        var query=url_parse.query;
        
        var target_id=query.id;
        var foodnum=query.num;
        if(target_id ==null || foodnum == null){
            res.status(400).json({msg:'idまたはfoodnumが入力されていません'});
        }
        else{
            mssql.connect(config,function(err){
                console.log(err);
                if(err!=null){
                    res.status(400).json({msg:'データベースにアクセスできませんでした'});
                }
                else{
                    var request=new mssql.Request();
                    request.input('target_id',mssql.NVarChar,target_id);
                    request.input('foodnum',mssql.Int,foodnum);
                    //相手が決まってなければ設定
                    request.query('UPDATE dbo.food SET target_id=@target_id Where foodnum=@foodnum and target_id IS NULL',function(err,re){
                        console.log(err);
                    });
                    res.status(200).json({msg:'succeed'});
                }

            });
        }
        

        
    }
};
module.exports = api;
