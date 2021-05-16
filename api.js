const { request } = require("express");
var express=require("express");
var app=express();
var mongo=require("mongodb");
var MongoClient=mongo.MongoClient;
const mongourl= "mongodb://localhost:27017";
const port="9900";
let db;
//first route(default)
app.get("/rest", (request,response)=>{
    db.collection('restaurent').find().toArray((err,result)=>{
        if (err) throw error;
        response.send(result);
    })
})
//secomd route
app.get("/city", (request,response)=>{
    db.collection('city').find().toArray((err,result)=>{
        if (err) throw error;
        response.send(result);

})
})
//third route
app.get("/meal", (request,response)=>{
    db.collection('mealType').find().toArray((err,result)=>{
        if (err) throw error;
        response.send(result);
    })
})

app.get("/cuisine", (request,response)=>{
    db.collection('cuisine').find().toArray((err,result)=>{
        if (err) throw error;
        response.send(result);

})
})
//Connection
MongoClient.connect(mongourl,(err,connection)=>{
    if (err) console.log(err);
    db=connection.db("first");
    app.listen(port,(err)=>{
        if(err) throw error;
        console.log(`Server is running on port ${port}`)
    })

})
