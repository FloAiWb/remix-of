(function () {
    if (typeof gravmixData === 'undefined') {
        return;
    }

    var canvas = null;
    var ctx = null;
    var currentMockup = null;

    var fontMap = {
        serif: '"Times New Roman", serif',
        sans: '"Arial", "Segoe UI", sans-serif',
        mono: '"Courier New", monospace',
        script: '"Georgia", serif',
        display: '"Trebuchet MS", sans-serif'
    };

    function loadImage(src) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function () {
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    function drawNoise() {
        var noise = ctx.createImageData(canvas.width, canvas.height);
        for (var i = 0; i < noise.data.length; i += 4) {
            var value = Math.random() * 20;
            noise.data[i] = value;
            noise.data[i + 1] = value;
            noise.data[i + 2] = value;
            noise.data[i + 3] = 20;
        }
        ctx.putImageData(noise, 0, 0);
    }

    function renderCanvas() {
        var text = document.getElementById('gravmix-text').value || 'GravMix';
        var fontId = document.getElementById('gravmix-font').value;
        var productType = document.getElementById('gravmix-product').value;
        var mockupSrc = gravmixData.mockups[productType];

        loadImage(mockupSrc).then(function (img) {
            currentMockup = img;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0f1115';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            var imgWidth = img.width * scale;
            var imgHeight = img.height * scale;
            var x = (canvas.width - imgWidth) / 2;
            var y = (canvas.height - imgHeight) / 2;
            ctx.drawImage(img, x, y, imgWidth, imgHeight);

            ctx.font = '48px ' + fontMap[fontId];
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.save();
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(40, 40, 40, 0.85)';
            ctx.fillText(text, canvas.width / 2 + 2, canvas.height / 2 + 2);
            ctx.restore();

            ctx.save();
            ctx.globalCompositeOperation = 'overlay';
            ctx.fillStyle = 'rgba(230, 230, 230, 0.8)';
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
            ctx.restore();

            ctx.save();
            ctx.globalAlpha = 0.35;
            drawNoise();
            ctx.restore();
        });
    }

    function setStatus(message) {
        var status = document.getElementById('gravmix-status');
        if (status) {
            status.textContent = message;
        }
    }

    function downloadPreview() {
        var link = document.createElement('a');
        link.download = 'gravmix-preview.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    function sendToTelegram() {
        var name = window.prompt('Ваше имя');
        var phone = window.prompt('Телефон');
        if (!name || !phone) {
            setStatus('Заполните имя и телефон для отправки.');
            return;
        }

        var payload = {
            name: name,
            phone: phone,
            productType: document.getElementById('gravmix-product').value,
            text: document.getElementById('gravmix-text').value,
            fontId: document.getElementById('gravmix-font').value,
            previewPngBase64: canvas.toDataURL('image/png')
        };

        fetch(gravmixData.restUrl + '/lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': gravmixData.nonce
            },
            body: JSON.stringify(payload)
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('Ошибка отправки');
            }
            return response.json();
        }).then(function () {
            setStatus('Заявка отправлена в Telegram.');
        }).catch(function () {
            setStatus('Не удалось отправить заявку.');
        });
    }

    function addToCart() {
        var productType = document.getElementById('gravmix-product').value;
        var productId = gravmixData.productMap[productType];
        if (!productId) {
            setStatus('Укажите ID товара в настройках GravMix.');
            return;
        }

        var payload = {
            productId: productId,
            productType: productType,
            text: document.getElementById('gravmix-text').value,
            fontId: document.getElementById('gravmix-font').value
        };

        fetch(gravmixData.restUrl + '/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': gravmixData.nonce
            },
            body: JSON.stringify(payload)
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('Ошибка добавления');
            }
            return response.json();
        }).then(function (data) {
            setStatus('Товар добавлен в корзину.');
            if (data.cartUrl) {
                window.location.href = data.cartUrl;
            }
        }).catch(function () {
            setStatus('Не удалось добавить в корзину.');
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        canvas = document.getElementById('gravmix-canvas');
        if (!canvas) {
            return;
        }
        ctx = canvas.getContext('2d');

        ['gravmix-text', 'gravmix-font', 'gravmix-product'].forEach(function (id) {
            var input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', renderCanvas);
                input.addEventListener('change', renderCanvas);
            }
        });

        var downloadBtn = document.getElementById('gravmix-download');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', downloadPreview);
        }
        var sendBtn = document.getElementById('gravmix-send');
        if (sendBtn) {
            sendBtn.addEventListener('click', sendToTelegram);
        }
        var addBtn = document.getElementById('gravmix-add');
        if (addBtn) {
            addBtn.addEventListener('click', addToCart);
        }

        renderCanvas();
    });
})();
