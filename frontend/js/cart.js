class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('essen_cart')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event delegation para botones "Agregar al Carrito"
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart') || 
                e.target.closest('.add-to-cart')) {
                const productId = e.target.dataset.productId || 
                                 e.target.closest('[data-product-id]').dataset.productId;
                this.addToCart(productId);
            }
        });
    }

    async addToCart(productId) {
        try {
            const response = await fetch('/api/products');
            const products = await response.json();
            const product = products.find(p => p.id == productId);

            if (!product) {
                alert('Producto no encontrado');
                return;
            }

            const existingItem = this.items.find(item => item.id == productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({
                    ...product,
                    quantity: 1,
                    addedAt: new Date().toISOString()
                });
            }

            this.saveCart();
            this.updateCartCount();
            this.showNotification('Producto agregado al carrito');
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Error al agregar el producto');
        }
    }

    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id != productId);
        this.saveCart();
        this.updateCartCount();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id == productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('essen_cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartCounts = document.querySelectorAll('.cart-count');
        const totalItems = this.getTotalItems();
        
        cartCounts.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
    }
}

// Inicializar carrito
const cart = new Cart();