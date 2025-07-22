window.onload = function () {
    if (!getCookie('cookieConsent')) {
        const consentBanner = document.createElement('div');
        consentBanner.style.margin = '0';
        consentBanner.innerHTML = `
            <div style="position:fixed;bottom:0;width:100%;background-color:gray;color:white;padding:10px;margin:0;text-align:center;">
                This site uses cookies to enhance user experience. 
                <a href="/Privacy-Policies" style="color:white;">Learn more</a> and 
                <a href="/Termini-Condizioni" style="color:white;">Terms & Conditions</a>
                <br>
                <input type="checkbox" id="acceptPrivacy" /> I accept the Privacy Policy
                <br>
                <input type="checkbox" id="acceptTerms" /> I accept the Terms & Conditions
                <br>
                <button onclick="acceptCookies()">Accept</button>
            </div>
        `;
        document.body.appendChild(consentBanner);
    }
};
function acceptCookies() {
    const acceptPrivacy = document.getElementById('acceptPrivacy').checked;
    const acceptTerms = document.getElementById('acceptTerms').checked;

    if (acceptPrivacy && acceptTerms) {
        setCookie('cookieConsent', 'true', 30);
        const consentBanner = document.querySelector('div[style*="fixed;bottom:0;width:100%"]');
        if (consentBanner) {
            consentBanner.remove();
        }
    } else {
        alert('You must accept the Privacy Policy and Terms & Conditions to continue.');
    }
}
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/*const menù = [
    { name: "Pizza + Bibità", price: 3.00 },
    { name: "Panino + Bibità", price: 3.50 },
];
const cards = document.getElementById("cards");
menù.forEach((menu) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
    <h4>${menu.name}</h4>
    <img src="" alt="menù">
    <p>€${menu.price}</p>
    `
    cards.append(card);
});*/