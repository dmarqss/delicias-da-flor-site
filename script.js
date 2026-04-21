let cart = JSON.parse(localStorage.getItem('cart')) || [];

        function addToCart(name, price) {
            const item = cart.find(i => i.name === name);
            if (item) {
                item.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            saveCart();
            updateCartDisplay();
            showToast(`${name} adicionado ao carrinho!`);
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            saveCart();
            updateCartDisplay();
        }

        function updateQuantity(index, quantity) {
            if (quantity <= 0) {
                removeFromCart(index);
            } else {
                cart[index].quantity = quantity;
                saveCart();
                updateCartDisplay();
            }
        }

        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        function showToast(message, type = 'success') {
            const toastElement = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            const toastHeader = toastElement.querySelector('.toast-header i');

            toastMessage.textContent = message;

          
            if (type === 'success') {
                toastHeader.className = 'bi bi-check-circle-fill text-success me-2';
            } else if (type === 'danger') {
                toastHeader.className = 'bi bi-exclamation-triangle-fill text-danger me-2';
            }

            const toast = new bootstrap.Toast(toastElement);
            toast.show();
        }

        function updateCartDisplay() {
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            cartItems.innerHTML = '';
            let total = 0;
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                cartItems.innerHTML += `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h6>${item.name}</h6>
                            <small>R$ ${item.price.toFixed(2)} x ${item.quantity}</small>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                            <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${index})">Remover</button>
                        </div>
                    </div>
                `;
            });
            cartTotal.textContent = total.toFixed(2);
        }

        function confirmOrder() {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const phone = document.getElementById('phone').value;
            const payment = document.getElementById('payment').value;
            const address = document.getElementById('address').value;

            if (!firstName || !lastName || !phone || !payment || !address) {
                showToast('Por favor, preencha todos os campos.', 'danger');
                return;
            }

            const message = `
                <p><strong>Nome:</strong> ${firstName} ${lastName}</p>
                <p><strong>Telefone:</strong> ${phone}</p>
                <p><strong>Pagamento:</strong> ${payment}</p>
                <p><strong>Endereço:</strong> ${address}</p>
                <p><strong>Total:</strong> R$ ${document.getElementById('cartTotal').textContent}</p>
            `;

            document.getElementById('successMessage').innerHTML = message;

          
            let whatsappText = `*Novo Pedido - Delicias da Flor*\n\n`;
            whatsappText += `*Cliente:* ${firstName} ${lastName}\n`;
            whatsappText += `*Telefone:* ${phone}\n`;
            whatsappText += `*Pagamento:* ${payment}\n`;
            whatsappText += `*Endereço:* ${address}\n\n`;
            whatsappText += `*Itens do Pedido:*\n`;
            cart.forEach(item => {
                whatsappText += `• ${item.name} x${item.quantity} — R$ ${(item.price * item.quantity).toFixed(2)}\n`;
            });
            whatsappText += `\n*Total: R$ ${document.getElementById('cartTotal').textContent}*`;

            const whatsappNumber = '5563992217602';
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

          
            cart = [];
            saveCart();
            updateCartDisplay();

            
            const orderModal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
            orderModal.hide();

            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();
            window.open(whatsappURL, '_blank');
        }

       
        document.addEventListener('DOMContentLoaded', updateCartDisplay);