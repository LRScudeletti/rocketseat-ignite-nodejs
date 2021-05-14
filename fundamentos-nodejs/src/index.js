import express, { request, response } from 'express';

const app = express();

app.use(express.json());

app.post('/courses', (request, response) => {
    const body = request.body;
    console.log(body);

    response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"])
});

app.get('/courses', (request, response) => {
    const query = request.query;
    console.log(query);

    response.json(["Curso 1", "Curso 2", "Curso 3"])
});

app.put('/courses/:id', (request, response) => {
    const { id } = request.params;
    console.log(id);

    response.json(["Curso One", "Curso 2", "Curso 3"])
});

app.patch('/courses/:id', (request, response) => {
    response.json(["Curso One", "Curso Two", "Curso 3"])
});

app.delete('/courses/:id', (request, response) => {
    response.json(["Curso One", "Curso Two"])
});

app.listen(3333, () => {
    console.log('Server started on port 3333.');
});