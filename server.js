const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json({limit:"50mb"}));
app.use(express.static("public"));

/* ================= DATABASE ================= */

const readData = () => {
return JSON.parse(fs.readFileSync("data.json"));
};

const saveData = (data) => {
fs.writeFileSync("data.json", JSON.stringify(data,null,2));
};

/* ================= INITIAL DATA ================= */

let coupons = [
{
code:"TECH10",
type:"percent",
discount:10,
active:true
}
];

/* ================= PRODUCTS ================= */

// get all products
app.get("/api/products",(req,res)=>{
const data = readData();
res.json(data.products);
});

// get single product
app.get("/api/products/:id",(req,res)=>{

const data = readData();

const product = data.products.find(
p=>p.id == req.params.id
);

res.json(product);

});

// add product
app.post("/api/products",(req,res)=>{

const data = readData();

const product = {
id:Date.now(),
name:req.body.name || "منتج بدون اسم",
price:req.body.price || 0,
discount:req.body.discount || 0,
stock:req.body.stock || 0,
description:req.body.description || "",
images:req.body.images || [],
reviews:[]
};

data.products.push(product);

saveData(data);

res.sendStatus(200);

});

// delete product
app.delete("/api/products/:id",(req,res)=>{

const data = readData();

data.products = data.products.filter(
p=>p.id != req.params.id
);

saveData(data);

res.sendStatus(200);

});

/* ================= REVIEWS ================= */

app.post("/api/review/:id",(req,res)=>{

const data = readData();

const product = data.products.find(
p=>p.id == req.params.id
);

if(product){

product.reviews.push({
comment:req.body.comment,
date:new Date()
});

saveData(data);

}

res.sendStatus(200);

});

/* ================= COUPONS ================= */

// get coupons
app.get("/api/coupons",(req,res)=>{
res.json(coupons);
});

// create coupon
app.post("/api/coupons",(req,res)=>{

coupons.push({
code:req.body.code,
type:req.body.type, // percent or fixed
discount:req.body.discount,
active:true
});

res.sendStatus(200);

});

// toggle coupon
app.patch("/api/coupons/:code",(req,res)=>{

const coupon = coupons.find(
c=>c.code === req.params.code
);

if(coupon){
coupon.active = !coupon.active;
}

res.sendStatus(200);

});

// check coupon
app.post("/api/check-coupon",(req,res)=>{

const {code,total} = req.body;

const coupon = coupons.find(
c=>c.code === code && c.active
);

if(!coupon){

return res.json({
valid:false
});

}

let discountAmount = 0;

if(coupon.type === "percent"){

discountAmount = total * (coupon.discount/100);

}else{

discountAmount = coupon.discount;

}

res.json({
valid:true,
discount:discountAmount
});

});

/* ================= ORDERS ================= */

app.post("/api/orders",(req,res)=>{

const data = readData();

const {customer,cart,total} = req.body;

const order = {
id:Date.now(),
date:new Date(),
customer,
cart,
total,
status:"جديد"
};

data.orders.push(order);

saveData(data);

res.sendStatus(200);

});

app.get("/api/orders",(req,res)=>{
const data = readData();
res.json(data.orders);
});

/* ================= ADMIN ================= */

app.post("/admin-login",(req,res)=>{

if(req.body.code === "11211"){
return res.json({success:true});
}

res.json({success:false});

});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
console.log("🚀 SERVER RUNNING");
});
