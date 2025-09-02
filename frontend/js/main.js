document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});

// Cargar productos desde la API
async function loadProducts() {
    try {
        const API_BASE = window.location.origin;
        const response = await fetch(`${API_BASE}/api/products`);
        
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error cargando productos:', error);
        document.getElementById('products-container').innerHTML = `
            <div class="error-message">
                <p>Error al cargar los productos. Por favor, intenta nuevamente más tarde.</p>
            </div>
        `;
    }
}

// Renderizar productos en la página
function renderProducts(products) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <p>No hay productos disponibles en este momento.</p>
            </div>
        `;
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn">Agregar al Carrito</button>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
}