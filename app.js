const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const trust_value = require('./trust_value_api.js');
const user_certificate_create = require('./create_certificate_api.js');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if(res.method === 'OPTIONS')
  {
    res.header("Access-Control-Allow-Methods",'PUT, PATCH, POST, DELETE, GET');
    return res.status(200).json({});
  }
  next();
})

app.use('/certificate',user_certificate_create);
app.use('/trust-value',trust_value);

app.use((req,res,next)=>{
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next)=>{
  res.status(error.status || 500);
  res.json({
    error : {
      message : error.message
    }
  });
});
module.exports = app;
