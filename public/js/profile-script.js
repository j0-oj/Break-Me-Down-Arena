import {getCookieValue} from './cookie-cutter.js';

async function geUserData (UUID) {
    let userData = [];

    try {
        // Request for user information via UUID
        let response = await fetch(
            `php-script/get_user.php?UUID=${UUID}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data       = await response.text();
        let jsonObject = JSON.parse(data);

        let userID    = jsonObject.userID;
        let username  = jsonObject.username;
        let firstName = jsonObject.firstName;
        let lastName  = jsonObject.lastName;
        let email     = jsonObject.email;

        userData.push(userID);
        userData.push(username);
        userData.push(firstName);
        userData.push(lastName);
        userData.push(email);

    } catch (error) {
        console.error("Error:", error);
    }

    return userData;
}

function retrieveForm (userData) {
    let usernameInput  = document.getElementById("username");
    let firstNameInput = document.getElementById("firstName");
    let lastNameInput  = document.getElementById("lastName");
    let emailInput     = document.getElementById("email");

    let username  = userData[1];
    let firstName = userData[2];
    let lastName  = userData[3];
    let email     = userData[4];

    usernameInput.value  = username;
    firstNameInput.value = firstName;
    lastNameInput.value  = lastName;
    emailInput.value     = email;

} 

async function updateUserDetail (mode, information, userID) {

    let state = "";

    // Create a data object with the form data
    let formData = new URLSearchParams();
    
    if (mode === "username") {
        formData.append("username", information);
        formData.append("userID", userID);
    }
    if (mode === "firstName") {
        formData.append("firstName", information);
        formData.append("userID", userID);
    }
    if (mode === "lastName") {
        formData.append("lastName", information);
        formData.append("userID", userID);
    }
    if (mode === "email") {   
        formData.append("email", information);
        formData.append("userID", userID);
    }
    if (mode === "password") {
        formData.append("userPassword", information);
        formData.append("userID", userID);
    }

    try {
        // Request for user information via UUID
        let response = await fetch(
            "php-script/update_user.php",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }, 
                body: formData.toString()
            }
        );
        let data       = await response.text();
        let jsonObject = JSON.parse(data);
        state          = jsonObject.state;

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        } 

    } catch (error) {
        console.error("Error:", error);
    }

    return state;

}

function submitEvent (userData) {
    let submitButton = document.getElementById("submit");

    submitButton.addEventListener(
        "click",
        async (event) => {
            event.preventDefault();
            let newUsername     = document.getElementById("username").value;
            let newFirstName    = document.getElementById("firstName").value;
            let newLastName     = document.getElementById("lastName").value;
            let newEmail        = document.getElementById("email").value;
            let password        = document.getElementById("userPassword").value;
            let confirmPassword = document.getElementById("confirmPassword").value;

            let userID    = userData[0];
            let username  = userData[1];
            let firstName = userData[2];
            let lastName  = userData[3];
            let email     = userData[4];

            let state = "";

            if (newUsername !== username) {
                state = await updateUserDetail("username", newUsername, userID);
            }
            if (newFirstName !== firstName) {
                state = await updateUserDetail("firstName", newFirstName, userID);
            }
            if (newLastName !== lastName) {
                state = await updateUserDetail("lastName", newLastName, userID);
            }
            if (newEmail !== email) {   
                state = await updateUserDetail("email", newEmail, userID);
            }
            if (password.length > 0 ) {
                if (password === confirmPassword) {
                    state = await updateUserDetail("password", password, userID);
                }
            }

            if (state === "success") {
                alert("Update successful");
            }

        },
        false
    );
}


async function main () {
    let UUID = getCookieValue("UUID");
    let userData = await geUserData(UUID);

    // retrieve user data from database and update form with it
    retrieveForm(userData);
    submitEvent(userData);
}

main();
