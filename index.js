const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

const app = express();
app.use(express.json());
app.use(cookieParser());


const options_mongoDb = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

require('dotenv').config();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);

mongoose.connect(process.env.DB_URL, options_mongoDb, ()=>{

        console.log("Successfully connected to database");
    
});


app.listen(process.env.PORT, ()=>{
    console.log(`server started at port ${process.env.PORT}`);
});