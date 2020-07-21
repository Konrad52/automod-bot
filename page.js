var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.sendFile('pages/intex.html', {root: __dirname })
});

app.listen(process.env.PORT);