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
let products = [];

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

    const name = productName.value.trim();
    const description = productDescription.value.trim();
    const price = parseFloat(productPrice.value.trim());

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
        image: imagePreview.querySelector('img') ? imagePreview.querySelector('img').src : ""
    };

    products.push(newProduct);
    displayProducts();
    clearForm();
    message.textContent = "Product uploaded successfully!";
    message.style.color = "green";
});

//Display products
function displayProducts() {
    productList.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>$${product.price}</p>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="openDeleteModal(${product.id})">Delete</button>
            </div>
        `;
        productList.appendChild(productItem);
    });
}

//let editingProduct = null;

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        // Store the product being edited
        editingProduct = product;
        productName.value = product.name;
        productDescription.value = product.description;
        productPrice.value = product.price;

        const previewImage = document.querySelector('.image-preview img');
        if (previewImage) {
            previewImage.src = product.image;
        } else {
            imagePreview.innerHTML = `<img src="${product.image}" alt="Product Image Preview">`;
            imagePreview.style.display = 'block';
        }

        productImage.files = new DataTransfer().files;
        message.textContent = "Edit the product and resubmit.";
        message.style.color = "blue";
        products = products.filter(p => p.id !== id); // Remove the product temporarily for re-upload
        displayProducts();
    }
}

let productToDelete = null; //Store the product to be deleted

//Open the modal and confirm delete
function openDeleteModal(id) {
    productToDelete = id;
    console.log(`Opening modal to delete product with ID: ${id}`);
    document.getElementById('confirmationModal').style.display = 'flex';
}

//Close the modal
document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    document.getElementById('confirmationModal').style.display = 'none';
});

//Confirm delete action
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    deleteProduct(productToDelete);
    document.getElementById('confirmationModal').style.display = 'none';
});

//Delete product
function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    displayProducts();
}

//Clear the form after submission
function clearForm() {
    productName.value = "";
    productDescription.value = "";
    productPrice.value = "";
    productImage.value = "";
    imagePreview.style.display = 'none';
}

//File validation for image uploads (check file type and size)
productImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const fileType = file ? file.type.split('/')[1] : '';
    const fileSize = file ? file.size / 1024 / 1024 : 0; // MB

    if (file) {
        if (!['jpg', 'jpeg', 'png'].includes(fileType)) {
            message.textContent = "Invalid file type! Please upload a JPG, JPEG, OR PNG file.";
            message.style.color = "red";
            productImage.value = ''; //Reset file input
            return;
        }

        if (fileSize > 5) { //limit to 5MB
            message.textContent = "File size exceeds 5MB! Please upload a smaller file.";
            message.style.color = "red";
            productImage.value = ''; //Reset file input
            return;
        }

        //Display image preview if file is valid
        const reader = new FileReader();
        reader.onload = function () {
            imagePreview.innerHTML = `<img src="${reader.result}" alt="Product Image Preview">`;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Sorting products by name or price
document.getElementById('sortNameBtn').addEventListener('click', () => {
    products.sort((a, b) => a.name.localeCompare(b.name));
    displayProducts();
});

document.getElementById('sortPriceBtn').addEventListener('click', () => {
    products.sort((a, b) => a.price - b.price); // Corrected sorting logic
    displayProducts();
});

//Search functionality for product name or description
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    displayFilteredProducts(filteredProducts);
});

//Display products
function displayProducts() {
    productList.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>Product Name: ${product.name}</h3>
                <p>Product Description: ${product.description}</p>
                <p>Product Price: $${product.price}</p>
                <p>Rating: ${product.rating}</p>
                <div class="product-rating">
                    <label for="rating-${product.id}">Rate this product: </label>
                    <input type="number" id="rating-${product.id}" min="1" max="5" step="1" style="width:95%;"/>
                    <button onclick="submitRating(${product.id})">Submit Rating</button>
                </div>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="openDeleteModal(${product.id})">Delete</button>
            </div>
        `;
        productList.appendChild(productItem);
    });
}

// Add rating to product
function submitRating(productId) {
    const rating = document.getElementById('rating-' + productId).value; // Dynamic ID based on productId
    const product = products.find(p => p.id === productId);

    if (product && rating >= 1 && rating <= 5) {
        product.rating = rating;
        displayProducts(); // Re-render the products after updating the rating
    } else {
        alert("Invalid rating value. Please enter a rating between 1 and 5.");
    }
}


