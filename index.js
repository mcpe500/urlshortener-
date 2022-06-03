require('dotenv').config();
const express = require('express');
var bodyParser = require('body-parser');
const dns = require('dns')
const cors = require('cors');
const app = express();
const urlparser = require('url')
const open = require('open');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const mySecret = process.env['MONGO_URI']
// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const linksSchema = new mongoose.Schema({url: String});
const Links = mongoose.model("Links",linksSchema);
console.log(mongoose.connection.readyState)


app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/', function(req, res){
   res.render('form');
});

app.post('/api/test/', (req,res)=>{
  var urlTest = req.accepts()
  console.log(urlTest)
})
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({extended: false})


app.post('/api/shorturl/',urlencodedParser,function(req,res){
  const urlChecker = dns.lookup(urlparser.parse(req.body.url).hostname,(error,address)=>{
    if(!address){
      res.json({error: "Invalid URL"})
    } else {
      var url = new Links({url:req.body.url})
      url.save((err,data)=>{
        res.json({
          original_url: data.url,
          short_url: data.id
        })
      })
    }
  })
  console.log(req.body)

})

app.get('/api/shorturl/:id',(req,res)=>{
  const id = req.params.id
    Links.findById(id,(err,data)=>{
      if(!data){
        res.json({error: "Invalid URL"})
      }else{
        res.redirect(data.url)
      }
    })
  })

app.get('/api/shorturl', function(req, res) {
  var shorturl = req.body
  console.log(shorturl)
  res.links({  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
