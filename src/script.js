// MOBILE MENU
const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        navigation.classList.toggle("open");

        const isOpen = navigation.classList.contains("open");
        menuButton.setAttribute("aria-expanded", isOpen);
    });
}


// CART
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
    const cartCount = document.getElementById("cartCount");

    if (!cartCount) return;

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;
}

document.querySelectorAll(".add-cart-button").forEach(button => {
    button.addEventListener("click", () => {
        const product = {
            name: button.dataset.name,
            price: Number(button.dataset.price),
            image: button.dataset.image,
            quantity: 1
        };

        const existingProduct = cart.find(
            item => item.name === product.name
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        showNotification("Product added to cart.");
    });
});

updateCartCount();


// NEWSLETTER
const newsletterForm = document.getElementById("newsletterForm");

if (newsletterForm) {
    newsletterForm.addEventListener("submit", event => {
        event.preventDefault();
        newsletterForm.reset();
        showNotification("Thanks for subscribing!");
    });
}


// PASSWORD VISIBILITY
document.querySelectorAll(".password-toggle").forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(
            button.dataset.passwordTarget
        );

        if (!input) return;

        const isHidden = input.type === "password";

        input.type = isHidden ? "text" : "password";
        button.textContent = isHidden ? "Hide" : "Show";
    });
});


// LOGIN PAGE
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm && loginMessage) {
    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        loginMessage.classList.remove("success");

        if (!email) {
            loginMessage.textContent =
                "Please enter your email address.";
            return;
        }

        if (password.length < 6) {
            loginMessage.textContent =
                "Password must contain at least 6 characters.";
            return;
        }

        loginMessage.textContent = "Login successful.";
        loginMessage.classList.add("success");

        showNotification("Welcome back to Lindaré!");
        loginForm.reset();
    });
}


// NOTIFICATION
function showNotification(message) {
    const notification = document.getElementById("notification");

    if (!notification) return;

    notification.textContent = message;
    notification.classList.add("show");

    clearTimeout(showNotification.timeout);

    showNotification.timeout = setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);
}
// SIGN UP PAGE
const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");

if (signupForm && signupMessage) {
    signupForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;
        const accepted =
            document.getElementById("acceptTerms").checked;

        signupMessage.classList.remove("success");

        if (!name || !email) {
            signupMessage.textContent =
                "Please enter your name and email address.";
            return;
        }

        if (password.length < 6) {
            signupMessage.textContent =
                "Password must contain at least 6 characters.";
            return;
        }

        if (password !== confirmPassword) {
            signupMessage.textContent =
                "The passwords do not match.";
            return;
        }

        if (!accepted) {
            signupMessage.textContent =
                "Please accept the terms and privacy policy.";
            return;
        }

        signupMessage.textContent =
            "Your account has been created successfully.";

        signupMessage.classList.add("success");
        showNotification("Welcome to Lindaré!");

        signupForm.reset();
    });
}

// HOMEPAGE SEARCH
const homeSearchForm = document.getElementById("homeSearchForm");
const homeSearch = document.getElementById("homeSearch");

if (homeSearchForm && homeSearch) {
    homeSearchForm.addEventListener("submit", event => {
        event.preventDefault();

        const searchValue = homeSearch.value.trim();

        if (!searchValue) return;

        window.location.href =
            `./pages/shop.html?search=${encodeURIComponent(searchValue)}`;
    });
}

// SHOP PAGE
const shopProducts = [...document.querySelectorAll(".shop-product")];
const categoryInputs = document.querySelectorAll(
    'input[name="category"]'
);
const shopSearchForm = document.getElementById("shopSearchForm");
const shopSearch = document.getElementById("shopSearch");
const sortProducts = document.getElementById("sortProducts");
const productGrid = document.getElementById("shopProductGrid");
const productCount = document.getElementById("productCount");
const noProducts = document.getElementById("noProducts");

let selectedCategory = "all";
let searchTerm = "";

// SEARCH TERM FROM HOMEPAGE
const searchFromUrl =
    new URLSearchParams(window.location.search).get("search");

if (searchFromUrl) {
    searchTerm = searchFromUrl.trim().toLowerCase();

    if (shopSearch) {
        shopSearch.value = searchFromUrl;
    }

    selectedCategory = "all";

    const allProductsInput = document.querySelector(
        'input[name="category"][value="all"]'
    );

    if (allProductsInput) {
        allProductsInput.checked = true;
    }
}

function displayShopProducts() {
    if (!productGrid) return;

    const visibleProducts = shopProducts.filter(product => {
        const matchesCategory =
            selectedCategory === "all" ||
            product.dataset.category === selectedCategory;

        const matchesSearch = product.dataset.name
            .toLowerCase()
            .includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    const sortedProducts = [...visibleProducts];

    if (sortProducts?.value === "low") {
        sortedProducts.sort(
            (a, b) => Number(a.dataset.price) - Number(b.dataset.price)
        );
    }

    if (sortProducts?.value === "high") {
        sortedProducts.sort(
            (a, b) => Number(b.dataset.price) - Number(a.dataset.price)
        );
    }

    shopProducts.forEach(product => {
        product.style.display = "none";
    });

    sortedProducts.forEach(product => {
        product.style.display = "";
        productGrid.appendChild(product);
    });

    if (productCount) {
        productCount.textContent =
            `${sortedProducts.length} product${sortedProducts.length === 1 ? "" : "s"}`;
    }

    if (noProducts) {
        noProducts.classList.toggle(
            "show",
            sortedProducts.length === 0
        );
    }
}

categoryInputs.forEach(input => {
    input.addEventListener("change", () => {
        selectedCategory = input.value;
        displayShopProducts();
    });
});

if (shopSearchForm && shopSearch) {

    function searchAllProducts() {
        searchTerm = shopSearch.value.trim().toLowerCase();

        // Reset category filter whenever user searches
        selectedCategory = "all";

        const allProductsInput = document.querySelector(
            'input[name="category"][value="all"]'
        );

        if (allProductsInput) {
            allProductsInput.checked = true;
        }

        displayShopProducts();
    }

    shopSearchForm.addEventListener("submit", event => {
        event.preventDefault();
        searchAllProducts();
    });

    shopSearch.addEventListener("input", searchAllProducts);
}

if (sortProducts) {
    sortProducts.addEventListener("change", displayShopProducts);
}


// MOBILE FILTER
const filterButton = document.getElementById("filterButton");
const filterClose = document.getElementById("filterClose");
const shopFilter = document.querySelector(".shop-filter");

if (filterButton && filterClose && shopFilter) {
    filterButton.addEventListener("click", () => {
        shopFilter.classList.add("open");
    });

    filterClose.addEventListener("click", () => {
        shopFilter.classList.remove("open");
    });
}


// CATEGORY FROM HOMEPAGE LINK
const categoryFromUrl =
    new URLSearchParams(window.location.search).get("category");

if (categoryFromUrl) {
    const matchingInput = document.querySelector(
        `input[name="category"][value="${categoryFromUrl}"]`
    );

    if (matchingInput) {
        matchingInput.checked = true;
        selectedCategory = categoryFromUrl;
    }
}

displayShopProducts();

// OPEN SELECTED PRODUCT
document.querySelectorAll(".shop-product").forEach(product => {
    const links = product.querySelectorAll(
        'a[href="./product-details.html"]'
    );

    links.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            const image = product.querySelector("img");

            const selectedProduct = {
                name: product.dataset.name,
                price: Number(product.dataset.price),
                category: product.dataset.category,
                image: image ? image.getAttribute("src") : ""
            };

            localStorage.setItem(
                "selectedProduct",
                JSON.stringify(selectedProduct)
            );

            window.location.href = "./product-details.html";
        });
    });
});

// CART PAGE
const cartItems = document.getElementById("cartItems");
const emptyCart = document.getElementById("emptyCart");
const cartSubtotal = document.getElementById("cartSubtotal");
const deliveryFee = document.getElementById("deliveryFee");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const checkoutSection = document.getElementById("checkoutSection");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutMessage = document.getElementById("checkoutMessage");
const orderSuccess = document.getElementById("orderSuccess");
const applyPromo = document.getElementById("applyPromo");
const promoCode = document.getElementById("promoCode");

let discount = 0;

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function renderCart() {
    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        emptyCart.classList.add("show");
        checkoutButton.disabled = true;
    } else {
        emptyCart.classList.remove("show");
        checkoutButton.disabled = false;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;

        cartItems.innerHTML += `
            <article class="cart-item">
                <div class="cart-product">
                    <img src="${item.image}" alt="${item.name}">

                    <div>
                        <h3>${item.name}</h3>

                        <button
                            type="button"
                            class="remove-item"
                            data-index="${index}"
                        >
                            Remove
                        </button>
                    </div>
                </div>

                <p>GHS ${item.price.toFixed(2)}</p>

                <div class="quantity-box">
                    <button
                        type="button"
                        class="decrease-quantity"
                        data-index="${index}"
                    >
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        type="button"
                        class="increase-quantity"
                        data-index="${index}"
                    >
                        +
                    </button>
                </div>

                <strong>GHS ${itemTotal.toFixed(2)}</strong>
            </article>
        `;
    });

    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const delivery = subtotal > 0 ? 30 : 0;
    const total = Math.max(subtotal + delivery - discount, 0);

    cartSubtotal.textContent = `GHS ${subtotal.toFixed(2)}`;
    deliveryFee.textContent = `GHS ${delivery.toFixed(2)}`;
    cartTotal.textContent = `GHS ${total.toFixed(2)}`;
}

if (cartItems) {
    cartItems.addEventListener("click", event => {
        const index = Number(event.target.dataset.index);

        if (event.target.classList.contains("increase-quantity")) {
            cart[index].quantity += 1;
        }

        if (event.target.classList.contains("decrease-quantity")) {
            cart[index].quantity -= 1;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        }

        if (event.target.classList.contains("remove-item")) {
            cart.splice(index, 1);
        }

        saveCart();
        renderCart();
    });

    renderCart();
}


// PROMO CODE
if (applyPromo && promoCode) {
    applyPromo.addEventListener("click", () => {
        const code = promoCode.value.trim().toUpperCase();

        if (code === "LINDARE10" && cart.length > 0) {
            const subtotal = cart.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            discount = subtotal * 0.1;
            updateCartTotals();
            showNotification("10% discount applied.");
        } else {
            discount = 0;
            updateCartTotals();
            showNotification("Invalid promo code.");
        }
    });
}


// SHOW CHECKOUT
if (checkoutButton && checkoutSection) {
    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) return;

        checkoutSection.classList.add("active");

        checkoutSection.scrollIntoView({
            behavior: "smooth"
        });
    });
}


// COMPLETE ORDER
if (checkoutForm && checkoutMessage) {
    checkoutForm.addEventListener("submit", event => {
        event.preventDefault();

        if (cart.length === 0) {
            checkoutMessage.textContent = "Your cart is empty.";
            return;
        }

        cart = [];
        discount = 0;

        saveCart();
        renderCart();
        checkoutForm.reset();

        checkoutSection.classList.remove("active");
        orderSuccess.classList.add("active");

        orderSuccess.scrollIntoView({
            behavior: "smooth"
        });
    });
}

// PRODUCT DETAILS PAGE
const mainProductImage = document.getElementById("mainProductImage");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");
const productQuantity = document.getElementById("productQuantity");
const increaseQty = document.getElementById("increaseQty");
const decreaseQty = document.getElementById("decreaseQty");
const productAddButton = document.getElementById("addToCart");
const sizeSection = document.getElementById("sizeSection");

const sizeButtons = document.querySelectorAll(".size-options button");
const colourButtons = document.querySelectorAll(".colour-options .colour");

const selectedProduct =
    JSON.parse(localStorage.getItem("selectedProduct"));

let selectedQuantity = 1;
let unitPrice = selectedProduct?.price || 0;



// LOAD SELECTED PRODUCT
if (selectedProduct && mainProductImage) {
    mainProductImage.src = selectedProduct.image;
    mainProductImage.alt = selectedProduct.name;

    productName.textContent = selectedProduct.name;

    productAddButton.dataset.name = selectedProduct.name;
    productAddButton.dataset.price = selectedProduct.price;
    productAddButton.dataset.image = selectedProduct.image;

    if (productDescription) {
        productDescription.textContent =
            `${selectedProduct.name} from the Lindaré collection, selected for style, quality and everyday use.`;
    }
    if (sizeSection){
        sizeSection.style.display =
          selectedProduct.category ==="slippers" ? "block" : "none";
    }
}


// PRICE
function updateProductPrice() {
    if (!productPrice) return;

    const total = unitPrice * selectedQuantity;
    productPrice.textContent = `GHS ${total.toFixed(2)}`;
}

updateProductPrice();


// QUANTITY
if (increaseQty && productQuantity) {
    increaseQty.addEventListener("click", () => {
        selectedQuantity++;
        productQuantity.textContent = selectedQuantity;
        updateProductPrice();
    });
}

if (decreaseQty && productQuantity) {
    decreaseQty.addEventListener("click", () => {
        if (selectedQuantity > 1) {
            selectedQuantity--;
            productQuantity.textContent = selectedQuantity;
            updateProductPrice();
        }
    });
}


// SIZE
sizeButtons.forEach(button => {
    button.addEventListener("click", () => {
        sizeButtons.forEach(item =>
            item.classList.remove("active-size")
        );

        button.classList.add("active-size");
    });
});


// COLOUR
colourButtons.forEach(button => {
    button.addEventListener("click", () => {
        colourButtons.forEach(item =>
            item.classList.remove("active-colour")
        );

        button.classList.add("active-colour");
    });
});


// ADD SELECTED PRODUCT TO CART
if (productAddButton && selectedProduct) {

    productAddButton.addEventListener("click", () => {

        const product = {
            name: selectedProduct.name,
            price: Number(selectedProduct.price),
            image: selectedProduct.image,
            quantity: selectedQuantity
        };

        const existingProduct = cart.find(
            item => item.name === product.name
        );

        if (existingProduct) {
            existingProduct.quantity += selectedQuantity;
        } else {
            cart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();

        showNotification(
            `${selectedQuantity} ${selectedProduct.name}${selectedQuantity > 1 ? "s" : ""} added to cart.`
        );
    });

}


// CONTACT PAGE
const contactForm = document.getElementById("contactForm");
const contactFormMessage = document.getElementById("contactFormMessage");

if (contactForm && contactFormMessage) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const subject = document.getElementById("contactSubject").value;
        const message = document.getElementById("contactMessage").value.trim();

        contactFormMessage.classList.remove("success");

        if (!name || !email || !subject || !message) {
            contactFormMessage.textContent =
                "Please complete all required fields.";
            return;
        }

        contactFormMessage.textContent =
            "Your message has been sent successfully.";

        contactFormMessage.classList.add("success");

        showNotification("Message sent successfully!");

        contactForm.reset();
    });
}