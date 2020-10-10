const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 5000;

// create application/json parser
app.use(bodyParser.json());
app.use(cors());
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eobd6.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohn").collection("products");
    const ordersCollection = client.db("emaJohn").collection("orders");

    app.post('/addPorduct', (req, res) => {
        const products = req.body;
        productsCollection.insertMany(products)
        .then(result => {          
          console.log(result)            
        })
    })

    app.get('/products', (req, res) => {
      productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })
    app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    app.get('/product/:key', (req, res) => {
      productsCollection.find({key: req.params.key})
      .toArray((err, documents) => {
        res.send(documents[0])
      })
    })

    app.post('/productsByKeys', (req, res) => {
      const productsKeys = req.body;
      productsCollection.find({key: {$in: productsKeys}})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })

    app.post('/addOrders', (req, res) => {
      const order = req.body;
      ordersCollection.insertOne(order)
      .then(result => {          
          res.send(result.insertedCount > 0)       
      })
  })


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
  console.log(`App is listening...`)
})