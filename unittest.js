
//require
var http = require('client-http'), 
url = require('url'), 
qs = require('querystring'), 
fs = require('fs'), 
sleep = require('sleep'),
cheerio = require('cheerio'),
config = require('./setting.js');


var i = 0, opt = config.option;

function doCrawler(){

    if( (!opt.test[i]) || (opt.test[i] == 'break')) {
        console.log("\n\n ******* break ******* ");
        return ;  
    } 

    var unit = opt.test[i] , 
    turl = ((unit.opt.https || false)? 'https://' : 'http://') + opt.hostname,
    send = {post : {}, cookies : {}, header : null}; 

    console.log(typeof(unit.preActionFunc));

    if(typeof(unit.preActionFunc) == 'function') {
        unit.preActionFunc(unit, opt.global, send)
    }

    console.log("\n======== " + unit.desc + " ==========");
    http.request(turl, function(data, n, cookie, header, res) {
        try{
            if(res.statusCode != 200) {
                if(typeof(opt.completeFail) == 'function') {
                    opt.completeFail(data, send, unit, res)
                } else {
                    throw Expection("request error : ", res.statusCode)
                }
            }

            if(typeof(unit.postActionFunc) == 'function') {
                unit.postActionFunc(unit, opt.global, send)
            }

            var dd = (header["content-type"].indexOf('json') != -1)? JSON.parse(data) : 
            (( res.headers["content-type"].indexOf('html') != -1)? cheerio.load(data) : data );

            
            if((typeof(unit.unitTestFunc) == 'function') && unit.unitTestFunc(dd, send, unit, res, data) ) {
                if(typeof(opt.completeSuccess) == 'function') {
                    opt.completeSuccess(dd, send, unit, res, data);
                }
            }
            console.log("curl completed!");
        } catch (e) {
            if(typeof(opt.completeFail) == 'function') {
                opt.completeFail(data, send, unit, res, e)
            }             
            sleep.usleep(200);
        } finally {
            sleep.usleep(800);
            i++;
            doCrawler();
        }
    },
    (typeof(send.post) == 'string')? send.post : qs.stringify(send.post),
    send.header
    );
};

doCrawler();