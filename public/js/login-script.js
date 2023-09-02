import { setCookieValue } from "./cookie-cutter.js";

const usernameInput         = document.getElementById("username");
const passwordInput         = document.getElementById("password");
const submitButton          = document.getElementById("submit");
const remarkProviderSection = document.getElementById("remarkProviderSection");
const remarkProviderContent = document.getElementById("remarkProvider");

async function validateLoginDetails() {
    let username = usernameInput.value;
    let password = passwordInput.value;
    let state    = "";

    // Create a data object with the form data
    let formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
        // Validate user credentials
        let response = await fetch(
            "php-script/validate_login.php",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData.toString()
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data       = await response.text();
        let jsonObject = JSON.parse(data);
        let remark     = jsonObject.remark;
        state          = jsonObject.state;

        // Set color of remark base on state
        let colourState = "";
        if(state === "Error") {
            colourState = "text-danger";
        }
        else {
            colourState = "text-success";
        }

        // Create list of <li> from remarks
        let listOfRemark = [];
        let lengthOfRemark = remark.length;
        for(let index = 0; index < lengthOfRemark; index++) {
            let li = document.createElement("li");
            li.innerHTML = remark[index];
            li.classList.add("list-group-item", colourState);

            // Insert element <li>
            listOfRemark.push(li);
        }

        // Remove any child nodes first
        if(remarkProviderContent.hasChildNodes()) {
            while(remarkProviderContent.firstChild) {
                remarkProviderContent.removeChild(remarkProviderContent.firstChild);
            }
        }

        // Insert into remarkProviderContent
        for(let index = 0; index < lengthOfRemark; index++) {
            remarkProviderContent.appendChild(listOfRemark[index]);
        }

        // Add padding to remarkProviderSection
        remarkProviderSection.classList.add("mb-3", "px-5");

    }
    catch(error) {
        console.error("Error:", error);
    };

    return state;
};

async function setClientCookie() {

    let username = usernameInput.value;
    let UUID     = "";

    try {
        // Request UUID from server
        let response = await fetch(
            `php-script/get_uuid_via_username.php?username=${username}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Get Channel ID from server
        let data       = await response.text();
        let jsonObject = JSON.parse(data);
        UUID           = jsonObject.UUID;

        // Set cookie
        setCookieValue("UUID", UUID);
        
    } catch(error) {
        console.error("Error:", error);
    };
};

submitButton.addEventListener(
    "click",
    (event) => {
        event.preventDefault();
        validateLoginDetails().then(
            state => {
                if(state === "Successful") {
                    setClientCookie().then(
                        () => {
                            window.location.href = "dashboard.html";
                        }
                    );
                }
            }
        );
    },
    false
);

setCookieValue("UUID", "");
setCookieValue("lobby_id", "");
setCookieValue("timer", 0);
