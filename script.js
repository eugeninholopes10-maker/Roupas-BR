// ===== DADOS DOS PRODUTOS =====
const products = [
    {
        id: 1,
        name: "Camiseta Básica Branca",
        category: "masculino",
        price: 49.90,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
    },
    {
        id: 2,
        name: "Vestido Floral",
        category: "feminino",
        price: 129.90,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"
    },
    {
        id: 3,
        name: "Calça Jeans Masculina",
        category: "masculino",
        price: 159.90,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"
    },
    {
        id: 4,
        name: "Blusa de Algodão",
        category: "feminino",
        price: 79.90,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500"
    },
    {
        id: 5,
        name: "Boné Ajustável",
        category: "acessorios",
        price: 39.90,
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500"
    },
    {
        id: 6,
        name: "Jaqueta de Couro Sintético",
        category: "feminino",
        price: 249.90,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500"
    },
    {
        id: 7,
        name: "Bermuda Linho Masculina",
        category: "masculino",
        price: 89.90,
        image: "https://images.unsplash.com/photo-1591195850951-5d56e759a79e?w=500"
    },
    {
        id: 8,
        name: "Bolsa de Couro",
        category: "acessorios",
        price: 189.90,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"
    }
];

// ===== VARIÁVEIS =====
let cart = [];
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const overlay = document.getElementById('overlay');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalPriceEl = document.getElementById('totalPrice');
const filterBtns = document.querySelectorAll('.filter-btn');
const menuToggle = document.getElementById('menuToggle');
const navbar = document.querySelector('.navbar');

// ===== CARREGAR PRODUTOS =====
function renderProducts(filter = 'todos') {
    productsGrid.innerHTML = '';
    const filtered = filter === 'todos' ? products : products.filter(p => p.category === filter);
    
    filtered.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Adicionar eventos aos botões
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            addToCart(id);
        });
    });
}

// ===== CARRINHO =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function changeQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    // Contagem
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Itens
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    <div class="cart-item-qty">
                        <button onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#999; cursor:pointer; height:fit-content;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    // Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceEl.textContent = total.toFixed(2).replace('.', ',');
}

function openCart() {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== FILTROS =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });
});

// ===== MENU MOBILE =====
menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// ===== EVENTOS =====
cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
overlay.addEventListener('click', closeCartSidebar);

// Formulário de contato
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! 📩 Entraremos em contato em breve.');
    this.reset();
});

// ===== INICIALIZAR =====
renderProducts();