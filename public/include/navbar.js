const navigationBar = `
    <nav class="navbar navbar-dark bg-dark navbar-expand-lg">
        <div class="container-fluid w-auto me-auto ms-0">
            <a class="navbar-brand" href="dashboard.html">Break Me Down</a>
        </div>
        <div class="container-fluid w-auto">
            <ul class="navbar-nav justify-content-center w-100">
                <li class="nav-item">
                    <a class="nav-link" href="dashboard.html#arena">Arena</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="https://break-me-down.vercel.app/">Tool Library</a>
                </li>
            </ul>
        </div>
        <div class="container-fluid w-auto me-0 ms-auto">
            <ul class="navbar-nav justify-content-center w-100">
                <li class="nav-item dropstart">
                    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" href="#">
                        More
                    </a>
                    <ul class="dropdown-menu dropdown-menu-right">
                        <li>
                            <a class="dropdown-item" href="profile.html">Edit Profile</a>
                        </li>
                        <li>
                            <button class="dropdown-item" type="button" id="signOutButton">Sign Out</button>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
`;


// Create the navigation bar and add it to header section
document.querySelector("header").insertAdjacentHTML("afterbegin", navigationBar);



let signOutButton = document.getElementById("signOutButton");
signOutButton.addEventListener(
    "click",
    (event) => {
        event.preventDefault();
        window.location.href = "login.html";
    },
    false
);