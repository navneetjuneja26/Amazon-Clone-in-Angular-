const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan'); 
const cors = require('cors');
const mongoose =  require('mongoose');
const config = require('./config');
const app = express();

mongoose.connect(config.database,function(err) {
    if(err)
   { console.log(err);
}
    else
  { console.log('Connected to database');
  }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cors()); 

const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const sellerRoutes = require('./routes/seller');

app.use('/api/accounts',userRoutes);
app.use('/api/',mainRoutes);
app.use('/api/seller',sellerRoutes);

app.listen(config.port,function(err){
    console.log('magic happens on port'+config.port);
});