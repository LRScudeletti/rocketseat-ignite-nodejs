import express, { json } from 'express';
import cors from 'cors';

import { v4 as uuidv4 } from 'uuid';

const app = express();

app.use(cors());
app.use(json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { id } = request.headers;

  const user = users.find(user => user.id = id);

  if (!user) {
    return response.status(400).json({ message: "User not found." });
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userlreadyExists = users.some(
    user => user.id === id);

  if (userlreadyExists) {
    response.status(400).send({ error: "User already exists." });
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  });

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline,
    created_at = new Date(),
  }

  user.todos.push(todo);

  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const { id } = request.query;

  const todo = user.todos.filter(user => user.todo.id === id);

  return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { done } = request.body;
  const { user } = request;

  user.done = done;

  return response.status(201).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  users.splice(users.indexOf(user), 1);

  return response.status(200).send();
});

export default app;