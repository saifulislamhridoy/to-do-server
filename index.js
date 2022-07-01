const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const completedTaskCollection = client.db('ToDoApp').collection('completed');

        app.post('/toDo',async(req,res)=>{
            const ToDo = req.body;
            const result = await ToDosCollection.insertOne(ToDo);
            res.send(result)
        });

        app.get('/toDo',async(req,res)=>{
            const query={}
            const toDos = await ToDosCollection.find(query).toArray()
            res.send(toDos)
        });

        app.put('/task/:id',async(req,res)=>{
            const id = req.params.id
            console.log(id);
            const name = req.body.name
            const filter={_id:ObjectId(id)}
            const task = await ToDosCollection.findOne(filter)
           
            const updateDoc ={
              $set:{
                name:name
              }
            }
            const result = await ToDosCollection.updateOne(filter,updateDoc)
            res.send(result)
          });

          app.post('/complete',async(req,res)=>{
            const task = req.body;
            const result = await completedTaskCollection.insertOne(task);
            res.send(result)
          });

          app.delete('/delete/:id',async(req,res)=>{
            const id = req.params.id 
            const result= await ToDosCollection.deleteOne({_id:ObjectId(id)})
            res.send(result)
          });

          app.get('/completed',async(req,res)=>{
            const query={}
            const result = await completedTaskCollection.find(query).toArray()
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