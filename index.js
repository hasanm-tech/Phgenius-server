const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pmje8tj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const classCollection = client.db("photoDB").collection('classes');
    const allClassCollection = client.db("photoDB").collection('all-classes');

    
    // classes 
    app.get('/classes', async (req,res) => {
        const result = await classCollection.find().toArray()
        res.send(result)
    })

    app.get('/all-classes', async (req,res) => {
      const email = req.query.email;
        console.log({email})
        if(!email){
            res.send([])
        }
        const query = {email : email}
        const result = await allClassCollection.find(query).toArray()
        res.send(result)
    })
   

    app.post('/all-classes', async (req,res) => {
        const item = req.body;
        console.log(item)
        const result = await allClassCollection.insertOne(item)
        res.send(result)
    })


    app.delete('/all-classes/:id', async (req,res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allClassCollection.deleteOne(query)
      res.send(result)
  })








    


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('panda is running ')
})

app.listen(port, () => {
  console.log(`panda app listening on port ${port}`)
})