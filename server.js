const express = require("express");
const app = express();

app.use(express.json({limit:"10mb"}));
app.use(express.static("public"));

/* 🔐 باسورد ثابت */
const ADMIN_PASSWORD = "11211";

/* DATABASE مؤقتة */
let products = [];
let orders = [];
let coupons = [];


// 🔥 ADMIN LOGIN
app.post("/admin-login",(req,res)=>{

if(req.body.password === ADMIN_PASSWORD){
    return res.json({success:true});
}

res.json({success:false});

});


// 🔥 GET PRODUCTS
app.get("/api/products",(req,res)=>{
res.json(products);
});


// 🔥 ADD PRODUCT
app.post("/api/products",(req,res)=>{

if(!req.body.name){
return res.status(400).json({error:"name required"});
}

const product={
id:Date.now(),
name:req.body.name,
price:Number(req.body.price),
discount:Number(req.body.discount)||0,
stock:Number(req.body.stock)||0,
image:req.body.image,
description:req.body.description || ""
};

products.push(product);

res.json({success:true});

});


// 🔥 DELETE PRODUCT
app.delete("/api/products/:id",(req,res)=>{

products = products.filter(p=>p.id != req.params.id);

res.sendStatus(200);

});


// 🔥 ORDERS
app.post("/api/orders",(req,res)=>{

orders.push({
id:Date.now(),
customer:req.body,
date:new Date()
});

res.json({success:true});

});

app.get("/api/orders",(req,res)=>{
res.json(orders);
});


// 🔥 COUPONS
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
console.log("🔥 TECH STORE RUNNING");
});
