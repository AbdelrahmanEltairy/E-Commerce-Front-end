
const cartItemsContainer = document.getElementById('cartItems');
const subtotalDisplay = document.getElementById('subtotal');
const discountDisplay = document.getElementById('discount');
const totalDisplay = document.getElementById('total');


let cartItems = [];

// Function to fetch JSON data and initialize the cart
async function loadCartItems() {
    
        
        const response =  fetch('https://github.com/HassanAhmed093/E-Commerce-Front-end/blob/main/Json/products.json');
        const products =  response.json();
        
       
        const selectedProductIds = [3, 12, 10];
        cartItems = selectedProductIds.map(id => {
            const product = products.find(p => p.ID === id);
            return { ...product, quantity: 1 };
        });

        
        displayCartItems();
       
        updateTotal();
    
}


function displayCartItems() {
 
    cartItemsContainer.innerHTML = '';

    
    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.Image}" alt="${item.Name}">
            <div class="item-details">
                <h3>${item.Name}</h3>
                <p>${item.Details}</p>
                <p class="price">$${item.Price.toFixed(2)}</p>
            </div>
            <div class="quantity-control">
                <button class="decrease">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="increase">+</button>
            </div>
            <button class="remove-item"><i class="fas fa-trash"></i></button>
        `;

        // Add event listeners for quantity controls and remove button
        cartItem.querySelector('.decrease').addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                cartItem.querySelector('.quantity').textContent = item.quantity;
                updateTotal();
            }
        });

        cartItem.querySelector('.increase').addEventListener('click', () => {
            item.quantity++;
            cartItem.querySelector('.quantity').textContent = item.quantity;
            updateTotal();
        });

        cartItem.querySelector('.remove-item').addEventListener('click', () => {
            cartItems.splice(index, 1); // Remove item from array
            displayCartItems(); // Re-render items
            updateTotal();
        });

        cartItemsContainer.appendChild(cartItem);
    });
}

// Function to update cart total
function updateTotal() {
    let subtotal = 0;
    cartItems.forEach(item => {
        subtotal += item.Price * item.quantity;
    });
    const discount = subtotal * 0.1; // 10% discount
    const deliveryFee = 15; // $15 delivery fee
    const total = subtotal - discount + deliveryFee;

    // Update DOM with formatted values
    subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
    discountDisplay.textContent = `-$${discount.toFixed(2)}`;
    totalDisplay.textContent = `$${total.toFixed(2)}`;
}

// Load cart items when the page loads
document.addEventListener('DOMContentLoaded', loadCartItems);