const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');


const app = express();

const options_mongoDb = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/api/user', userRouter);
app.use('/api/post',postRouter);

mongoose.connect(process.env.DB_URL, options_mongoDb, ()=>{

        console.log("Successfully connected to database");
    
});


app.listen(process.env.PORT, ()=>{
    console.log(`server started at port ${process.env.PORT}`);
});