const menù = [
    { name:"Pizza + Bibità", price:3.00 },
    { name:"Panino + Bibità", price:3.50 },
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
});