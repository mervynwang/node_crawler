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
		console.dir(send);

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
			post : {member_id: 1,  member_token : 'aa'},
			postActionFunc : function(thisTest, global, send){
				global.cart = 'aaa';
				global.member_token = 'token';
				global.member_id = "6666";
				console.dir(global);
			},
			unitTestFunc : function($, send, thisTest, res, raw){
				return true;
			}
		},
		{
			desc : "index",
			path : "/",
			opt : {},
			post : {member_id : ''},
			postActionFunc : function(thisTest, global, send){},
			unitTestFunc : function($, send, thisTest, res, raw){
				//console.log(send)
				return true;

			}
		},
		{
			desc : "post as string",
			path : "/",
			opt : {},
			preActionFunc : null,
			post : "a=a&member_token=b",
			postActionFunc : function(thisTest, global, send){
				send.post = thisTest.post;

			},
			unitTestFunc : function($, send, thisTest, res, raw){
				//console.log(send)
				return true;
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