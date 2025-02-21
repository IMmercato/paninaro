import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js';
import { getFirestore, setDoc, addDoc, updateDoc, deleteDoc, collection, doc, getDoc, getDocs, query, Timestamp, where } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js';

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
    const signin = document.getElementById('signin')
    const login = document.getElementById('login')
    const reserved = document.getElementById('paninaro')
    const money = document.getElementById('Guadagni')
    const ordine = document.getElementById('ordine')
    if (signin) {
        register()
    } else if (reserved) {
        paninaro()
    } else if (money) {
        guadagni()
    } else if (ordine) {
        order()
    } else if (login) {
        logins()
    } else {
        losess()
    }
})

function register() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById("signin").style.display = "none";
            setTimeout(() => {
                window.location.href = '/Order';
            }, 1000)
        } else {
            document.getElementById("signin").style.display = "block";
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

function logins() {
    const form = document.getElementById("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            errorMessageDiv.textContent = "Please fill in all fields.";
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("User Loged: ", user);
                window.location.href = "/Order"
            })
            .catch((error) => {
                const errorcode = error.code;
                const errormessage = error.message;
                console.log("Error login user", errorcode, errormessage);
                alert(errormessage);
            })
    })
}

function paninaro() {
    const form = document.getElementById('paninaro');
    const ordiniDiv = document.getElementById('ordini');
    const n = document.getElementById('n');
    const dashboard = document.querySelector('.dashboard');
    const logout = document.getElementById('logoutForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, password })
        })
        .then(response => response.text())
        .then(data => {
            if (data === 'Invalid username or password') {
                alert(data);
            } else {
                window.location.href = '/Paninaro'; // Redirect to Paninaro after successful login
            }
        });
    });

    // Check if already logged in
    fetch('/check-session', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            ordiniDiv.style.display = 'block';
            form.style.display = 'none';
            logout.style.display = 'block';
            const classNames = ["2IE", "1EA", "1IA", "1IB", "1IC", "1ID", "1IE", "1IF", "1IG", "1MA", "1MB", "2IA", "2IB", "2IC", "2ID", "2IF", "2IG", "2IH", "2MA", "2MB", "3IA", "3IB", "3IC", "3ID", "3IF", "3IG", "3MA", "3MB", "3UA", "4IA", "4IB", "4IC", "4ID", "4IF", "4MA", "4MB", "4UA", "5EA", "5IB", "5IA", "5IC", "5ID", "5IE", "5IF", "5MA"];
            details(classNames).catch(console.error);
        }
    });

    async function details(classNames) {
        const now = new Date();
        const currentHour = now.getHours();
        const isWithinRealtimeWindow = currentHour >= 0 && currentHour < 12;

        for (const className of classNames) {
            const collectionPath = `orders/${className}/orders`;
            const collectionRef = collection(db, collectionPath);
            const startDate = isWithinRealtimeWindow ? new Date(now.setHours(0, 0, 0, 0)) : new Date(now.setHours(12, 30, 0, 0));
            const endDate = new Date(now.setHours(23, 59, 59, 999));
            const q = query(collectionRef, where('time', '>=', Timestamp.fromDate(startDate)), where('time', '<=', Timestamp.fromDate(endDate)));
            const querySnapshot = await getDocs(q);
            const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (orders.length > 0) {
                const filteredOrders = orders.filter(order => !order.orderready);
                if (filteredOrders.length > 0) {
                    generateOrderCard(className, filteredOrders);
                }
            }
        }
    }

    function generateOrderCard(className, orders) {
        const card = document.createElement("div");
        card.id = "card";
        let tot_pay = 0;
        card.innerHTML = `
            <button class="toggle-button">${className}</button>
            <div class="details">
                ${orders.map(order => {
            if (Array.isArray(order.cart)) {
                return order.cart.map(item => {
                    tot_pay += item.price;
                    return `<p>${item.id} - €${item.price}</p>`;
                }).join('');
            } else {
                return '';
            }
        }).join('')}
                <h3>Totale: ${tot_pay}</h3>
                <button class="confirm-delete">Confirm Delete</button>
            </div>
        `;
        n.appendChild(card);

        const toggleButton = card.querySelector('.toggle-button');
        const detailsDiv = card.querySelector('.details');
        const confirmDeleteButton = card.querySelector('.confirm-delete');

        toggleButton.addEventListener('click', () => {
            detailsDiv.classList.toggle('expanded');
        });

        confirmDeleteButton.addEventListener('click', async () => {
            const userConfirmed = confirm("Are you sure you want to delete this order?");
            if (userConfirmed) {
                await updateOrderStatus(className, orders);
                card.remove();
            }
        });
    }

    async function updateOrderStatus(className, orders) {
        const collectionPath = `orders/${className}/orders`;
        for (const order of orders) {
            const orderRef = doc(db, collectionPath, order.id);
            await updateDoc(orderRef, { orderready: true });
        }
    }

    dashboard.addEventListener('click', function() {
        window.open('/Guadagni', '_blank');
    });
    
    

    // Socket.io client code
    const socket = io();

    socket.on('orderUpdate', (orderData) => {
        const { className, orders } = orderData;
        generateOrderCard(className, orders);
        /*const now = new Date();
        const currentHour = now.getHours();
        const isWithinRealtimeWindow = currentHour >= 0 && currentHour < 19;
        if (isWithinRealtimeWindow) {
            generateOrderCard(className, orders);
        }*/
    });
}

function order() {
    // Check if user is authenticated
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = '/';
        } else {
            console.log("User  is authenticated");

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
                <p>Price: €${food.price}</p>
                <button class="add-to-cart-btn" data-id="${food.id}">Add to Cart</button>
                <button class="remove-from-cart-btn" data-id="${food.id}" style="display:none;">Remove from Cart</button>
            `;
                foodContainer.appendChild(foodCard);
            });

            const logout = document.getElementById("logout");
            logout.addEventListener("click", () => {
                signOut(auth)
                    .then(() => {
                        console.log("User signed out successfully");
                        window.location.href = '/';
                    })
                    .catch((error) => {
                        console.error("Error signing out user:", error);
                    });
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
                        // Show the remove button for the food item
                        const removeBtn = document.querySelector(`.remove-from-cart-btn[data-id="${foodId}"]`);
                        if (removeBtn) {
                            removeBtn.style.display = 'inline-block'; // Show the remove button
                        }
                    }
                });
            });

            // Add event listener to remove from cart buttons
            const removeFromCartBtns = document.querySelectorAll(".remove-from-cart-btn");
            console.log("Remove from cart buttons:", removeFromCartBtns);

            removeFromCartBtns.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    console.log("Remove from cart button clicked");

                    const foodId = parseInt(e.target.dataset.id);
                    cart = cart.filter((f) => f.id !== foodId); // Remove the food item from the cart
                    updateCart();
                    // Hide the remove button for the food item
                    e.target.style.display = 'none';
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
                    <span>${food.name}</span> x €${food.price}
                `;
                    cartList.appendChild(cartItem);
                    total += food.price;
                });
                totalPriceElement.textContent = `Total Price: €${total.toFixed(2)}`;
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
                    const statsRef = doc(db, "users", user.uid);
                    const stats = collection(statsRef, "stats");
                    const currentTime = new Date();
                    addDoc(ordersRef, {
                        cart: cart,
                        orderready: false,
                        total: totalPrice,
                        time: currentTime,
                    })
                        .then(() => {
                            return addDoc(stats, {
                                cart: cart,
                                total: totalPrice,
                                time: currentTime,
                            });
                        })
                        .then(() => {
                            console.log("Order and stats saved to Firestore successfully.");
                            alert("Order placed successfully!");
                            cart = [];
                            updateCart();
                        })
                        .catch((error) => {
                            console.error("Error saving order or stats to Firestore:", error);
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
    async function contaordini(classNames) {
        let totalCount = 0;
        for (const className of classNames) {
            const collectionPath = `orders/${className}/orders`;
            const collectionRef = collection(db, collectionPath);
            const querySnapshot = await getDocs(collectionRef);
            const count = querySnapshot.size;
            //console.log(`Collection ${collectionPath} has ${count} documents.`);
            totalCount += count;
        }
        const tot = document.getElementById('tot_orders');
        tot.innerHTML = `Ordini Toatale: ${totalCount}`;
        console.log(`Total orders count: ${totalCount}`);
        return totalCount;
    }
    const classNames = ["2IE", "1EA", "1IA", "1IB", "1IC", "1ID", "1IE", "1IF", "1IG", "1MA", "1MB", "2IA", "2IB", "2IC", "2ID", "2IF", "2IG", "2IH", "2MA", "2MB", "3IA", "3IB", "3IC", "3ID", "3IF", "3IG", "3MA", "3MB", "3UA", "4IA", "4IB", "4IC", "4ID", "4IF", "4MA", "4MB", "4UA", "5EA", "5IB", "5IA", "5IC", "5ID", "5IE", "5IF", "5MA"];
    contaordini(classNames).catch(console.error);
    async function totalmoney(classNames) {
        let totalCount = 0;
        for (const className of classNames) {
            const collectionPath = `orders/${className}/orders`;
            const collectionRef = collection(db, collectionPath);
            const querySnapshot = await getDocs(collectionRef);
            querySnapshot.forEach((doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    if (data.total !== undefined) {
                        totalCount += data.total;
                    }
                }
            });
        }
        const tot = document.getElementById('tot_money');
        tot.innerHTML = `Guadagno totale: ${totalCount.toFixed(2)} €`;
        console.log(`Total revenue: ${totalCount} €`);
        return totalCount;
    }
    totalmoney(classNames).catch(console.error);

    // Draw the charts
    const onChartLoad = function () {
        const chart = this,
            series = chart.series[0];

        setInterval(function () {
            const x = (new Date()).getTime(),
                y = Math.random();

            series.addPoint([x, y], true, true);
        }, 1000);
    };
    const data = (function () {
        const data = [];
        const time = new Date().getTime();

        for (let i = -19; i <= 0; i += 1) {
            data.push({
                x: time + i * 1000,
                y: Math.random()
            });
        }
        return data;
    }());
    Highcharts.addEvent(Highcharts.Series, 'addPoint', e => {
        const point = e.point,
            series = e.target;

        if (!series.pulse) {
            series.pulse = series.chart.renderer.circle()
                .add(series.markerGroup);
        }

        setTimeout(() => {
            series.pulse
                .attr({
                    x: series.xAxis.toPixels(point.x, true),
                    y: series.yAxis.toPixels(point.y, true),
                    r: series.options.marker.radius,
                    opacity: 1,
                    fill: series.color
                })
                .animate({
                    r: 20,
                    opacity: 0
                }, {
                    duration: 1000
                });
        }, 1);
    });


    Highcharts.chart('chart', {
        chart: {
            type: 'spline',
            events: {
                load: onChartLoad
            }
        },

        time: {
            useUTC: false
        },

        title: {
            text: 'Live random data'
        },

        accessibility: {
            announceNewData: {
                enabled: true,
                minAnnounceInterval: 15000,
                announcementFormatter: function (allSeries, newSeries, newPoint) {
                    if (newPoint) {
                        return 'New point added. Value: ' + newPoint.y;
                    }
                    return false;
                }
            }
        },

        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxPadding: 0.1
        },

        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [
                {
                    value: 0,
                    width: 1,
                    color: '#808080'
                }
            ]
        },

        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
        },

        legend: {
            enabled: false
        },

        exporting: {
            enabled: false
        },

        series: [
            {
                name: 'Random data',
                lineWidth: 2,
                color: Highcharts.getOptions().colors[2],
                data
            }
        ]
    });
}

function losess() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            async function lose(classNames) {
                let totalCount = 0;
                const collectionPath = `users/${user.uid}/stats`;
                const collectionRef = collection(db, collectionPath);
                const querySnapshot = await getDocs(collectionRef);
                querySnapshot.forEach((doc) => {
                    if (doc.exists()) {
                        const data = doc.data();
                        if (data.total !== undefined) {
                            totalCount += data.total;
                        }
                    }
                });
                const tot = document.getElementById('lose');
                tot.innerHTML = `Spese totali: ${totalCount}`;
                console.log(`Total expenses: ${totalCount}`);
                return totalCount;
            }
            const classNames = ["2IE", "1EA", "1IA", "1IB", "1IC", "1ID", "1IE", "1IF", "1IG", "1MA", "1MB", "2IA", "2IB", "2IC", "2ID", "2IF", "2IG", "2IH", "2MA", "2MB", "3IA", "3IB", "3IC", "3ID", "3IF", "3IG", "3MA", "3MB", "3UA", "4IA", "4IB", "4IC", "4ID", "4IF", "4MA", "4MB", "4UA", "5EA", "5IB", "5IA", "5IC", "5ID", "5IE", "5IF", "5MA"];
            lose(classNames).catch(console.error);
        } else {
            alert("Anauthorized user");
            console.log("GO Back")
        }
    });
}