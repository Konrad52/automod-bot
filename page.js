var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send(
    `<!DOCTYPE html>
    <html lang="hu">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Automoderátor</title>
    </head>
    <body>
        <button href="https://discord.com/api/oauth2/authorize?client_id=735059927688675339&permissions=470080&scope=bot">Meghívás a szerverre...</button>
    </body>
    </html>`
  );
});

app.listen(process.env.PORT);