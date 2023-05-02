import fs from 'fs';

//const fs = require('fs');

class ProductManager {
  constructor() {
    this.path = './src/products.json';
  }

    // Cargar los productos del archivo (si existe)
  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
         const data = await fs.promises.readFile(this.path, 'utf8');
         return JSON.parse(data);    
      }
      await fs.promises.writeFile(this.path, JSON.stringify([])); 
      return [];
    } catch (error) {
      throw new Error(error.message);
    }
  }  

  async addProduct(product) {
    try {
      let data = await this.getProducts();
      const searchCode = data.find((p) => p.code === product.code);
      if (searchCode) {
        return 'This code already exists';
      }
      if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.thumbnail ||
        !product.code ||
        !product.stock 
      ) {
        return 'Fields missing';
      } 
      const lastProductId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
      const newProduct = { ...product, id: lastProductId };
      data.push(newProduct);
      const productString = JSON.stringify(data, null, 2);
      await fs.promises.writeFile('products.json', productString);
      return newProduct;
    } catch (e) {
      throw new Error(e);
    }
  }   
  
  async getProductById(id) {
    try {
      let data = await this.getProducts();
      const productFound = data.find((product) => product.id === id);
      if (!productFound) {
        return null;
      }
      return productFound;
    } catch (error) {
        throw new Error(error);
      }
    }
  

  async updateProduct(id, newData) {
    let data = await this.getProducts();
    const position = data.findIndex(product => product.id === id);
    if (position !== -1) {
      data[position] = { ...data[position], ...newData };
    }
  }    

  deleteProduct(productId) {
    const productIndex = this.products.findIndex(product => product.id === productId);

    if (productIndex >= 0) {
      this.products.splice(productIndex, 1);
      this.saveToFile();
      return true;
    } else {
      return false;
    }
  }

  saveToFile() {
    try {
      const fileData = JSON.stringify(this.products);
      fs.writeFileSync(this.path, fileData);
    } catch (error) {
      console.error(`Error al guardar los productos en el archivo: ${error.message}`);
    }
  }
}


