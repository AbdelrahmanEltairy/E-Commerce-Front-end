let products = [];
let filteredProducts = [];

function setLoadingState(loading) {
    const overlay = document.getElementById('loading-overlay');
    if (loading) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

function fetchProducts() {
    setLoadingState(true);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../Json/products.json', true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            products = JSON.parse(xhr.responseText);
            filteredProducts = [...products];
            displayProducts();
            setupEventListeners();
            setLoadingState(false);
        }
    };
    
    xhr.onerror = function() {
        console.error('Error loading products:', xhr.statusText);
        setLoadingState(false);
    };
    
    xhr.send();
}

// Update displayProducts function
function displayProducts() {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    filteredProducts.forEach((product, index) => {
        const productCard = `
            <div class="product-card" onclick="showProductDetails(${product.ID})" style="animation-delay: ${index * 0.1}s">
                <div class="product-image">
                    <img src="../assets/Img/"+${product.Image} alt="${product.Name}"
                         onload="this.style.opacity='1'"
                         style="opacity: 0; transition: opacity 0.5s;">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.Name}</h3>
                    <p class="product-details">${product.Details}</p>
                    <div class="product-rating">
                        ${getStarRating(product.Ratings)}
                        <span class="rating-number">${product.Ratings}</span>
                    </div>
                    <div class="price-section">
                        <p class="product-price">
                            ${product.UnitsInStock < 100 ? 
                                `<span class="original-price">$${(product.Price * 1.2).toFixed(2)}</span>` : 
                                ''
                            }
                            <span class="current-price">$${product.Price.toFixed(2)}</span>
                        </p>
                        ${product.UnitsInStock < 100 ? '<span class="sale-badge">Sale</span>' : ''}
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${product.ID})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

function showProductDetails(productId) {
    const product = products.find(p => p.ID === productId);
    if (product) {
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'productDetails.html';
    }
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    return stars;
}

function setupEventListeners() {
    document.querySelectorAll('.categories-list input').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    document.getElementById('priceRange').addEventListener('input', applyFilters);
    document.getElementById('minPrice').addEventListener('input', applyFilters);
    document.getElementById('maxPrice').addEventListener('input', applyFilters);

    document.querySelectorAll('.ratings-filter input').forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });

    document.getElementById('sortSelect').addEventListener('change', applyFilters);
}

function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('.categories-list input:checked'))
        .map(checkbox => checkbox.value);

    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;

    const selectedRating = document.querySelector('.ratings-filter input:checked')?.value || 0;

    filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategories.length === 0 || 
            selectedCategories.includes(product.Categories);
        const matchesPrice = product.Price >= minPrice && product.Price <= maxPrice;
        const matchesRating = product.Ratings >= selectedRating;

        return matchesCategory && matchesPrice && matchesRating;
    });

    const sortMethod = document.getElementById('sortSelect').value;
    switch(sortMethod) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.Price - b.Price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.Price - a.Price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.Ratings - a.Ratings);
            break;
    }

    displayProducts();
}

function addToCart(productId) {
    const button = event.currentTarget;
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.style.background = '#4CAF50';
    button.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        button.style.background = '#000';
        button.style.transform = 'scale(1)';
    }, 2000);
}

fetchProducts();