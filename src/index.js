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
    return response.status(404).json({error: "User doesn't exist"})
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

app.post('/todos',checksExistsUserAccount,(request,response)=>{
  
  const { title,deadline } = request.body
  const { user } = request

  const todo = {
    id:uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline + " 00:00"),
    created_at: new Date()
  }
  user.todos.push(todo)

  return response.status(201).json(todo)

})

app.put('/todos/:id', checksExistsUserAccount, (request,response)=>{
  const { title,deadline } = request.body
  const { id } = request.params

  const { user } = request
  
  const todoIndex = user.todos.findIndex(todo => todo.id === id)

  if(todoIndex === -1){
    return response.status(404).json({error: "That todo doens't exist!"})
  }
  
  const todoBody = {
    id,
    title,
    done:false,
    deadline: new Date(deadline + " 00:00"),
    created_at: user.todos[todoIndex].created_at
  }

  user.todos[todoIndex] = todoBody

  return response.json(users)

})

app.patch('/todos/:id/done', checksExistsUserAccount, (request,response)=>{
  const { user } = request
  const { id } = request.params

  const todo = user.todos.find(todo=> todo.id === id)

  if(!todo){
    return response.status(404).json({error: "That todo doens't exist!"})
  }

  todo.done = true

  return response.status(201).send()
})

app.delete('/todos/:id/',checksExistsUserAccount, (request,response)=>{
  
  const {user} = request
  const { id } = request.params

  const todo = user.todos.findIndex(todo=> todo.id === id)

  if(todo === -1){
    return response.status(404).json({error: "That todo doens't exist!"})
  }

  user.todos.splice(todo, 1)

  return response.json(user)
})

module.exports = app;