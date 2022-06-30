const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// midleware
 app.use(cors());
 app.use(express.json())

 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ube39.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect()
        const ToDosCollection = client.db('ToDoApp').collection('ToDos');

        app.post('/toDo',async(req,res)=>{
            const ToDo = req.body;
            const result = await ToDosCollection.insertOne(ToDo);
            res.send(result)
        });

    }
    finally{

    }

}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('Hello')
});
app.listen(port,()=>{
    console.log('Listening on port',port)
})