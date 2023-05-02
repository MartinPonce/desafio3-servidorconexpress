//module
import express from "express";
import ProductManager from './ProductManager.js';
const productManager = new ProductManager();

//const express = require('express');
//const ProductManager = require('./ProductManager'); // ruta del archivo de la clase ProductManager


const app = express();
const PORT = 8080;
//app.listen(ProductManager, () => {
  //console.log(`Example app listening on port http://localhost:${ProductManager}`);
//});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProduct(); 
    
    if (limit) {
      res.status(200).json( products.slice(0,limit));
    } else {
      res.status(200).json( products );
    } 
  }  catch (error) {
     res.status(500).json({message: 'There was an error'});
    }
  });

app.get('/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const product = await productManager.getProductById(parseInt(id));
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({message: 'There was an error'});
    }

  });

  app.listen(PORT, () => {
    console.log(`Listening on port`);
  });
