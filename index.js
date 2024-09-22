const express = require('express');
const app = express();
const port = 5000;


const cors = require('cors');


// Configure CORS options


// Apply CORS middleware
app.use(cors({
    origin: ['http://localhost:5173','https://arafath-engenering-workshop.vercel.app'],
}));

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://arafathengeneringworkshop:3gSY8PbuRKKTZPIK@cluster0.v2f3c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let bannerCollection;

async function connectToDatabase() {
    try {
        // Connect the client to the server
        await client.connect();
        // Get the collection reference
        bannerCollection = client.db('Dukan').collection('banner_section');
        console.log("Successfully connected to MongoDB!");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
    }
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Route to get all banners
app.get('/banner', async (req, res) => {
    try {
        const result = await bannerCollection.find().toArray();
        res.send(result);
    } catch (err) {
        res.status(500).send("Error fetching banners");
    }
});

// Route to get a banner by code
app.get('/banner/:code', async (req, res) => {
    try {
        const cursor = req.params.code;
        const num = parseFloat(cursor);
        const result = await bannerCollection.findOne({ code: num });
        res.send(result);
    } catch (err) {
        res.status(500).send("Error fetching banner by code");
    }
});

// Ensure database connection before starting the server
connectToDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});

// Gracefully close the MongoDB connection when the app is stopped
process.on('SIGINT', async () => {
    await client.close();
    console.log('Disconnected from MongoDB');
    process.exit(0);
});
