const navigationBar = `
    <nav class="navbar navbar-dark bg-dark navbar-expand-lg">
        <div class="container-fluid w-auto">
            <a class="navbar-brand" href="dashboard.html">Break Me Down</a>
        </div>
        <div class="container-fluid">
            <ul class="navbar-nav justify-content-center w-100">
                <li class="nav-item">
                    <a class="nav-link" href="dashboard.html#arena">Arena</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" href="#">
                        Tool Library
                    </a>
                    <ul class="dropdown-menu">
                        <li>
                            <a class="dropdown-item" href="#">Encryption Techniques</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#">Cracking Tools</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#">Sandbox</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="container-fluid w-auto">
            <button class="btn btn-outline-light" id="profile">Profile</button>
        </div>
    </nav>
`;


// Create the navigation bar and add it to header section
document.querySelector("header").insertAdjacentHTML("afterbegin", navigationBar);

// Set profile button to go to profile site
let profileButton = document.getElementById("profile");
profileButton.addEventListener(
    "click",
    (event) => {
        event.preventDefault();
        window.location.href = "http://localhost/profile.html";
    },
    false
);