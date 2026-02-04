const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json({limit:"50mb"}));
app.use(express.static("public"));

const readData = () =>{
return JSON.parse(fs.readFileSync("data.json"));
};

const saveData = (data)=>{
fs.writeFileSync("data.json", JSON.stringify(data,null,2));
};


// 🔥 المنتجات

app.get("/api/products",(req,res)=>{
const data = readData();
res.json(data.products);
});

app.post("/api/products",(req,res)=>{
const data = readData();

const product = {
id:Date.now(),
stock:0,
discount:0,
...req.body
};

data.products.push(product);

saveData(data);

res.sendStatus(200);
});

app.delete("/api/products/:id",(req,res)=>{

const data = readData();

data.products = data.products.filter(
p=>p.id != req.params.id
);

saveData(data);

res.sendStatus(200);
});


// 🔥 الطلبات

app.post("/api/orders",(req,res)=>{

const data = readData();

data.orders.push({
id:Date.now(),
date:new Date(),
...req.body
});

saveData(data);

res.sendStatus(200);
});

app.get("/api/orders",(req,res)=>{
const data = readData();
res.json(data.orders);
});


// 🔐 admin

app.post("/admin-login",(req,res)=>{

if(req.body.code === "11211"){
return res.json({success:true});
}

res.json({success:false});
});



const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
console.log("SERVER RUNNING 🔥");
});
