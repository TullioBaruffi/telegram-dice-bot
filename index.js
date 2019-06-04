const Telegraf = require('telegraf');
const bot = new Telegraf('626608018:AAFwv0aUb7kZklzZ0d0tDcvpGzz-tRE2ERA');
const port = process.env.PORT || 3000
const debug = false;
bot.start((message) => {
  console.log('started:', message.from.id)
  return message.reply('Daje co sti dadi!!');
});
bot.hears(/./, (message) => {
	const roll = message.message.text;
	console.log(roll);
	try{
		var match = roll.match(/(\d*)d(\d*)/);
		if(!match || match.length < 2)
		{
		  return message.reply("Si vabbè, ma pe chi m'hai preso?");
		}
		var number = parseInt(match[1], 10);
		var intensity = parseInt(match[2], 10);
		
		if(debug){
			console.log('match[0]: ' + match[1]);
			console.log('match[1]: ' + match[2]);
			console.log('number: ' + number);
			console.log('intensity: ' + intensity);
		}
		
		var result = 0;
		var min = 1;
		var max = Math.floor(intensity);
		
		for(var i = 0; i<number;i++){
			result += Math.floor(Math.random() * (max - min + 1)) + min;
			if(debug){
				console.log('min:' + min);
				console.log('max:' + max);
				console.log('result:' + result);
			}
		}
		
		return message.reply(result);
	}
	catch(err){
		console.log(err);
		return message.reply('Mica ho capito che hai detto??');
	}
});
bot.startPolling();