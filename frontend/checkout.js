class Checkout {
    constructor() {
        this.cart = cart;
        this.init();
    }

    init() {
        this.loadOrderSummary();
        this.setupEventListeners();
        this.setupFormValidation();
    }

    loadOrderSummary() {
        const orderItems = document.getElementById('orderItems');
        const subtotal = this.cart.getTotal();
        const shipping = subtotal > 0 ? 1500 : 0;
        const total = subtotal + shipping;

        if (this.cart.items.length === 0) {
            orderItems.innerHTML = '<p class="empty-message">No hay productos en el carrito</p>';
            return;
        }

        orderItems.innerHTML = this.cart.items.map(item => `
            <div class="order-item">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-quantity">x${item.quantity}</span>
                </div>
                <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        document.getElementById('orderSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('orderShipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('orderTotal').textContent = `$${total.toFixed(2)}`;
    }

    setupEventListeners() {
        document.getElementById('checkoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.sendWhatsAppMessage();
            }
        });

        // Auto-formatear teléfono
        document.getElementById('phone').addEventListener('input', (e) => {
            e.target.value = this.formatPhoneNumber(e.target.value);
        });
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    validateField(field) {
        const errorElement = document.getElementById(field.id + 'Error');
        
        if (!field.value.trim()) {
            this.showError(field, errorElement, 'Este campo es requerido');
            return false;
        }

        if (field.type === 'email' && !this.isValidEmail(field.value)) {
            this.showError(field, errorElement, 'Email inválido');
            return false;
        }

        if (field.id === 'phone' && !this.isValidPhone(field.value)) {
            this.showError(field, errorElement, 'WhatsApp inválido');
            return false;
        }

        this.clearError(field, errorElement);
        return true;
    }

    validateForm() {
        let isValid = true;
        const requiredFields = document.querySelectorAll('input[required], select[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (this.cart.items.length === 0) {
            alert('⚠️ El carrito está vacío. Agrega productos antes de continuar.');
            isValid = false;
        }

        return isValid;
    }

    showError(field, errorElement, message) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    clearError(field, errorElement) {
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Validar número argentino: 11 1234-5678 o 351 123-4567
        const phoneRegex = /^(\d{2,3}\s?\d{4}\s?\d{4})$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }

    formatPhoneNumber(phone) {
        // Formatear a: 11 2345-6789
        const numbers = phone.replace(/\D/g, '');
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
        return `${numbers.slice(0, 2)} ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
    }

    sendWhatsAppMessage() {
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            zipCode: document.getElementById('zipCode').value,
            province: document.getElementById('province').value,
            notes: document.getElementById('notes').value,
            cart: this.cart.items,
            total: this.cart.getTotal() + 1500 // + envío
        };

        const whatsappMessage = this.generateWhatsAppMessage(formData);
        const whatsappNumber = '5491159122632'; // Reemplaza con el número de Essen
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Opcional: Limpiar carrito después de enviar
        this.cart.clearCart();
        
        // Mostrar mensaje de confirmación
        alert('✅ ¡Redirigiendo a WhatsApp! Completa el proceso allí para finalizar tu compra.');
    }

    generateWhatsAppMessage(data) {
        const productsList = data.cart.map(item => 
            `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');

        return `¡Hola! Quiero realizar una compra en Essen 🍳

*📋 Datos del Pedido:*
${productsList}

*💰 Total:* $${data.total.toFixed(2)}

*👤 Mis Datos:*
Nombre: ${data.firstName} ${data.lastName}
Email: ${data.email}
WhatsApp: ${data.phone}

*🏠 Dirección de Envío:*
${data.address}, ${data.city}
${data.province} ${data.zipCode ? '- CP: ' + data.zipCode : ''}

${data.notes ? `*📝 Notas:* ${data.notes}` : ''}

*⏰ Horario preferido de contacto:* 
Por favor indicarme horarios disponibles para coordinar el pago y envío.

¡Gracias! 🎉`;
    }
}

// Inicializar checkout
const checkout = new Checkout();