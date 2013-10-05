
//require
var http = require('client-http'), 
url = require('url'), 
qs = require('querystring'), 
fs = require('fs'), 
sleep = require('sleep'),
cheerio = require('cheerio'),
async = require('async'),
config = require('./setting.js');

var nu = 0, opt = config.option, total = opt.test.length, seq = [1, 100]
, mem = true, argv = false;
if(mem) var util = require('util');

process.argv.forEach(function (v, i, array) {
    if(i > 1) { 
        argv = true;
        seq.push(v);
    }
});

if(argv) {
    var run = [];
    for(var i in opt.test){
        var p = opt.test[i].no, thisOne = false;
        for(var j in seq){
            if(p == seq[j]) {
                thisOne = true
                break;
            }
        }
        
        if(thisOne) run.push(opt.test[i]);
    }
    opt.test = run;
    total = opt.test.length
}

// run 
async.whilst(
    function () { return nu < total; },
    function (callback) {
        doCrawler();
        
        // 太快會錯亂
        var sleepMsec = (opt.test[nu] && opt.test[nu].opt && opt.test[nu].opt.sleep) || 600;
        setTimeout(callback, sleepMsec);
    },
    function (err) {}
);


// main 
function doCrawler(){
    var isFunc = function(name){
        return (typeof(name) == 'function');
    };

    // mark event
    if( (!opt.test[nu]) || (opt.test[nu] == 'break')) {
        console.log("\n\n ******* break ******* ");
        nu = total + 1 ;
        return;
    }
    
    if(opt.test[nu].desc == 'demo'){nu++;return;};
    // mark event end 

    var unit = opt.test[nu], 
    turl = ((unit.opt && unit.opt.https && false)? 'https://' : 'http://') + opt.hostname + unit.path,
    send = {post : {}, cookies : {}, header : null};
    
    // pass check
    if( !argv && (unit.opt && unit.opt.pass)) {nu++;return;};

    if(isFunc(unit.preActionFunc)) {
        unit.preActionFunc(opt.global, send)
    } else if(typeof(unit.post) == 'string') {
        send.post = unit.post;
        for(var i in opt.global){
            var reg = new RegExp(i+'=');
            send.post = send.post.replace(reg, "$&"+ opt.global[i]);
        }
    } else if (typeof(unit.post) == 'object'){
        for(var i in unit.post){
            send.post[i] = opt.global[i] || unit.post[i] || '';
        }
    }
    
    //console.log(" now:: "  + nu);
    if(mem) console.log("\n\n"+util.inspect(process.memoryUsage()));
    http.request(turl, function(data, n, cookie, header, res) {
        console.log("\n======== " + unit.no + ". " + unit.desc + " ==========");
        try{
            if(res.statusCode != 200) {
                if(isFunc(opt.completeFail)) {
                    console.log('statusCode');
                    opt.completeFail(data, send, unit, res)
                } else {
                    throw Expection("request error : ", res.statusCode)
                }
            }

            var dd = (header["content-type"].indexOf('json') != -1)? JSON.parse(data) : 
            (( res.headers["content-type"].indexOf('html') != -1)? cheerio.load(data) : data );

            if(isFunc(unit.postActionFunc)) {
                unit.postActionFunc(dd, opt.global, data, res, send);
            }            
            
            if((isFunc(unit.unitTestFunc)) ) {
                if(unit.unitTestFunc(dd, send, unit, res, data)) {
                    if(isFunc(opt.completeSuccess)) opt.completeSuccess(dd, send, unit, res, data);
                } else {
                    if(isFunc(opt.completeFail)) opt.completeFail(data, send, unit, res, e, dd);
                }
            } else {
                if(isFunc(opt.completeSuccess)) {
                    opt.completeSuccess(dd, send, unit, res, data);
                }
            }

            console.log("doCrawler completed!");
        } catch (e) {
            if(isFunc(opt.completeFail)) {
                opt.completeFail(data, send, unit, res, e, dd)
            }             
        } finally {
            nu++;
            return;
        }
    },
    (typeof(send.post) == 'string')? send.post : qs.stringify(send.post),
    send.header
    );
};