const Telegraf = require('telegraf');
const bot = new Telegraf('626608018:AAFwv0aUb7kZklzZ0d0tDcvpGzz-tRE2ERA');
const debug = false;

const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const http = require("http");
const XorShift = require('xorshift').constructor;
const MaxResultLength = 2000;

setInterval(function() {
    http.get("http://telegram-rolldice.herokuapp.com/cool");
}, 300000); // every 5 minutes (300000)
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

bot.start((message) => {
  console.log('started:', message.from.id)
  return message.reply('Daje co sti dadi!!');
});
bot.hears(/./, (message) => {
	const roll = message.message.text;
	console.log(roll);
	try{
		var match = roll.match(/(\d+)d(\d+)([+|-])?(\d+)?/);
		if(!match || match.length < 2)
		{
		  return message.reply("Si vabbè, ma pe chi m'hai preso?");
		}
		
		var number = parseInt(match[1], 10);
		var intensity = parseInt(match[2], 10);
		var sign = match[3];
		var mod = parseInt(match[4], 10);
		
		if(debug){
			console.log('match[1]: ' + match[1]);
			console.log('match[2]: ' + match[2]);
			console.log('match[3]: ' + match[3]);
			console.log('match[4]: ' + match[4]);
			console.log('number: ' + number);
			console.log('intensity: ' + intensity);
		}
		
		if(number > 10000){
			return message.reply("Te stai a allargà!");
		}
		
		var result = 0;
		var min = 1;
		var max = min + Math.floor(intensity);
		var splittedThrow = "";
		
		var rng = new XorShift([Math.floor(new Date().getMilliseconds() / 2), 0, new Date().getMilliseconds() * new Date().getMinutes(), 0]);
		
		for(var i = 0; i<number;i++){
			var rnd = rng.random();
			var diceResult = Math.floor(min + rnd * (max - min));
			
			if(splittedThrow.length < MaxResultLength){
				splittedThrow += diceResult + " + ";
			}
			
			result += diceResult;
			if(debug){
				console.log('xorshift.random:' + rnd);
				console.log('min:' + min);
				console.log('max:' + max);
				console.log('diceResult:' + diceResult);
			}
		}
		
		if(splittedThrow){
			splittedThrow = splittedThrow.substring(0, splittedThrow.length - 2);
		}		
		
		var displayResult = result;
		if(number > 1){
			if(splittedThrow.length >= MaxResultLength){
				splittedThrow = splittedThrow + "...";
			}
			displayResult = splittedThrow + "= " + result;
		}
		
		if(sign && mod){
			if(sign == '+'){
				result += mod; 
			}else{
				result -= mod;
			}
			displayResult += " " + sign + " " + mod + " = " + result;
		}
		
		return message.reply(displayResult);
	}
	catch(err){
		console.log(err);
		return message.reply('Mica ho capito che hai detto??');
	}
});
bot.launch();