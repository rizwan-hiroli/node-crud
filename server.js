const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://rizwan:rizwan123@cluster0.0wpqp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())

MongoClient.connect(connectionString, {
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')
    
    //get all qoutes.
    app.get('/', (req, res) => {
        db.collection('quotes').find().toArray()
        .then(results => {
            res.render('index.ejs', { quotes: results })
        })
        .catch(error => console.error(error))
    })

    //create quote.
    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
          .then(result => {
            res.redirect('/')
          })
          .catch(error => console.error(error))
    })

    //update qoute.
    app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
            { name: 'new ' },
            {
                $set: {
                name: req.body.name,
                quote: req.body.quote
                }
            },
            {upsert: true}
        )
        .then(response => {
            res.redirect('/')
        })
        .catch(error => console.error(error))
    })
    
    //delete qoutes.
    app.delete('/quotes', (req, res) => {
        console.log(req.body);
        quotesCollection.deleteOne(
            { name: req.body.name }
          )
          .then(result => {
            if (result.deletedCount === 0) {
                return res.json('No quote to delete')
            }
            res.json(`Deleted Darth Vadar's quote`)
            // res.redirect('/')
          })
        .catch(error => console.error(error))
    })

})

app.listen(3000, function() {
    console.log('listening on 3000')
})

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }))
