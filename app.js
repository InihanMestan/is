// Примерни продукти
const products = [
    {
        name: "Кафе Арабика",
        price: 8.99,
        barcodes: ["1234567890123", "3213213213210"],
        codes: ["CAFE001", "ARABICA-A1"],
        description: "Ароматно кафе Арабика, 250g. Произход: Бразилия."
    },
    {
        name: "Шоколад Млечен",
        price: 2.49,
        barcodes: ["9876543210987"],
        codes: ["CHOC123"],
        description: "Млечен шоколад с 30% какао, 100g."
    },
    {
        name: "Минерална вода 1.5L",
        price: 1.19,
        barcodes: ["5556667778881", "1112223334445"],
        codes: ["WATER15L"],
        description: "Свежа минерална вода, 1.5 литра."
    }
];

const barcodeInput = document.getElementById('barcode-input');
const scanBtn = document.getElementById('scan-btn');
const productInfo = document.getElementById('product-info');
const noProduct = document.getElementById('no-product');
let qrScannerActive = false;
const qrReader = document.getElementById('qr-reader');

function findProduct(barcode) {
    return products.find(p => p.barcodes.includes(barcode));
}

function showProduct(product) {
    productInfo.innerHTML = `
        <h2>${product.name}</h2>
        <div class="price">Цена: ${product.price.toFixed(2)} лв.</div>
        <div class="ids">
            <strong>Баркод(ове):</strong> ${product.barcodes.join(", ")}<br>
            <strong>Код(ове):</strong> ${product.codes.join(", ")}
        </div>
        <div class="desc">${product.description}</div>
    `;
    productInfo.classList.remove('hidden');
    noProduct.classList.add('hidden');
}

function showNoProduct() {
    productInfo.classList.add('hidden');
    noProduct.classList.remove('hidden');
}

function handleScan() {
    const barcode = barcodeInput.value.trim();
    if (!barcode) return;
    const product = findProduct(barcode);
    if (product) {
        showProduct(product);
    } else {
        showNoProduct();
    }
}

function showCameraError(message) {
    qrReader.innerHTML = `<div style='color:#b00; text-align:center; padding:1em;'>${message}</div>`;
    setTimeout(() => {
        qrReader.classList.add('hidden');
        qrReader.innerHTML = '';
        qrScannerActive = false;
    }, 3500);
}

function startScanner() {
    if (qrScannerActive) return;
    qrReader.classList.remove('hidden');
    qrReader.innerHTML = '';
    qrScannerActive = true;
    const html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: { width: 220, height: 120 }
        },
        (decodedText) => {
            barcodeInput.value = decodedText;
            html5QrCode.stop().then(() => {
                qrReader.classList.add('hidden');
                qrScannerActive = false;
                handleScan();
            });
        },
        (errorMessage) => {
            // Може да се логва грешка, но не е задължително
        }
    ).catch(err => {
        showCameraError('Няма достъп до камерата или тя не е налична! Разрешете достъп до камерата от настройките на браузъра.');
    });
}

scanBtn.addEventListener('click', function(e) {
    e.preventDefault();
    startScanner();
});

barcodeInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        handleScan();
    }
}); 