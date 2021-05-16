let express=require("express");
let app=express();
let mongo=require("mongodb");
let db;
let MongoClient=mongo.MongoClient;
let bodyParser=require("body-parser");
let cors=require("cors");
const port=process.env.Port ||9900;
let mongourl="mongodb+srv://avika:avika@123@cluster0.8uqx7.mongodb.net/first?retryWrites=true&w=majority";


app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//health ok
app.get("/", (req,res)=>{
    res.status(200).send("Health okay!")
})

//city route
app.get('/city',(req,res) => {
    let sortcondition = {city_name:1};
    let limit =100
    if(req.query.sort && req.query.limit ){
      sortcondition = {city_name:Number(req.query.sort)};
      limit =Number(req.query.limit)
    }
    else if(req.query.sort){
      sortcondition = {city_name:Number(req.query.sort)}
    }else if(req.query.limit){
      limit =Number(req.query.limit)
    }
    db.collection('city').find().sort(sortcondition).limit(limit).toArray((err,result) => {
      if(err) throw err;
      res.send(result);
    })
   
});

//rest details whenn id is given
app.get("/rest/:id",(req,res)=>{
  var id= req.params.id;
  db.collection("restaurent").find({_id:id}).toArray((err,result)=>{
    if (err) throw err;
    res.send(result);
  })
})

//rest route
app.get("/rest",(req,res)=>{
  var condition={};
  let sortcondition = {cost:1};
  if(req.query.mealtype && req.query.sort){
    condition={"type.mealtype":req.query.mealtype};
    sortcondition={cost:Number(req.query.sort)};
  }


  //meal+cost
  if(req.query.mealtype && req.query.lcost && req.query.hcost){
    condition={$and:[{'type.mealtype':req.query.mealtype},{cost:{$lt:Number(req.query.lcost)}},{cost:{$gt:(Number(req.query.hcost))}}]}
  }

  //meal+city
  else if(req.query.mealtype && req.query.city){
    condition={$and:[{"type.mealtype":req.query.mealtype}, {city:req.query.city}]};
  }
  //meal+cuisine
  else if(req.query.mealtype && req.query.cuisine){
    condition={$and:[{"type.mealtype":req.query.mealtype},{"Cuisine.cuisine":req.query.cuisine}]};
  }

  //meal
  else if(req.query.mealtype){
    condition={"type.mealtype":req.query.mealtype};
  }
  //city
  else if(req.query.city){
    condition={city:req.query.city};
  }
  db.collection("restaurent").find().toArray((err,result)=>
  {
    if(err) throw err;
    res.send(result);

  })

})



//Mealtype route
app.get("/meal",(req,res)=>{
  db.collection("mealType").find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result);
  })
})

//cuisine route
app.get('/cuisine',(req,res)=>{
  db.collection("cuisine").find().toArray((err,result)=>{
    if (err) throw err;
    res.send(result);
  })
})

//placeorder
app.post('/placeorder',(req,res)=>{
  db.collection('orders').insert(req.body,(err,result) => {
    if(err) throw err;
    res.send('data added');
  })
})

//get all bookings
app.get('/orders',(req,res) => {
  db.collection('orders').find({}).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

//mongodb connection
MongoClient.connect(mongourl,(err,connection) => {
    if(err) console.log(err);
    db = connection.db('first');
  
    app.listen(port,(err) => {
      if(err) throw err;
      console.log(`Server is running on port ${port}`)
    })
  })