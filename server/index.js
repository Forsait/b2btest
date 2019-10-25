const process = require('process');
const path = require('path');
const request = require('request');
const express = require('express');
const app = express();

const port = process.env.port || 3000;
const apiKey = '8d79a0b9';

app.use(express.static(path.join(process.cwd(), 'dist/b2btest')));

app.get('/omdbapi', (req, resp) => {

  const obj = req.query;
  const queries = [];
  for(let key in obj){
    queries.push(key + '=' + obj[key]);
  }

  const url = `http://www.omdbapi.com/?${queries.join('&')}&apikey=${apiKey}`;
  request({url}, (error, response, body) => {
    if(error) console.log(error);
    else resp.send(body);
  });
});

app.get('*', (req, resp) => {
  const options = {
    root: path.join(process.cwd(), 'dist/b2btest'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  resp.sendFile('index.html', options, function (err) {
    if (err) {
      console.log(err)
    }
  })
});

app.listen(port, () => {
  console.log('The magic happens on port', port)
});