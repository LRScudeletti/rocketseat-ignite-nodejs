import express, { json, request, response } from 'express';

import { v4 as uuidv4 } from 'uuid';

const app = express();

app.use(json());

const customers = [];

app.post('/account', (request, response) => {
    const { cpf, name } = request.body;

    const customerAlreadyExists = customers.some(
        customer => customer.cpf === cpf);

    if (customerAlreadyExists) {
        response.status(400).send({ error: "Costumer already exists." });
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return response.status(201).send();
});

app.put('/account', verifyIfExistsAccountCPF, (request, response) => {
    const { name } = request.body;
    const { customer } = request;

    customer.name = name;

    return response.status(201).send();
});

app.get('/account', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;

    return response.json(customer);
});

app.delete('/account', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;

    customers.splice(customers.indexOf(customer), 1);

    return response.status(200).send();
});

app.post('/deposit', verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        createdate: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.post('/withdraw', verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body;

    const { customer } = request;

    const balance = getBalance(customer.statement);

    if (balance < amount) {
        return response.status(400).send({ message: "Insuficient funds." })
    }

    const statementOperation = {
        description,
        amount,
        createdate: new Date(),
        type: "debit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.get('/statement', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;

    return response.json(customer.statement);
});

app.get('/statement/date', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;

    const { date } = request.query;

    const dateFormat = new Date(date + " 00:00");

    const statement = customer.statement.filter(
        (statement) => statement.createdate.toDateString() === new Date(dateFormat).toDateString());

    return response.json(statement);
});

app.get('/balance', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;

    const balance = getBalance(customer.statement);

    return response.json(balance);
});

function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;

    const customer = customers.find(customer => customer.cpf = cpf);

    if (!customer) {
        return response.status(400).json({ message: "Customer not found." });
    }

    request.customer = customer;

    return next();
}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === "credit") {
            return acc + operation.amount
        } else {
            return acc - operation.amount
        }
    }, 0);

    return balance;
}

app.listen(3334, () => {
    console.log('Server started on port 3334.');
});