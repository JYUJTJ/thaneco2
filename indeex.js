const urlParams = new URLSearchParams(window.location.search);

// دالة لفتح الرسالة
function openMessage() {
    document.getElementById('message-box').style.display = 'none';
    document.getElementById('eid-card').style.display = 'block';
    const audio = document.querySelector('audio');
    audio.play();
}

if (urlParams.has("suitable")) {
    const suitable = urlParams.get("suitable");

    const templatePath = `Templates/${suitable}.html`;

    fetch(templatePath)
        .then(res => {
            if(!res.ok) throw new Error("Template not found");
            return res.text();
        })
        .then(template => {
            urlParams.forEach((value, key) => {
                const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g'); 
                template = template.replace(regex, value);
            });

            document.body.innerHTML = template;

            // تنفيذ الـ scripts في الـ template إذا كانت موجودة
            const scriptMatches = template.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
            if (scriptMatches) {
                scriptMatches.forEach(scriptTag => {
                    const scriptContent = scriptTag.match(/<script[^>]*>([\s\S]*?)<\/script>/i)[1];
                    if (scriptContent.trim()) {
                        eval(scriptContent);
                    }
                });
            }

            // تغيير مواقع النجوم والأقمار عشوائياً كل 10 ثوانٍ
            setInterval(() => {
                const icons = document.querySelectorAll('.floating-icons i');
                icons.forEach(icon => {
                    const newTop = Math.random() * 70 + 10; // 10% إلى 80%
                    const newLeft = Math.random() * 70 + 10; // 10% إلى 80%
                    icon.style.top = newTop + '%';
                    icon.style.left = newLeft + '%';
                });
            }, 10000);
        })
        .catch(err => console.error(err));
}

if (!urlParams.has("suitable")) {
    const makelinkbutton = document.getElementById('makelinkbutton');
    const linkoutput = document.getElementById('linkoutput');
    const copyButton = document.getElementById('copy');
    const nameInput = document.getElementById('name');
    const suitableInput = document.getElementById('suitable');

    makelinkbutton.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const message = document.getElementById('message').value.trim();
        const suitable = suitableInput.value;
        if (name) {
            const url = window.location.origin + window.location.pathname + '?suitable=' + encodeURIComponent(suitable) + '&name=' + encodeURIComponent(name) + '&message=' + encodeURIComponent(message);
            linkoutput.textContent = url;
            document.getElementById('share-buttons').style.display = 'flex';
        } else {
            linkoutput.textContent = 'يرجى إدخال الاسم';
            document.getElementById('share-buttons').style.display = 'none';
        }
    });

    copyButton.addEventListener('click', () => {
        const text = linkoutput.textContent;
        if (text && text !== '__' && text !== 'يرجى إدخال الاسم') {
            navigator.clipboard.writeText(text).then(() => {
                alert('تم نسخ الرابط');
            });
        }
    });
}

// دوال المشاركة
function shareOnWhatsApp() {
    const url = document.getElementById('linkoutput').textContent;
    const text = encodeURIComponent('---\n\n\uD83C\uDF89 **لديّ مفاجأة جميلة لك!** \uD83C\uDF89\nمن موقع **تهانيكو** \uD83D\uDCEC\nحضّرتها خصيصًا من أجلك،\nوأتمنى أن تدخل على قلبك فرحة صغيرة \uD83D\uDE0A\u2728\n\nاضغط على الرابط،\nودع الرسالة تتكفّل بالباقي \uD83D\uDC96\uD83C\uDF81\n\n--- ' + url);
    window.open('https://wa.me/?text=' + text, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(document.getElementById('linkoutput').textContent);
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank');
}

function shareOnTwitter() {
    const url = document.getElementById('linkoutput').textContent;
    const text = encodeURIComponent('---\n\n\uD83C\uDF89 **لديّ مفاجأة جميلة لك!** \uD83C\uDF89\nمن موقع **تهانيكو** \uD83D\uDCEC\nحضّرتها خصيصًا من أجلك،\nوأتمنى أن تدخل على قلبك فرحة صغيرة \uD83D\uDE0A\u2728\n\nاضغط على الرابط،\nودع الرسالة تتكفّل بالباقي \uD83D\uDC96\uD83C\uDF81\n\n--- ' + url);
    window.open('https://twitter.com/intent/tweet?text=' + text, '_blank');
}
