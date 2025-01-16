// Edit product
function editProduct(id) {
    const product = product.find(p => p.id === id);
    if (product) {
        productName.value = product.name;
        productDescription.value = product.description;
        productPrice.value = product.price;
        const previewImage = document.querySelector('.image-preview img');
        previewImage ? previewImage.src = product.image : null;
        productImage.files = new DataTransfer().files;
        message.textContent = "Edit the product anf resubmit.";
        message.style.color = "blue";
        products = products.filter(p => p.id !==id); //Remove the product temporarily for re-upload
        displayProducts();
    }
}

//Delete product
function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    displayProducts();
}

//Clear the form after submission
function clearForm() {
    productName.value = "";
    productDescription = "";
    productPrice.value = "";
    productImage.value = "";
    imagePreview.style.display = 'none';
}