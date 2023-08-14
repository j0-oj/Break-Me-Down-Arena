const usernameInput         = document.getElementById("username");
const passwordInput         = document.getElementById("password");
const submitButton          = document.getElementById("submit");
const remarkProviderSection = document.getElementById("remarkProviderSection");
const remarkProviderContent = document.getElementById("remarkProvider");

submitButton.addEventListener(
    "click",
    (event) => {
        let username = usernameInput.value;
        let password = passwordInput.value;

        // Create a data object with the form data
        let formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        // Validate user credentials
        fetch("php-script/validate_login.php", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        })
        .then((response) => {
            if(!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.text();
        })
        // Receieve JSON formatted data
        .then((data) => {
            let jsonObject = JSON.parse(data);
            let state      = jsonObject.state;
            let remark     = jsonObject.remark;
            let UUID       = jsonObject.UUID;

            // Set cookie if login is succesful
            if(state === "Successful") {
                document.cookie = `UUID=${UUID}`;
            }

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

            // Redirect if valid credential
            if(state === "Successful") {
                window.location.href = "http://localhost/register.html";
            }
        })
        .catch(error => {
            console.error("Error:", error)
        });
        event.preventDefault();
    },
    false
);