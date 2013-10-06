
exports.option =  {
	hostname : "mervyn.gracegiftsta.hiiir.com",
	global : {
		member_id : 0,
		member_token : "",
		order_id : "",
		suborder_id : "",
		cart : ""
	},
	completeSuccess : function(respond, send, uri, res, raw){
        console.log('completeSuccess');
	},
	completeFail : function(respond, send, uri, res, excption){
        console.log(excption);
        console.log('fail');
	},
	test : [
 		{
			no:0,
			desc : "demo",
			path : "/member/login",
            
            /**
             * opt https:(boolean), pass:(boolena), hostname:(string)
             */
			opt : {
                https : 1,
                pass : 1,
                hostname : 'tw.yahoo.com'
            },
            
            /**
             * this function can be function or NULL
             *
             * change post/cookie/header before http request, 
             *
             * @param object global     this.global;
             * @param object send       {post, cookie, header}
             */
			preActionFunc : function(global, send){},
            
            /**
             * the data will send as http post, null | object | string
             * ex. {"account":"wang@hiiir.com","password":"1234"}
             * ex. account=wang@hiiir.com&password=1234
             */
			post : {},
            
            /**
             * this function can be function or NULL
             * 
             * After receive http respond, you can process data for next request;
             * 
             * @param object $          http respond json OR jquery like object 
             * @param object global     this
             * @param string raw        http respond string 
             * @param string res        http object (header, statusCode, ... ... )
             * @param object send       data send
             */
			postActionFunc : function($, global, raw, res, send){
				if($.status == "OK") {
                    global.member_token = $.token;
                    global.member_id = $.member.member_id;
                    global.cart = $.member.cart || '';
                }
			},
            
            /**
             *  this function can be function or NULL
             *
             * Final Check you resond and return true will call this.completeSuccess else 
             * this.completeFail 
             * 
             * @param object $          http respond json OR jquery like object 
             * @param object send       data send
             * @param string res        http object (header, statusCode, ... ... )
             * @param string raw        http respond string 
             *
             */
			unitTestFunc : function($, send, res, raw){
                return (($.status == 'OK') && $.token);
			}
		},
       
 
	]

};
