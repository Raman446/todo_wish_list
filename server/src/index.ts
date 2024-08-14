import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { AuthUser } from './Routes/loginRoute';
import { AuthTask } from './Routes/taskRoute';


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const port = 8000;
const mongo_url = 'mongodb+srv://raman75way:75WT446@cluster0.3uxpqtx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongo_url)
    .then(() => console.log("Mongoose Connected :)"))
    .catch((err) => console.log(err))

app.listen(port , ()=>{
console.log(`Server is running at ${port} port....`)
})

app.use('/', AuthUser);
app.use('/todo', AuthTask);