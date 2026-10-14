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

//A route to make a request to an external api - uses fetch()
app.get('/special-data', (request, response) => {
  console.log("A request to the special data route");

  const api_URL = 'https://api.adviceslip.com/advice';
  fetch(api_URL)
    .then(api_response => api_response.json())
    .then(api_data => {
      console.log(api_data);
      response.json(api_data);
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: "Failed to fetch data from external API" });
    });
});

//A route to make a request to an external api - use fetch with async-await syntax
app.get('/special-data-alt', async (request,response) => {
  console.log("A request to the special data route");
  try {
    const api_URL = 'https://api.adviceslip.com/advice';
    const api_response = await fetch(api_URL);
    const data_response = await api_response.json();
    response.json(data_response);
  }
  catch (error){
    response.status(500).json({error: "not working"});
  }
});