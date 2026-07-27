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
    shopSearchForm.addEventListener("submit", event => {
        event.preventDefault();
        searchTerm = shopSearch.value.trim().toLowerCase();
        displayShopProducts();
    });

    shopSearch.addEventListener("input", () => {
        searchTerm = shopSearch.value.trim().toLowerCase();
        displayShopProducts();
    });
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