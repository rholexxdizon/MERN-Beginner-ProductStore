import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Product from './models/product.models.js'
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(express.json()); // a middlewhere that allows us to accept JSON data in the req.body


app.get("/api/products", async (req, res) => {
    try{
        const result = await Product.find({});
        res.json(result);
    } catch(error){
        console.error("Error in Getting Products", error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
})

app.post("/api/products", async (req,res) => {
    const product = req.body; // user will send this data

    if(!product.name || !product.price || !product.image) {
        return res.status(400).json({ success:false, message: "Please provide all the fields" });
    }

    const newProduct = new Product(product);

    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct});
    } catch (error) {
        console.error("Error in Create Product", error.message);
        res.status(500).json({ success: false, message: "Server error"});
    }
});

app.put("/api/products/:id", async (req, res) => {
    const {id} = req.params;

    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: "Invalid Product Id" });
    }

    try{
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error){
        res.status(500).json({ success:false, message: "Server Error" });
    }
});

app.delete("/api/products/:id", async (req,res) => {
    const {id} = req.params;
    
    try{
        await Product.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Product deleted"});
    } catch (error){
        console.error("Error in Deleting Product", error.message);
        res.status(500).json({ success: false, message: "Server error"});
    }
});



console.log(process.env.MONGO_URI);

app.listen(5000, () => {
    connectDB();
    console.log("Server has started at http://localhost:5000");
});