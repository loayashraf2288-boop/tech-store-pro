const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

/* 🔐 باسورد الادمن */
const ADMIN_PASSWORD = "11211";

/* database مؤقت */
let products = [];
let orders = [];
let coupons = [];


/* 🔥 multer setup */

const storage = multer.diskStorage({

destination: function(req, file, cb){
cb(null, "uploads/");
},

filename: function(req, file, cb){
cb(null, Date.now() + path.extname(file.originalname));
}

});

const upload = multer({ storage });


/* 🔥 ADMIN LOGIN */

app.post("/admin-login", (req,res)=>{

if(req.body.password === ADMIN_PASSWORD){
return res.json({success:true});
}

res.json({success:false});

});


/* 🔥 GET PRODUCTS */

app.get("/api/products",(req,res)=>{
res.json(products);
});


/* 🔥 ADD PRODUCT WITH IMAGE */

app.post("/api/products", upload.single("image"), (req,res)=>{

if(!req.file){
return res.status(400).json({error:"image required"});
}

const product = {

id: Date.now(),
name: req.body.name,
price: Number(req.body.price),
discount: Number(req.body.discount) || 0,
stock: Number(req.body.stock) || 0,
description: req.body.description || "",
image: "/uploads/" + req.file.filename

};

products.push(product);

res.json({success:true});

});


/* DELETE PRODUCT */

app.delete("/api/products/:id",(req,res)=>{

products = products.filter(p=>p.id != req.params.id);

res.sendStatus(200);

});


/* ORDERS */

app.post("/api/orders",(req,res)=>{

orders.push({
id:Date.now(),
customer:req.body
});

res.json({success:true});

});

app.get("/api/orders",(req,res)=>{
res.json(orders);
});


/* COUPONS */

app.post("/api/coupons",(req,res)=>{

coupons.push({
code:req.body.code,
discount:req.body.discount
});

res.json({success:true});

});

app.post("/api/check-coupon",(req,res)=>{

const coupon = coupons.find(c=>c.code === req.body.code);

if(!coupon){
return res.json({valid:false});
}

res.json({
valid:true,
discount:coupon.discount
});

});


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
console.log("🔥 Server Running");
});
