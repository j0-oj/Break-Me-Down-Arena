import { getCookieValue, setCookieValue } from "./cookie-cutter.js";

async function checkIfUserExists(UUID) {

    let state = "";

    try {
        // Request for user information via UUID
        let response = await fetch(
            `php-script/does_user_exist.php?UUID=${UUID}`,
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
        state          = jsonObject.state;

    } catch (error) {
        console.error("Error:", error);
    }

    return state;
    
}

async function main() {

    let UUID = getCookieValue("UUID");

    let state = await checkIfUserExists(UUID);

    if(state !== "success") {
        setCookieValue("UUID", "");
        setCookieValue("lobby_id", "");
        setCookieValue("lobby_id", "0");
        window.location.href = "login.html";
    }

}

main();