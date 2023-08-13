const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitButton  = document.getElementById("submit");

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
        let state = "";
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
            console.log(data);
        })
        .catch(error => {
            console.error("Error:", error)
        });
        event.preventDefault();
    },
    false
);