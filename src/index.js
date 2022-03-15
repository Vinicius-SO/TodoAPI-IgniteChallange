const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// { 
// 	id: 'uuid', // precisa ser um uuid
// 	name: 'Danilo Vieira', 
// 	username: 'danilo', 
// 	todos: []
// }


function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const user = users.find(user => user.username === username)
  if(!user){
    return response.status(400).json({error: "User doesn't exist"})
  }

  request.user = user

  return next()

}

app.post('/users', (request, response) => {

  const {name, username} = request.body;

  const userAlreadyExist = users.some(user => user.name === name)

  if(userAlreadyExist){
    return response.status(400).json({eror: "That name already has an account!"})
  }
  // Complete aqui
  const user = {
    id: uuidv4(),
    name,
    username,
    todos:[]
  }

  users.push(user)

  return response.status(201).json(users)

});

app.get('/todos', checksExistsUserAccount, (request,response)=>{
  const { user } = request

  return response.json(user.todos)
})

module.exports = app;