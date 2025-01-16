//script.js

//Select Elements
const productForm = document.getElementById('productForm');
const productName = document.getElementById('productName');
const productDescription = document.getElementById('productDescription');
const productPrice = document.getElementById('productPrice');
const productImage = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');
const message = document.getElementById('message');
const productList = document.getElementById('productList');

//Store uploaded products
let product = [];

//Show image preview
productImage.addEventListener('change', () => {
    const file = productImage.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            imagePreview.innerHTML = `<img src="${reader.result}" alt="Product Image Preview">`;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

//Validate and submit form
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = productName.ariaValueMax.trim();
    const description = productDescription.ariaValueMax.trim();
    const price = parseFloat(productPrice.ariaValueMax.trim());

    if (name === "" || description === "" || isNaN(price) || price <= 0) {
        message.textContent = "Please fill out all fields correctly.";
        message.style.color = "red";
        return;
    }

    const newProduct = {
        id: Date.now(),
        name,
        description,
        price,
        image: imagePreview.querySelector('img').src
    };

    product.push(newProduct);
    displayProducts();
    clearForm();
    message.textContent = "Product uploaded successfully!";
    message.style.color = "green";
});

//Display products
function displayProducts() {
    productList.innerHTML = '';
    productDescription.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>$${product.price}</p>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProducts(${product.id})">Delete</button>
            </div>
        `;
        productList.appendChild(productItem);
    });
}