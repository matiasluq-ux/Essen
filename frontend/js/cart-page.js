class CartPage {
    constructor() {
        this.cart = cart;
        this.init();
    }

    init() {
        this.loadCartItems();
        this.setupEventListeners();
        this.updateSummary();
    }

    loadCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        
        if (this.cart.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega algunos productos para comenzar</p>
                    <a href="/" class="btn">Ver Productos</a>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = this.cart.items.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                `<img src="${item.image}" alt="${item.name}" 
      loading="lazy"
      onerror="this.src='https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn" onclick="cartPage.decreaseQuantity(${item.id})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" value="${item.quantity}" min="1" 
                           onchange="cartPage.updateItemQuantity(${item.id}, this.value)">
                    <button class="quantity-btn" onclick="cartPage.increaseQuantity(${item.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="item-remove" onclick="cartPage.removeItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    removeItem(productId) {
        this.cart.removeFromCart(productId);
        this.loadCartItems();
        this.updateSummary();
    }

    increaseQuantity(productId) {
        const item = this.cart.items.find(item => item.id == productId);
        if (item) {
            this.cart.updateQuantity(productId, item.quantity + 1);
            this.loadCartItems();
            this.updateSummary();
        }
    }

    decreaseQuantity(productId) {
        const item = this.cart.items.find(item => item.id == productId);
        if (item && item.quantity > 1) {
            this.cart.updateQuantity(productId, item.quantity - 1);
            this.loadCartItems();
            this.updateSummary();
        }
    }

    updateItemQuantity(productId, quantity) {
        this.cart.updateQuantity(productId, parseInt(quantity));
        this.loadCartItems();
        this.updateSummary();
    }

    updateSummary() {
        const subtotal = this.cart.getTotal();
        const shipping = subtotal > 0 ? 1500 : 0; // Envío fijo de ejemplo
        const total = subtotal + shipping;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = shipping > 0 ? `$${shipping.toFixed(2)}` : 'Gratis';
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;

        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.disabled = this.cart.items.length === 0;
    }

    setupEventListeners() {
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            window.location.href = '/checkout';
        });
    }
}

// Inicializar página del carrito
const cartPage = new CartPage();