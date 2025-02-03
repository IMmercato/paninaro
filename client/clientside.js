import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js';
import { getFirestore, setDoc, addDoc, deleteDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyBOrbHqvaKesB01CNajd62X5FlNzI0KgRc",
    authDomain: "paninaro-9788d.firebaseapp.com",
    projectId: "paninaro-9788d",
    storageBucket: "paninaro-9788d.firebasestorage.app",
    messagingSenderId: "463589606739",
    appId: "1:463589606739:web:e1b7415617f9faaa790da6",
    measurementId: "G-304NM45KZP"
}

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

document.addEventListener('DOMContentLoaded', function () {
    const login = document.getElementById('login')
    const reserved = document.getElementById('paninaro')
    const money = document.getElementById('Guadagni');
    const ordine = document.getElementById('ordine')
    if (login) {
        register()
    } else if (reserved) {
        paninaro()
    } else if (money) {
        guadagni()
    } else if(ordine){
        order()
    } else{
        losess()
    }
})

function register() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById("login").style.display = "none";
            setTimeout(() => {
                window.location.href = '/Order';
            }, 1000)
        } else {
            document.getElementById("login").style.display = "block";
        }
    });
    const registerForm = document.getElementById("form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const classeInput = document.getElementById("classe");
    const errorMessageDiv = document.getElementById("error-message");

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const classe = classeInput.value.trim();

        if (!name || !email || !password || !classe) {
            errorMessageDiv.textContent = "Please fill in all fields.";
            return;
        }

        if (!email.endsWith("@itiseveripadova.edu.it")) {
            errorMessageDiv.textContent = "Please use an @itiseveripadova.edu.it email address.";
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("User registered successfully:", user);
                const userRef = doc(db, "users", user.uid);
                setDoc(userRef, {
                    name: name,
                    email: email,
                    classe: classe
                })
                    .then(() => {
                        console.log("User data saved to Firestore successfully.");
                        window.location.href = '/Order';
                    })
                    .catch((error) => {
                        console.error("Error saving user data to Firestore:", error);
                        errorMessageDiv.textContent = "Error saving user data to Firestore. Please try again.";
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error registering user:", errorCode, errorMessage);
                errorMessageDiv.textContent = errorMessage;
            });
    });
}

function paninaro() {

}

function order() {
    // Check if user is authenticated
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = '/Login';
        } else {
            console.log("User is authenticated");

            // Food list
            const foodList = [
                { id: 1, name: "Pizza", price: 15.99 },
                { id: 2, name: "Burger", price: 10.99 },
                { id: 3, name: "Sandwich", price: 8.99 },
                { id: 4, name: "Salad", price: 7.99 },
                { id: 5, name: "Fries", price: 4.99 },
            ];

            console.log("Food list:", foodList);

            // Cart
            let cart = [];

            // Generate food cards
            const foodContainer = document.querySelector(".food-container");
            console.log("Food container:", foodContainer);

            foodList.forEach((food) => {
                console.log("Generating card for:", food);

                const foodCard = document.createElement("div");
                foodCard.classList.add("food-card");
                foodCard.innerHTML = `
                    <h3>${food.name}</h3>
                    <p>Price: $${food.price}</p>
                    <button class="add-to-cart-btn" data-id="${food.id}">Add to Cart</button>
                `;
                foodContainer.appendChild(foodCard);
            });

            // Add event listener to add to cart buttons
            const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");
            console.log("Add to cart buttons:", addToCartBtns);

            addToCartBtns.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    console.log("Add to cart button clicked");

                    const foodId = parseInt(e.target.dataset.id);
                    const food = foodList.find((f) => f.id === foodId);
                    if (food) {
                        cart.push(food);
                        updateCart();
                    }
                });
            });

            // Update cart
            function updateCart() {
                console.log("Updating cart");

                const cartList = document.getElementById("cart-list");
                const totalPriceElement = document.getElementById("total-price");
                cartList.innerHTML = "";
                let total = 0;
                cart.forEach((food) => {
                    const cartItem = document.createElement("li");
                    cartItem.innerHTML = `
            <span>${food.name}</span> x $${food.price}
        `;
                    cartList.appendChild(cartItem);
                    total += food.price;
                });
                totalPriceElement.textContent = `Total Price: $${total.toFixed(2)}`;
                return total;
            }

            // Checkout button
            const checkoutBtn = document.getElementById("checkout-btn");
            console.log("Checkout button:", checkoutBtn);

            checkoutBtn.addEventListener("click", () => {
                console.log("Checkout button clicked");

                if (cart.length > 0) {
                    const modal = document.getElementById("modal");
                    modal.style.display = "block";
                } else {
                    alert("Your cart is empty!");
                }
            });

            // Accept button
            const acceptBtn = document.getElementById("accept-btn");
            console.log("Accept button:", acceptBtn);

            acceptBtn.addEventListener("click", () => {
                console.log("Accept button clicked");

                const modal = document.getElementById("modal");
                modal.style.display = "none";
                const totalPrice = updateCart();
                const userRef = doc(db, "users", user.uid);
                getDoc(userRef).then((userdoc) => {
                    const className = userdoc.data().classe;
                    const classRef = doc(db, "orders", className);
                    const ordersRef = collection(classRef, "orders");
                    addDoc(ordersRef, {
                        cart: cart,
                        total: totalPrice,
                    })
                        .then(() => {
                            console.log("Order saved to Firestore successfully.");
                            alert("Order placed successfully!");
                            cart = [];
                            updateCart();
                        })
                        .catch((error) => {
                            console.error("Error saving order to Firestore:", error);
                            alert("Error placing order. Please try again.");
                        });
                });
            });

            // Decline button
            const declineBtn = document.getElementById("decline-btn");
            declineBtn.addEventListener("click", () => {
                const modal = document.getElementById("modal");
                modal.style.display = "none";
            });
        }
    });
}

function guadagni() {
    // Get the total earnings per week
    function getTotalEarningsPerWeek() {
        return new Promise((resolve, reject) => {
            const ordersRef = collection(db, "orders");
            const queryRef = query(ordersRef, where("date", ">=", new Date().getTime() - 604800000)); // Get orders from the last week
            getDocs(queryRef).then((querySnapshot) => {
                const earningsPerWeek = {};
                querySnapshot.forEach((doc) => {
                    const date = new Date(doc.data().date).toISOString().split('T')[0];
                    const week = getWeekNumber(new Date(date));
                    if (!earningsPerWeek[week]) {
                        earningsPerWeek[week] = 0;
                    }
                    earningsPerWeek[week] += doc.data().total;
                });
                resolve(earningsPerWeek);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    // Get the best classes who spends much
    function getBestClasses() {
        return new Promise((resolve, reject) => {
            const ordersRef = collection(db, "orders");
            const queryRef = query(ordersRef, where("date", ">=", new Date().getTime() - 604800000)); // Get orders from the last week
            getDocs(queryRef).then((querySnapshot) => {
                const earningsPerClass = {};
                querySnapshot.forEach((doc) => {
                    const classe = doc.data().classe;
                    if (!earningsPerClass[classe]) {
                        earningsPerClass[classe] = 0;
                    }
                    earningsPerClass[classe] += doc.data().total;
                });
                const sortedClasses = Object.keys(earningsPerClass).sort((a, b) => earningsPerClass[b] - earningsPerClass[a]);
                resolve(sortedClasses.slice(0, 5).map((classe) => ({ classe, earnings: earningsPerClass[classe] })));
            }).catch((error) => {
                reject(error);
            });
        });
    }

    // Get the week number
    function getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    // Draw the charts
    function drawCharts() {
        const totalEarningsChart = document.getElementById('total-earnings');
        const bestClassesChart = document.getElementById('best-classes');

        //to fix errors
        totalEarningsChart.style.overflow = 'hidden';
        totalEarningsChart.addEventListener('wheel', function (event) {
            event.preventDefault();
        }, { passive: false });
        bestClassesChart.style.overflow = 'hidden';
        bestClassesChart.addEventListener('wheel', function (event) {
            event.preventDefault();
        }, { passive: false });

        getTotalEarningsPerWeek().then((earningsPerWeek) => {
            const data = new google.visualization.DataTable();
            data.addColumn('string', 'Week');
            data.addColumn('number', 'Earnings');

            Object.keys(earningsPerWeek).forEach((week) => {
                data.addRow([`Week ${week}`, earningsPerWeek[week]]);
            });

            const options = {
                title: 'Total Earnings per Week',
                hAxis: { title: 'Week' },
                vAxis: { title: 'Earnings' },
                legend: 'none'
            };

            const chart = new google.visualization.BarChart(totalEarningsChart);
            chart.draw(data, options);
        }).catch((error) => {
            console.error("Error getting total earnings data:", error);
            totalEarningsChart.innerHTML = "No total earnings data available.";
        });

        getBestClasses().then((bestClasses) => {
            const data = new google.visualization.DataTable();
            data.addColumn('string', 'Class');
            data.addColumn('number', 'Earnings');

            bestClasses.forEach((classe) => {
                data.addRow([classe.classe, classe.earnings]);
            });

            const options = {
                title: 'Best Classes who Spends Much',
                hAxis: { title: 'Class' },
                vAxis: { title: 'Earnings' },
                legend: 'none'
            };

            const chart = new google.visualization.BarChart(bestClassesChart);
            chart.draw(data, options);
        }).catch((error) => {
            console.error("Error getting best classes data:", error);
            bestClassesChart.innerHTML = "No best classes data available.";
        });
    }

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawCharts);
}

function losess() {
    function getUserSpendingChart() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                getDoc(userRef).then((userDoc) => {
                    const ordersRef = collection(db, "orders", userDoc.data().classe, "orders");
                    const queryRef = query(ordersRef, where("date", ">=", new Date().getTime() - 31536000000)); // Get orders from the last year
                    getDocs(queryRef).then((querySnapshot) => {
                        const spendingPerMonth = {};
                        querySnapshot.forEach((doc) => {
                            const date = new Date(doc.data().date).toISOString().split('T')[0];
                            const month = date.split('-')[1];
                            if (!spendingPerMonth[month]) {
                                spendingPerMonth[month] = 0;
                            }
                            spendingPerMonth[month] += doc.data().total;
                        });
                        const data = new google.visualization.DataTable();
                        data.addColumn('string', 'Month');
                        data.addColumn('number', 'Spending');
                        Object.keys(spendingPerMonth).forEach((month) => {
                            data.addRow([month, spendingPerMonth[month]]);
                        });
                        const options = {
                            title: 'Your Spending per Month',
                            hAxis: { title: 'Month' },
                            vAxis: { title: 'Spending' },
                            legend: 'none'
                        };
                        const chart = new google.visualization.BarChart(document.getElementById('user-spending-chart'));
                        chart.draw(data, options);
                    });
                });
            } else {
                console.log("User is not authenticated");
            }
        });
    }
    function getUserSpendingThisMonth() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                getDoc(userRef).then((userDoc) => {
                    const ordersRef = collection(db, "orders", userDoc.data().classe, "orders");
                    const queryRef = query(ordersRef, where("date", ">=", new Date().getTime() - 2592000000)); // Get orders from this month
                    getDocs(queryRef).then((querySnapshot) => {
                        let totalSpent = 0;
                        querySnapshot.forEach((doc) => {
                            totalSpent += doc.data().total;
                        });
                        const lossesElement = document.getElementById('losess');
                        lossesElement.innerHTML = `
                            <h1>You spent ${totalSpent.toFixed(2)}€ this month</h1>
                            <div id="user-spending-chart" style="width: 800px; height: 400px;"></div>
                        `;
                    });
                });
            } else {
                console.log("User is not authenticated");
            }
        });
    }
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(getUserSpendingChart);
}