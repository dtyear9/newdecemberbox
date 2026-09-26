const PRODUCTS = {
    cosy: ['The Cosy Christmas Box', 39.99],
    mum: ['British Mum Survival Box', 49.99],
    movie: ['Christmas Movie Night Box', 44.99],
    yorkshire: ['Yorkshire Christmas Box', 54.99],
    gamer: ['Christmas Gamer Box', 49.99],
    market: ['Christmas Market Box', 59.99]
};

function getBasket() {
    try {
        return JSON.parse(localStorage.getItem('tdb-basket')) || [];
    } catch {
        return [];
    }
}

function saveBasket(basket) {
    localStorage.setItem('tdb-basket', JSON.stringify(basket));
    updateCount();
}

function updateCount() {
    const count = getBasket().reduce((total, item) => total + item.qty, 0);

    document.querySelectorAll('[data-basket-count]').forEach(el => {
        el.textContent = count;
    });
}

function addToBasket(id) {
    const product = PRODUCTS[id];

    if (!product) return;

    const basket = getBasket();
    const existing = basket.find(item => item.id === id);

    if (existing) {
        existing.qty++;
    } else {
        basket.push({
            id: id,
            name: product[0],
            price: product[1],
            qty: 1
        });
    }

    saveBasket(basket);
    toast(product[0] + ' added to your basket.');
}

function changeQty(id, change) {
    const basket = getBasket();
    const item = basket.find(i => i.id === id);

    if (!item) return;

    item.qty += change;

    saveBasket(
        basket.filter(i => i.qty > 0)
    );

    renderBasket();
}

function removeItem(id) {
    saveBasket(
        getBasket().filter(item => item.id !== id)
    );

    renderBasket();
}

function money(value) {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
    }).format(value);
}

function toast(message) {
    const toastElement = document.querySelector('.toast');

    if (!toastElement) return;

    toastElement.textContent = message;
    toastElement.classList.add('show');

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toastElement.classList.remove('show');
    }, 2500);
}

function renderBasket() {
    const root = document.getElementById('basket-content');

    if (!root) return;

    const basket = getBasket();

    if (!basket.length) {
        root.innerHTML = `
            <div class="basket-empty">
                <div class="gift-icon" style="font-size:4rem;">🎁</div>
                <h2>Your basket is empty</h2>
                <p class="small" style="margin:10px 0 20px;">
                    Choose a hamper to get started.
                </p>
     
