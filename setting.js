exports.option =  {
	hostname : "www.mervynw.info",
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
		console.log('fail');

	},
	test : [
		{
			desc : "index",
			path : "/",
			opt : {},
			preActionFunc : function(thisTest, global, send){ 


			},
			post : { },
			postActionFunc : function(thisTest, global, send){
				global.cart = 'aaa';
				console.dir(global);
			},
			unitTestFunc : function($, send, thisTest, res, raw){
				//console.log($)
				return true;
			}
		},
		{
			desc : "index",
			path : "/",
			opt : {},
			preActionFunc : function(thisTest, global, send){
				send.post = {"member_id" : global.cart}

			},
			post : {},
			postActionFunc : function(thisTest, global, send){},
			unitTestFunc : function($, send, thisTest, res, raw){
				console.log(send)

			}
		},
		{
			desc : "post as string",
			path : "/",
			opt : {},
			preActionFunc : function(thisTest, global, send){},
			post : "a=a&b=b",
			postActionFunc : function(thisTest, global, send){
				send.post = thisTest.post;

			},
			unitTestFunc : function($, send, thisTest, res, raw){
				console.log(send)

			}
		},

		"break",

		{
			desc : "should not show",
			path : "/",
			opt : {},
			preActionFunc : function(thisTest, global, send){},
			post : {},
			postActionFunc : function(thisTest, global, send){},
			unitTestFunc : function($, send, thisTest, res, raw){
				console.log(send)

			}
		},		

	]

};