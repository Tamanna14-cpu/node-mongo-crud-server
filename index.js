const express = require('express')
var cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;


// middleware
app.use(cors())
app.use(express.json());


app.get('/', (req, res) => {
    res.send('running my CRUD server')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



const uri = "mongodb+srv://mydbuser1:U5c7ctHtWYLVeqF7@cluster0.y9cyf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("foodpanda");
        const usersCollection = database.collection("users");

        // get api
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })


        // post api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('got new user', req.body);
            console.log('added user', result);
            res.json(result);
        })


        // delete api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);

            console.log('deleting user id', result);
            res.json(result);
        })


        // update api
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            console.log('load user with id:', id);
            res.json(result)
        })


        // load single item by id
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            console.log('load user with id:', id);
            res.send(user)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

// user : mybduser1
// pass U5c7ctHtWYLVeqF7: 