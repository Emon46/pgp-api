var express = require('express');
var bodyParser = require('body-parser');
var sendingEthereum = require('./sending.js');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine','ejs');
app.use('/assets',express.static('assets'))

app.post('/send_ether', urlencodedParser, function (req, res) {
    console.log(req.body);
    res.send(sendingEthereum(req.body.to_address,req.body.amount));

})

app.get('/',function(req,res){
  res.render('send_ether'  );
});


app.listen(3000);
