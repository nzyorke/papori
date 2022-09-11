// Setting up our dependencies
const express = require("express");
const app = express();
const port = 3400;
const cors = require("cors");
// passes information from the frontend to the backend
const bodyParser = require("body-parser");
// This is our middleware for talking to mongoDB
const mongoose = require("mongoose");
// bcrypt for encrypting data (passwrords)
const bcrypt = require("bcryptjs");
// grab our config file
const config = require("./config.json");
console.log(config);

// Schemas
// every schema needs a capital letter
const Product = require("./models/product.js");
const User = require("./models/user.js");
const Comment = require("./models/comment.js");

// start our dependencies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Start our server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// let's connect to mongoDB
mongoose
  .connect(
    `mongodb+srv://${config.username}:${config.password}@cluster0.xgykp3b.mongodb.net/?retryWrites=true&w=majority`
    // .then is a chaining method used with promises
    // in simple terms, it will run something depending on the function before it
  )
  .then(() => {
    console.log(`You've connected to MongoDB!`);
    // .catch is a method to catch any errors that might happen in a promise
  })
  .catch((err) => {
    console.log(`DB connection error ${err.message}`);
  });

// =================================
//            GET METHOD
// =================================

// here we are setting up the /allProduct route
app.get("/allProduct", (req, res) => {
  // .then is method in which we can chain functions on
  // chaining means that once something has run, then we can
  // run another thing
  // the result variable is being returned by the .find() then we ran earlier
  Product.find().then((result) => {
    // send back the result of the search to whoever asked for it
    // send back the result to the front end. I.E the go the button
    res.send(result);
  });
});

// =================================
//        UPDATE/EDIT METHOD
// =================================
app.patch("/updateProduct/:id", (req, res) => {
  const idParam = req.params.id;
  Product.findById(idParam, (err, product) => {
    const updatedProduct = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      img_url: req.body.img_url,
    };
    Product.updateOne(
      {
        _id: idParam,
      },
      updatedProduct
    )
      .then((result) => {
        res.send(result);
      })
      .catch((err) => res.send(err));
  });
});

//editing product via bootstrap madal
//the :id is a special syntax that can grab the id from a variable in the frontend
app.get("/product/:id", (req, res) => {
  const productId = req.params.id;
  console.log(productId);
  Product.findById(productId, (err, product) => {
    if (err) {
      console.log(err);
    } else {
      res.send(product);
    }
  });
});

// =================================
//           DELETE METHOD
// =================================

// set up the delete route
// This route will only be actived if someone goes to it
// you can go to it using AJAX
app.delete("/deleteProduct/:id", (req, res) => {
  // the request varible here (req) contains the ID, and you can access it using req.param.id
  const productId = req.params.id;
  console.log("The following product was deleted:");
  console.log(productId);
  // findById() looks up a piece of data based on the id aurgument which we give it first
  // we're giving it the product ID vairible
  //  if it successful it will run a function
  // then function will provide us the details on that project or an error if it doesn't work
  Product.findById(productId, (err, product) => {
    if (err) {
      console.log(err);
    } else {
      console.log(product);
      Product.deleteOne({ _id: productId })
        .then(() => {
          console.log("Success! Actually deleted from mongoDB");
          // res.send will end the process
          res.send(product);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

// =================================
//        ADD PRODUCT METHOD
// =================================

// set up a route/endpoint which the frontend will access
// app.post will send data to the database
app.post(`/addProduct`, (req, res) => {
  // create a new instance of the product schema
  const newProduct = new Product({
    // give our new product the details we sent from the frontend
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    img_url: req.body.img_url,
    createdby: req.body.createdby,
    productowner: req.body.productowner,
  });
  // to save the new product to the database
  // use the variable declared above
  newProduct
    .save()
    .then((result) => {
        
      console.log(`Added a new product successfully!`);
      // return back to the frontend what just happened
      res.send(result);
      console.log(newProduct.productowner);
      
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
    });
});

// =================================
//        REGISTERING USERS
// =================================
app.post("/registerUser", (req, res) => {
  // Checking if user is in the DB already

  User.findOne({ username: req.body.username }, (err, userResult) => {
    if (userResult) {
      // send back a string so we can validate the user
      res.send("username exists");
    } else {
      const hash = bcrypt.hashSync(req.body.password); // Encrypt User Password
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: hash,
        profile_img_url: req.body.profile_img_url,
      });

      user
        .save()
        .then((result) => {
          // Save to database and notify userResult
          res.send(result);
        })
        .catch((err) => res.send(err));
    } // Else
  });
}); // End of Registering a User

// =================================
//        LOGIN IN METHOD
// =================================
app.post("/loginUser", (req, res) => {
  // firstly look for a user with that username
  User.findOne({ username: req.body.username }, (err, userResult) => {
    if (userResult) {
      if (bcrypt.compareSync(req.body.password, userResult.password)) {
        res.send(userResult);
      } else {
        res.send("not authorised");
      } // inner if
    } else {
      res.send("user not found");
    } // outer if
  }); // Find one ends
}); // end of post login

// =================================
//        ADD COMMENT METHOD
// =================================

app.post("/postComment", (req, res) => {
  const newComment = new Comment({
    _id: new mongoose.Types.ObjectId(),
    text: req.body.text,
    product_id: req.body.product_id,
  });
  // save (or post) this comment to the MongoDB
  newComment.save().then((result) => {
    Product.findByIdAndUpdate(
      // first parameter is the id of the coffee you want to find
      newComment.product_id,
      { $push: { comments: newComment } }
    )
      .then((result) => {
        res.send(newComment);
      })
      .catch((error) => {
        res.send(error);
      });
  });
});
