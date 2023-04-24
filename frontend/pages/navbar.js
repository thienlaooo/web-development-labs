// Create navigation bar elements
const nav = document.createElement("nav");
nav.innerHTML = `
        <a href="http://localhost:63342/web-development-labs/frontend/pages/home/home.html" class="logo"><img src="../../docs/assets/images/medicine-wellness-icon.png" alt="Pharmacy Logo"></a>
        <div class="burger-icon">&#9776;</div>
        <ul>
            <li><a href="http://localhost:63342/web-development-labs/frontend/pages/medicines/medicines.html">Medicines</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
        </ul>
        <div class="search-bar">
            <input type="text" placeholder="Search for medicines">
            <button>Search</button>
        </div>
        <div class="user-nav">
            ${sessionStorage.getItem('token') ? '<a href="http://localhost:63342/web-development-labs/frontend/pages/user/user.html" id="login-link">My Account</a>' +
    '<a href="http://localhost:63342/web-development-labs/frontend/pages/order/order.html" class="cart-icon"><img src="../../docs/assets/images/shopping-cart-icon.png" alt="Cart Icon"></a>' :
    '<a href="http://localhost:63342/web-development-labs/frontend/pages/login-register/login.html" id="login-link">Login</a>'}
            
        </div>
`;
const header = document.querySelector("header");
header.appendChild(nav);
