const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new aws.S3({accessKeyId: "AKIAJE7JRX4322DE4YEA", secretAccessKey : "9DdcJ3zUcFLNlCe3US2NTH0t2BFcFj6S4N6xWfZ9"});

const faker = require('faker');

const checkJWT = require('../middlewares/check-jwt');
const upload = multer ({
    storage: multerS3({
        s3: s3,
        bucket: 'amazonwebapp',
        metdata: function(req,file,cb){
            cb(null,{fieldName: file.fieldName});
        },
        key : function(req,file,cb){
            cb(null,Date.now().toString());
        }
    })
}); 

router.route('/products')
.get(checkJWT , function(req,res,next){
    Product.find({owner: req.decoded.user._id})
    .populate('owner')
    .populate('category')
    .exec(function(err, products ){
        if(products) 
        {
           res.json({
               success : true,
               message : "Products",
               products: products 
           });
        }
    });
})
.post([checkJWT , upload.single('product_picture')],function(req,res,next){
    console.log(upload);
    console.log(req.file);

    var product = new Product(); 

    product.owner = req.decoded.user._id;
    product.category = req.body.categoryId;
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.image = req.file.location;
    
    product.save();

    res.json({
        success: true,
        message: 'Successfully Added the product'
    });
});

/*Just for testing */
router.get('/faker/test',function(req,res,next){
    for(i=0;i<20;i++)
    {
        var product = new Product();
        product.category = "5afaf06b036fd619a41e158a";
        product.owner = "5b1620e28874a040601dfb83";
        product.image = faker.image.cats();
        product.title = faker.commerce.productName();
        product.description = faker.lorem.words();
        product.price = faker.commerce.price();
        product.save();
    } 
    res.json({
        message: "Successfully added 20 pictures"
    });
});
module.exports = router;