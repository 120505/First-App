var express=require("express");
var app=express();
const port = 9800;
var mongo=require("mongodb");
var MongoClient=mongo.MongoClient;
var mongourl="mongodb://localhost:27017";
var cors=require("cors");
const bodyParser = require("body-parser");
let db;
let col_name="users";

//cors is cross origin resource sharing It is used because frontend is running on oneport number an dbackend is running on other port number so it is needed to communicate with each other.
app.use(cors());
//Encode Data while inserting
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


// Health check
app.get("/", (req, res)=>{
    res.status(200).send("Health Okay");
})


//all users: GET METHOD
app.get("/user",(req, res)=>{
    db.collection(col_name).find({isActive:true}).toArray((err, result)=>{    //getting only active users
        if (err) throw err;
        res.status(200).send(result);
    })
})

//query params
app.get('/users',(req,res) => {
    var query = req.query.city
    if(req.query.city){
        query={city:req.query.city,isActive:true}
    }else{
        query={isActive:true}
    }
    db.collection(col_name).find(query).toArray((err,result) => {
        if(err) throw err;
        res.status(200).send(result)
    })
})

//getUSer Details
//get
app.get('/users/:id',(req,res) => {
    var id = mongo.ObjectID(req.params.id)
    db.collection(col_name).find({_id:id,isActive:true}).toArray((err,result) => {
        if(err) throw err;
        res.status(200).send(result)
    })
})

//Insert users: POST METHOD
app.post('/addUser',(req,res) => {
    db.collection(col_name).insert(req.body,(err,result) => {
        if(err) throw err;
        res.status(200).send("Data Added")
    })
});

//update user
app.put('/updateUser',(req,res)=>{
    var id=mongo.ObjectID(req.body._id)
    db.collection(col_name).update(
        {_id:id},
        {
            $set:{
                name:req.body.name,
                city:req.body.city,
                phone:req.body.phone,
                role:req.body.role,
                isActive:true
            }

        },(err,result)=>{
            if (err) throw err;
            res.status(200).send("Data Updated");
        }
        
    )
})


//delete user: soft delete

app.put('/softdeleteUser',(req,res)=>{
    var id=mongo.ObjectID(req.body._id)
    db.collection(col_name).update(
        {_id:id},
        {
            $set:{
                isActive:false
            }

        },(err,result)=>{
            if (err) throw err;
            res.status(200).send("Data Deleted");
        }
        
    )
})

//reactive user
app.put('/activateUser',(req,res)=>{
    var id=mongo.ObjectID(req.body._id)
    db.collection(col_name).update(
        {_id:id},
        {
            $set:{
                isActive:true
            }

        },(err,result)=>{
            if (err) throw err;
            res.status(200).send("User activated");
        }
        
    )
})

//delete user
//hard delete
app.delete('/deleteUser',(req,res) => {
    var id = mongo.ObjectID(req.body._id)
    db.collection(col_name).remove({_id:id},(err,result)=>{
        if(err) throw err;
        res.status(200).send("Data Removed")
    })
})


//connection with mongodb
MongoClient.connect(mongourl,(err,connection) => {
    if(err) console.log(err);
    db = connection.db('first');
  
    app.listen(port,(err) => {
      if(err) throw err;
      console.log(`Server is running on port ${port}`)
    })
  
  })