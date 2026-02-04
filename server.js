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

/* ================= COUPONS ================= */

let coupons = [
{
code:"TECH10",
type:"percent", // percent or fixed
discount:10,
active:true
},
{
code:"WELCOME50",
type:"fixed",
discount:50,
active:true
}
];

/* ================= PRODUCTS ================= */

// get all
app.get("/api/products",(req,res)=>{
const data = readData();
res.json(data.products);
});

// get single
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

// delete
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

/* ================= COUPON CHECK ================= */

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

if(coupon.type==="percent"){

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
total
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

/* ================= START ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
console.log("SERVER RUNNING 🔥");
});
