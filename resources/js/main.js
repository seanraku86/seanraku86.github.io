// Cart
let cartIcon = document.getElementById('cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};

// Load Document
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {    
    ready();
}

// Add Event Listeners
function ready() {
    // Remove from Cart
    let removeCartItemButtons = document.getElementsByClassName('cart-remove');
    console.log(removeCartItemButtons);
    for (let i = 0; i < removeCartItemButtons.length; i++) {
        let button = removeCartItemButtons[i];
        button.addEventListener('click', removeCartItem);
    }
    // Quantity Changes
    let quantityInputs = document.getElementsByClassName('cart-product-quantity');
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
    // Add Cart
    let addToCartButtons = document.getElementsByClassName('add-cart');
    for (let i = 0; i < addToCartButtons.length; i++) {
        let button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked);
    }
    // Checkout button
    document.getElementsByClassName('btn-checkout')[0].addEventListener('click', checkoutButtonClicked);

    // Clear Cart button
    document.getElementsByClassName('btn-clearcart')[0].addEventListener('click', clearCartButtonClicked);

    //Close Checkout Box button
    document.getElementsByClassName('close-checkout')[0].addEventListener('click', closeCheckoutButtonClicked);

    //Plave Order button
    document.getElementsByClassName('btn-place-order')[0].addEventListener('click', placeOrderButtonClicked);

}


// Functions
function placeOrderButtonClicked() {
    const formFields = document.getElementsByClassName('order-fields');
    const allFieldsFilled = Array.from(formFields).every((field) => field.value.trim() !== '');
    if (allFieldsFilled) {
        alert('Thank you for your purchase. Confirmation email has been sent to your email address.');
    }
}

function validateEmail() {
    let form = document.getElementById('order-form');
    let email = document.getElementById('email').value;
    let emailCheckText = document.getElementById('email-check-text');
    let emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (email.match(emailFormat)) {
        form.classList.add('valid');
        form.classList.remove('invalid');
        emailCheckText.innerHTML = "Your Email Address is Valid";
        emailCheckText.style.color = "#3aa757";
    } else {
        form.classList.remove('valid');
        form.classList.add('invalid');
        emailCheckText.innerHTML = "Please Enter Valid Email Address";
        emailCheckText.style.color = "#ff0000";
    }
}

function closeCheckoutButtonClicked() {
    let checkoutBox = document.getElementById('checkout-box');
    checkoutBox.style.display = "none";  
}


function checkoutButtonClicked() {
    let checkoutBox = document.getElementById('checkout-box');
    checkoutBox.style.display = "block";
  
    // Get the table body element in the checkoutBox
    let tableBody = checkoutBox.querySelector("tbody");
  
    // Remove any existing rows from the table
    tableBody.innerHTML = "";
  
    // Loop through the items in the cart and add a row to the table for each item
    Object.keys(cartItems).forEach(title => {
      let item = cartItems[title];
  
      let row = document.createElement("tr");
  
      let titleCell = document.createElement("td");
      titleCell.textContent = title;
      row.appendChild(titleCell);
  
      let priceCell = document.createElement("td");
      priceCell.textContent = item.price;
      row.appendChild(priceCell);
  
      let quantityCell = document.createElement("td");
      quantityCell.textContent = item.quantity;
      row.appendChild(quantityCell);

      let subtotalCell = document.createElement("td");
      item.price = item.price.replace("AU$", "");
      item.quantity = parseInt(item.quantity);
      subtotalCell.textContent = Math.round((item.price * item.quantity) * 100) / 100;
      row.appendChild(subtotalCell);

      tableBody.appendChild(row);
    });

    let newrow = document.createElement("tr");
    let totalCell = document.createElement("td");
    totalCell.textContent = "TOTAL: AU$" + updateCartTotal();
    newrow.appendChild(totalCell);
    tableBody.appendChild(newrow);

    let newrow2 = document.createElement("tr");
    let orderDate = document.createElement("td");
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const datetime = `${year}-${month}-${day} ${hours}:${minutes}`;
    orderDate.textContent = "ORDER DATE: " + datetime;
    newrow2.appendChild(orderDate);
    tableBody.appendChild(newrow2);

    cartItems = {};
    updateCartDisplay();
    updateCartTotal();
    localStorage.removeItem('cartItems');
}

function clearCartButtonClicked() {
    let cartItemsContainer = document.getElementsByClassName('cart-content')[0];
    while (cartItemsContainer.hasChildNodes()) {
        cartItemsContainer.removeChild(cartItemsContainer.firstChild);
    }
    cartItems = {};
    updateCartTotal();
    checkoutButton = document.getElementsByClassName('btn-checkout')[0];
    checkoutButton.disabled = true;

    localStorage.removeItem('cartItems');
}

function removeCartItem(event) {
    let buttonClicked = event.target;
    let cartItem = buttonClicked.parentElement;
    let title = cartItem.getElementsByClassName('cart-product-title')[0].innerText;
    cartItem.remove();
    delete cartItems[title];
    updateCartTotal();

    // if cart is empty, disable checkout button
    if (Object.keys(cartItems).length === 0) {
        checkoutButton = document.getElementsByClassName('btn-checkout')[0];
        checkoutButton.disabled = true;
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function quantityChanged(event) {
    let input = event.target;
    const maxOrderLimit = 20;
    if (input.value > maxOrderLimit) {
        input.value = maxOrderLimit;
    }
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();

    cartItems[title].quantity = parseInt(input.value);

    // store the updated cartItems object in localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function addToCartClicked(event) {
    let button = event.target;
    let shopItem = button.parentElement;
    let title = shopItem.getElementsByClassName('product-title')[0].innerText;
    let price = shopItem.getElementsByClassName('product-price')[0].innerText;
    let productImg = shopItem.getElementsByClassName('product-image')[0].src; // Add class to img
    addItemToCart(title, price, productImg);
    updateCartTotal();
}


function addItemToCart(title, price, productImg) {
    if (cartItems[title]) {
      cartItems[title].quantity++;
    } else {
      cartItems[title] = {
        price: price,
        image: productImg,
        quantity: 1
      };
    }
    updateCartDisplay();
    checkoutButton = document.getElementsByClassName('btn-checkout')[0];
    checkoutButton.disabled = false;

    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Save cartItems to local storage
}
  
function updateCartDisplay() {
    let cartItemsContainer = document.getElementsByClassName('cart-content')[0];
    cartItemsContainer.innerHTML = '';
    Object.keys(cartItems).forEach(title => {
      let item = cartItems[title];
      let cartShopBox = document.createElement('div');
      cartShopBox.classList.add('cart-box');
      let cartBoxContent = `
        <img class="cart-product-image" src="${item.image}" alt="">
        <div class="box-detail">
          <div class="cart-product-title">${title}</div>
          <div class="cart-product-price">${item.price}</div>
          <input type="number" class="cart-product-quantity" value="${item.quantity}">
        </div>
        <i class="ri-delete-bin-fill cart-remove"></i>
      `;
      cartShopBox.innerHTML = cartBoxContent;
      cartItemsContainer.append(cartShopBox);
      cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem);
      cartShopBox.getElementsByClassName('cart-product-quantity')[0].addEventListener('change', quantityChanged);
    });
}


// Update Total
function updateCartTotal() {
    let cartContent = document.getElementsByClassName('cart-content')[0];
    let cartBoxes = cartContent.getElementsByClassName('cart-box');
    let total = 0;
    for (let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i];
        let priceElement = cartBox.getElementsByClassName('cart-product-price')[0];
        let quantityElement = cartBox.getElementsByClassName('cart-product-quantity')[0];
        let price = parseFloat(priceElement.innerText.replace('AU$', ''));
        let quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('total-price')[0].innerText = 'AU$' + total;
    return total;
}

