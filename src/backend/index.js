import { meta } from 'eslint-plugin-react-hooks';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { checkEnvironment } from '../../utils.js';

checkEnvironment();

const app = express();
const port = 3000;
const openai = new OpenAI({
    apiKey: process.env.AI_KEY,
    baseURL: process.env.AI_URL,
});

app.use(cors()); 

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/translate', (req, res) => {
    res.send({status: 200, message: 'This is the first call'});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});