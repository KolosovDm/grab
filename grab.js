 //server for proxy
 //запросить статитстику по населению в вики и отобразить на странице в виде графика
 
 //подключение пакетов
 var express = require('express');
 var ne = require('needle');
 var ch = require('cheerio');
 var app = express();
 
 app.use(express.static("public"));
 app.set('view engine', 'ejs');
 var dataAll = [];//массив хранящий данные для morris.js
 var data = []// массив для отправки клиенту для построения графиков

 
var URL = 'https://ru.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D1%81%D1%82%D1%80%D0%B0%D0%BD_%D0%BF%D0%BE_%D0%BD%D0%B0%D1%81%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8E' 
 app.get('/', function(req, res ){
	 res.render("index");
	 
		}
 )
	
//получение данных и рендер страниц с графиком
app.post('/', function(req, res){
		ne.get(URL, function(err, resp){
		if(err) throw err
		else{
			//console.log(res.statusCode);
			var DOM = ch.load(resp.body);
			var count, pop;
			DOM('#mw-content-text > div > table > tbody tr ').each(function(){		
				var count =  DOM(this).find('td .nowrap a').text();
				var pop = DOM(this).find('td:nth-child(3)').text();
				dataAll.push({label: count, value: pop });			
			});
			for(var i = 0; i<12; i++){
			data[i] = dataAll[i];
			
			}
			data.splice(0, 2);
			res.send(data);
		}})
			
				
		
	
})


var server = app.listen(4051, function(){
	console.log('listen port 4051...');
});