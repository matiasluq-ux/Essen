const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta al archivo JSON
const dataPath = path.join(__dirname, 'data', 'products.json');

// Leer productos desde el JSON
function readProducts() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      fs.writeFileSync(dataPath, JSON.stringify([]));
      return [];
    }
    console.error('Error leyendo productos:', error);
    return [];
  }
}

// Guardar productos en el JSON
function saveProducts(products) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
    return true;
  } catch (error) {
    console.error('Error guardando productos:', error);
    return false;
  }
}

// Rutas de la API
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    image: req.body.image || ''
  };
  
  products.push(newProduct);
  const success = saveProducts(products);
  
  if (success) {
    res.json({ message: 'Producto agregado correctamente', product: newProduct });
  } else {
    res.status(500).json({ error: 'Error al guardar el producto' });
  }
});

app.put('/api/products/:id', (req, res) => {
  const products = readProducts();
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  products[productIndex] = {
    id: productId,
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    image: req.body.image || ''
  };
  
  const success = saveProducts(products);
  
  if (success) {
    res.json({ message: 'Producto actualizado correctamente', product: products[productIndex] });
  } else {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const products = readProducts();
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  const deletedProduct = products.splice(productIndex, 1);
  const success = saveProducts(products);
  
  if (success) {
    res.json({ message: 'Producto eliminado correctamente', product: deletedProduct });
  } else {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// Servir la página del carrito
app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/cart.html'));
});

// Servir la página de checkout (la crearemos después)
app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/checkout.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Essen ejecutándose en puerto ${PORT}`);
  console.log(`Página principal: http://localhost:${PORT}`);
  console.log(`Panel de administración: http://localhost:${PORT}/admin`);
});