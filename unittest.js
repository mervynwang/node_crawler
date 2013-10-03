
//require
var http = require('client-http'), 
url = require('url'), 
qs = require('querystring'), 
fs = require('fs'), 
sleep = require('sleep'),
cheerio = require('cheerio'),
config = require('./setting.js');

var nu = 0, opt = config.option;

function doCrawler(){

    if( (!opt.test[nu]) || (opt.test[nu] == 'break')) {
        console.log("\n\n ******* break ******* ");
        return ;  
    } 

    var unit = opt.test[nu] , 
    turl = ((unit.opt.https || false)? 'https://' : 'http://') + opt.hostname,
    send = {post : {}, cookies : {}, header : null}; 

    if(typeof(unit.preActionFunc) == 'function') {
        unit.preActionFunc(unit, opt.global, send)
    } else if(typeof(unit.post) == 'string') {
        console.log(' ++++ string')
        send.post = unit.post;
        for(var i in opt.global){
            var reg = new RegExp(i+'=');
            send.post.replace(reg, '$1'+ opt.global[i]);
        }
    } else if (typeof(unit.post) == 'object'){
        console.log(' ++++ object')
        for(var i in unit.post){
            send.post[i] = opt.global[i] || unit.post[i] || '';
        }
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

            
            if((typeof(unit.unitTestFunc) == 'function') ) {

                if(unit.unitTestFunc(dd, send, unit, res, data)) {
                    if(typeof(opt.completeSuccess) == 'function') opt.completeSuccess(dd, send, unit, res, data);
                } else {
                    if(typeof(opt.completeFail) == 'function') opt.completeFail(dd, send, unit, res, data);
                }
            } else {
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
            nu++;
            doCrawler();
        }
    },
    (typeof(send.post) == 'string')? send.post : qs.stringify(send.post),
    send.header
    );
};

doCrawler();