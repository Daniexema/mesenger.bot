

const express = require('express');
const bodyParser = require('body-parser');
//agregamos libreria para hacer solicitudes http
const request=require('request');

const app = express().use(bodyParser.json());


app.post('/webhook',(req,res)=>{
  console.log('POST: webhook');

  const body=req.body;

  if (body.object==='page') {
    body.entry.forEach(entry => {

      const webhookEvent=entry.messaging[0];
      console.log(webhookEvent);

        const sender_psid = webhookEvent.sender.id;

        console.log(`SENDER PSID ${sender_psid}`);

        if (webhookEvent.message) {
          handleMessage(sender_psid,webhookEvent.message);
        }else if(webhookEvent.postback){
          handlePostback(sender_psid,webhookEvent.postback);
        }

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

let max=0;
if (mode && token) {
  if (mode==='subscribe' && token === VERIFY_TOKE) {

    max=max+1
    console.log('Se identificó correctamente '+ max);
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

const port = process.env.PORT || 3000;

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Handles messages events
function handleMessage(sender_psid, received_message) {

    let response;
    if (received_message.text) {
        response = {
          'text':`Mensaje que enviaste ${received_message.text}``
        };
    }
    callSendAPI(sender_psid,response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {

const requestBody = {
  'recipient':{
    'id':sender_psid
  },
  'message':response
};

request({
  'uri':'https://graph.facebook.com/v2.6/me/messages',
  'qs':{ "access_token": process.env.PAGE_ACCESS_TOKEN },
  'method':'POST',
  'json': requestBody

},(err,res,body)=>{
  if (!err) {
    console.log('Mensaje devuelto satisfactorio');
  }else {
    console.log('imposible enviar el Mensaje');
  }
});
}





app.listen(port,()=>{
  console.log('Servidor inciado...');
});
