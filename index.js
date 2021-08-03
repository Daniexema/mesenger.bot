

const express = require('express');
const bodyParser = require('body-parser');

const app = express().use(bodyParser.json());


app.post('/webhook',(req,res)=>{
  console.log('POST: webhook');

  const body=req.body;

  if (body.object==='page') {
    body.entry.forEach(entry => {

      const webhookEvent=entry.messaging[0];
      console.log(webhookEvent);
    });

res.status(200).send('RECIBIDO');

  }else {
    res.sendStatus(404);
  }
});

app.get('/webhook',(req,res) =>{
  console.log('GET: webhook');

const VERIFY_TOKE='miToken123';

const mode = req.query['hub.mode'];
const token =req.query['hub.verify_token'];
const challenge =req.query['hub.challenge'];

if (mode && token) {
  if (mode==='subscribe' && token === VERIFY_TOKE) {
    console.log('VERFICADO WEBHOOK');
    res.status(200).send(challenge);
  }else {
    res.sendStatus(404);
  }
}else {
  res.sendStatus(404);
}

});

app.get('/',(req,res)=>{
  res.status(200).send(`<html>
      <head>
        <title>chat bot</title>
      </head>
      <body>
      <center>
        <h1>Messenger boot</h1>
        <p></p>
        <p></p>
        <p></p>
      </center>
      <ul>
        <li>
          <a href='webhook?hub.verify_token=miToken123&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe'> Connection Testing </a>
        </li>
      </ul>      
      </body>
     </html>`)
});

app.listen(8080,()=>{
  console.log('Servidor inciado...');
});
