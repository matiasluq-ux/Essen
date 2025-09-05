document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    
    // Manejar envío del formulario
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
    
    // Manejar cancelar edición
    document.getElementById('cancelBtn').addEventListener('click', resetForm);
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
        renderAdminProducts(products);
    } catch (error) {
        console.error('Error cargando productos:', error);
        alert('Error al cargar los productos');
    }
}

// Renderizar productos en el panel de administración
function renderAdminProducts(products) {
    const adminProductsList = document.getElementById('admin-products-list');
    adminProductsList.innerHTML = '';
    
    if (products.length === 0) {
        adminProductsList.innerHTML = `
            <div class="no-products">
                <p>No hay productos registrados.</p>
            </div>
        `;
        return;
    }
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'admin-product';
        productElement.innerHTML = `
            <div>
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <p><strong>Precio:</strong> $${product.price.toFixed(2)}</p>
            </div>
            <div class="product-actions">
                <button class="btn btn-edit" onclick="editProduct(${product.id})">Editar</button>
                <button class="btn btn-delete" onclick="deleteProduct(${product.id})">Eliminar</button>
            </div>
        `;
        adminProductsList.appendChild(productElement);
    });
}

// Guardar producto (crear o actualizar)
async function saveProduct() {
    const API_BASE = window.location.origin;
    const productId = document.getElementById('productId').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const image = document.getElementById('image').value;
    
    const productData = { name, description, price, image };
    
    try {
        let response;
        if (productId) {
            // Actualizar producto existente
            response = await fetch(`${API_BASE}/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        } else {
            // Crear nuevo producto
            response = await fetch(`${API_BASE}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        }
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            resetForm();
            loadProducts();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error guardando producto:', error);
        alert('Error al guardar el producto');
    }
}

// Editar producto
async function editProduct(id) {
    try {
        const API_BASE = window.location.origin;
        const response = await fetch(`${API_BASE}/api/products`);
        
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        
        const products = await response.json();
        const product = products.find(p => p.id === id);
        
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('name').value = product.name;
            document.getElementById('description').value = product.description;
            document.getElementById('price').value = product.price;
            document.getElementById('image').value = product.image;
            
            // Scroll al formulario
            document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error cargando producto para editar:', error);
        alert('Error al cargar el producto');
    }
}

// Eliminar producto
async function deleteProduct(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            const API_BASE = window.location.origin;
            const response = await fetch(`${API_BASE}/api/products/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert(result.message);
                loadProducts();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error eliminando producto:', error);
            alert('Error al eliminar el producto');
        }
    }
}

// Resetear formulario
function resetForm() {
    document.getElementById('productId').value = '';
    document.getElementById('productForm').reset();
}