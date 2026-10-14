//Data array
// let defaultData = [
//   {
//     name: "Me",
//     message: "This is my first message"
//   },
//   {
//     name: "You",
//     message: "Hello hello!"
//   },
//   {
//     name: "Craig",
//     message: "Me me me"
//   }
// ];

//Set up the server
import express from 'express';
let app = express();

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const defaultData = { messages: [] };
const adapter = new JSONFile('db.json');
const db = new Low(adapter, defaultData);


//Serve static files from a public folder
app.use(express.static('public'));

app.use(express.json());

//Set port variable to listen for requests
let port = 3000;
app.listen(port, () => {
  console.log('Server listening on localhost:', port);
});

/*ROUTES */
//A route to serve the data
app.get('/messages', (request, response) => {
  //Send data as an object
  //response.json(defaultData);

  db.read()
    .then(() => {
      //save the messages to an object
      let theData = { messages: db.data.messages };
      //send the messages to the client
      response.json(theData);
    });

});

//A route to listen for data
app.post('/newMessage', (request, response) => {
  console.log(request.body);

  let newMessage = request.body;
  newMessage.time = Date();
  console.log(newMessage);

  // defaultData.push(newMessage);

  db.data.messages.push(newMessage)
  db.write()
    .then(() => {
      //send message back to the client
      response.json({ 'msg': 'Success' });
    });
});
