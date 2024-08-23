let express=require('express')
let bodyparser=require('body-parser')
const fast2sms = require('fast-two-sms')
let app=express();
let fs=require('fs')
let cors=require('cors')
let nodemon=require('nodemon')
const session = require('express-session');
const passport = require('passport');
let multer=require('multer')
var jwt = require('jsonwebtoken');

const accountSid = 'ACca5ed9f8c0738894507f19fdabb857ac';
const authToken = '155c367812d3af109edf3a8914cd3aaa';
const clients = require('twilio')(accountSid, authToken);
const GoogleStrategy = require('passport-google-oauth20').Strategy;
app.use(cors('*'))
let checkotp;
let database;
let collection;
let usercollection;
let secret="jwrgejrhgkjhgh7565454354357vcbvhkfhgfv765655375"
// app.use(express.json({ limit: '1gb' }));
app.use(bodyparser.json({ limit: '600mb' })); // Increase the limit as needed
app.use(bodyparser.urlencoded({ limit: '600mb', extended: true }));
const { MongoClient, ServerApiVersion } = require('mongodb');


// app.use(express.urlencoded({ extended: true, parameterLimit: 10000 }))
var uri="mongodb+srv://sarath:mongodb@sarath.pwemxqm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const ds=multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null,"uploads/")
  },
  filename:(req,file,cb)=>{

      cb(null,Date.now()+file.originalname)

  }
});

const upload =multer({
  storage:ds
});//test
//uijytkmjhjre
async function sara(){
  let dbs= await client.connect()
 database=client.db("freshmenu")
 collection =database.collection('category')
 usercollection=database.collection('user')
}

sara();


app.post('/sendcategory',upload.single('hjk'),async(req,res)=>{
 
  let readfile=fs.readFileSync(req.file.path)
  let binary=Buffer.from(readfile)//making binary data from image
  let d=JSON.parse(req.body.data)
  let k=await collection.findOne({category:d.categoryname})
  
  if(k){
   let p=await collection.updateOne({category:d.categoryname},{$push:{items:{itemname:d.itemname,price:d.price,image:binary,type:d.type,quantity:0,totalprice:d.price,details:d.details,ingriedents:d.ingriedents}}})
  }
   
  else{
    let res=await collection.insertOne({category:d.categoryname,items: [{ itemname: d.itemname, price: d.price,image:binary,type:d.type,quantity:0,totalprice:d.price,details:d.details,ingriedents:d.ingriedents}]})
  }

})

app.get('/getitemlistofuser',async(req,res)=>{
  console.log(req.headers,"from getitem listby user")
  let token =req.headers.authorization
  let idproof;
  jwt.verify(token,secret,(err,decoded)=>{
   if(err){
     console.log(err)
   }
   else{
     idproof=decoded.mobi
   }
  })
  let p= await usercollection.findOne({mobile:idproof})
  console.log(p)
   res.json({data:p.carts})
})


app.post('/register',async(req,res)=>{
  console.log(req.body)
  let pk= await usercollection.findOne({mobile:req.body.no})
  console.log(pk)

    if(pk!=null){
      res.json({message:"user already exists"})
    }
    else{
   let p= await usercollection.insertOne({firstname:req.body.fname,lastname:req.body.lname,mobile:req.body.no,email:req.body.email,password:req.body.password})
     res.json({message:"user successfully added"})
    }
})

app.post('/login',async(req,res)=>{

    console.log(req.body.no);
     let mobile=Number(req.body.no)
    console.log(mobile)
    const apiKey = 'GgP9jp4Ysa23nvWScNlxbzIMTAufEiOJyLh1ZoHUQ0rwV7dmR6RsAkfjl15qrOHcigPUtdSn4LoIEY2m';// Replace with your Fast2SMS API key

    const otp = Math.floor(100000 + Math.random() * 900000);
    checkotp=otp

    let pk= await usercollection.findOne({mobile:req.body.no})
   
    if(pk==null){ //empty
     res.json({message:"invalid mobile no :please register" ,show:"dontshow"})
     }

     else if(pk!=null){
     const response = await fast2sms.sendMessage({
      authorization: 'GgP9jp4Ysa23nvWScNlxbzIMTAufEiOJyLh1ZoHUQ0rwV7dmR6RsAkfjl15qrOHcigPUtdSn4LoIEY2m',
      sender_id:'LKHMDS'  ,      // Your Fast2SMS API key
      message: `Your OTP code is ${otp}`, // OTP message content
      numbers: [mobile]          // Recipient phone number as an array
     });
     res.json({message:"otp sent succufully"})
     }
  
  // console.log(req.body)
  // let pk= await usercollection.findOne({mobile:req.body.no})
   
  // if(pk==null){ //empty
  //   res.json({message:"invalid mobile no :please register"})
  // }
  // else if(pk!=null){ // not empty
  //   if(pk.password==req.body.password){
  //     jwt.sign({mobi:req.body.no},secret,{expiresIn:'5d'},(err,signedtoken)=>{
  //       if(err){
  //         console.log(err)
  //       }
  //       else{
  //         let s=true;
  //         res.json({message:"successfullly verified",k:s,token:signedtoken})
  //       }
  //     })
  //   }
  //   else{
  //     res.json({message:'invalid password '})
  //   }
  // }
  

})

app.post('/verifyotp',async(req,res)=>{

  console.log(req.body)

  let pk= await usercollection.findOne({mobile:req.body.mobile})

  if(pk==null){ //empty
    res.json({message:"invalid mobile no :please register"})
    // let jk= await usercollection.insertOne({mobile:req.body.mobile})
  }
  else if(pk!=null){ // not empty

    if(checkotp==req.body.otp){

      jwt.sign({mobi:req.body.mobile,username:req.body.k},secret,{expiresIn:'5d'},(err,signedtoken)=>{
        if(err){
          console.log(err)
        }
        else{
          let s=true;
          res.json({message:"successfully verified",k:s,token:signedtoken})
        }
      })

    }
    else{
      res.json({message:"invalid otp"})
    }

  }
})


app.post('/addtocart',async(req,res)=>{
  // console.log(req.body.item,"from cart")
  let idproof;
  console.log(req.headers)
  let token =req.headers.authorization
  console.log(req.body,"from add to cart")
  jwt.verify(token,secret,(err,decoded)=>{
   if(err){
     console.log(err)
   }
   else{
     idproof=decoded.mobi
   }
  })
 
 let p= await usercollection.updateOne({mobile:idproof},{$push:{ carts: req.body.item } })

})

app.post('/incfromproduct',async(req,res)=>{
  console.log(req.body,"from product")
  console.log(req.body.cat.categ)
  // let p=  await usercollection.updateOne({"category":req.body.cat.categ,"items.itemname":req.body.y.itemname},{$set:{"items.$.quantity":req.body.y.quantity}})
  let idproof;
  console.log(req.headers)
  let token =req.headers.authorization
 
  jwt.verify(token,secret,(err,decoded)=>{
   if(err){
     console.log(err)
   }
   else{
     idproof=decoded.mobi
   }
  })
 
  let p=  await usercollection.updateOne({mobile:idproof,"carts.itemname":req.body.y.itemname},{$set:{"carts.$.quantity":req.body.y.quantity,"carts.$.totalprice": req.body.y.quantity* req.body.y.price}})

})

app.post('/descfromproduct',async(req,res)=>{
  console.log(req.body.cat.categ)

  let idproof;
  console.log(req.headers)
  let token =req.headers.authorization
 
  jwt.verify(token,secret,(err,decoded)=>{
   if(err){
     console.log(err)
   }
   else{
     idproof=decoded.mobi
   }
  })

  let p=  await usercollection.updateOne({mobile:idproof,"carts.itemname":req.body.y.itemname},{$set:{"carts.$.quantity":req.body.y.quantity,"carts.$.totalprice": req.body.y.quantity* req.body.y.price}})

})

app.post('/incfromhome',async(req,res)=>{
  let idproof;
 console.log(req.body)
 let token =req.headers.authorization

 jwt.verify(token,secret,(err,decoded)=>{
  if(err){
    console.log(err)
  }
  else{
    idproof=decoded.mobi
  }
 })

 let p= await usercollection.updateOne({mobile:idproof,"carts.itemname":req.body.payload.l.itemname},{$set:{"carts.$.quantity": req.body.payload.l.quantity ,"carts.$.totalprice": req.body.payload.l.quantity* req.body.payload.l.price} })


})

app.post('/descfromhome',async(req,res)=>{
  let idproof;
  console.log(req.body.f.quantity)
 // let p= await collection.findOneAndUpdate({"category":req.body.cat.categ,"items.itemname":req.body.f.itemname},{$set:{"items.$.quantity":req.body.f.quantity}})
 //  if(req.body.f.quantity==0){
 //  let p= await usercollection.updateOne({user:24}, { $pull: { carts: {quantity: 0 } } } )

 //  }
 let token =req.headers.authorization

 jwt.verify(token,secret,(err,decoded)=>{
  if(err){
    console.log(err)
  }
  else{
    idproof=decoded.mobi
  }
 })



 let p= await usercollection.updateOne({mobile:idproof,"carts.itemname":req.body.f.itemname},{$set:{"carts.$.quantity": req.body.f.quantity ,"carts.$.totalprice": req.body.f.quantity* req.body.f.price} })
   if(req.body.f.quantity==0){
    let p= await usercollection.updateOne({mobile:idproof}, { $pull: { carts: {quantity: 0 } } } )
 
    }

})

app.post('/incfromside',async(req,res)=>{
  console.log(req.body,"from sside cart")
    
    let idproof;
    
    let token =req.headers.authorization
   
    jwt.verify(token,secret,(err,decoded)=>{
     if(err){
       console.log(err)
     }
     else{
       idproof=decoded.mobi
     }
    })
  let p= await usercollection.updateOne({mobile:idproof,"carts.itemname":req.body.y.itemname},{$set:{"carts.$.quantity":req.body.y.quantity,"carts.$.totalprice":req.body.y.price*req.body.y.quantity}} )


})

app.post('/descfromside',async(req,res)=>{
  console.log(req.body)
  let idproof;
    
  let token =req.headers.authorization
 
  jwt.verify(token,secret,(err,decoded)=>{
   if(err){
     console.log(err)
   }
   else{
     idproof=decoded.mobi
   }
  })
  console.log(req.body.cat.categ)
  let p= await usercollection.updateOne({mobile:idproof,"carts.itemname":req.body.y.itemname},{$set:{"carts.$.quantity":req.body.y.quantity,"carts.$.totalprice":req.body.y.price*req.body.y.quantity}} )
  if(req.body.y.quantity==0){
    let p= await usercollection.updateOne({mobile:idproof}, { $pull: { carts: {quantity: 0 } } } )
 
  }
 
  // let p= await collection.findOneAndUpdate({"category":req.body.cat.categ,"items.itemname":req.body.y.itemname},{$set:{"items.$.quantity":req.body.y.quantity}})
})


app.post('/updatecartcheckout',async(req,res)=>{
  console.log("checkout happenig")
 let s= await collection.updateMany(
  {}, // Filter - an empty object matches all documents
  { $set: { "items.$[].quantity": 0 } } // Update operation
)
})

app.get('/getcategory',async(req,res)=>{

  let result=await collection.find({}).toArray()
  res.json(result)

})

app.get('/getitemsforsidecart',async(req,res)=>{

  console.log(req.headers)
  let token =req.headers.authorization
  let  idproof

  jwt.verify(token,secret,(err,decoded)=>{
   if(err){
     console.log(err)
   }
   else{
     idproof=decoded.mobi
   }
  })

  let pk= await usercollection.findOne({mobile:idproof})
  console.log(pk.carts)

  res.json({data:pk.carts})
})

app.get('/getprofiledetails',async(req,res)=>{
  console.log(req.headers)
  let token =req.headers.authorization
  let  idproof

  jwt.verify(token,secret,(err,decoded)=>{
   if(err){
     console.log(err)
   }
   else{
     idproof=decoded.mobi
   }
  })

  let pk= await usercollection.findOne({mobile:idproof})
   res.json({data:pk})

})

app.get('/getusernameforcheckout',async(req,res)=>{
  let token =req.headers.authorization

  let  idproof
  
  jwt.verify(token,secret,(err,decoded)=>{
   if(err){
     console.log(err)
   }
   else{
     idproof=decoded.mobi
   }
  })
  let pk= await usercollection.findOne({mobile:idproof})
  res.json({data:pk})
})

app.listen(48,()=>{
    console.log("listening on port 48")
})

