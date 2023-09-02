import { getCookieValue, setCookieValue } from "./cookie-cutter.js";

const playerListContent = document.getElementById("playerList");

async function getCurrentUserID() {

    let userID = "";

    try {
        // Request for user information via UUID
        let response = await fetch(
            `php-script/get_user.php?UUID=${getCookieValue("UUID")}`,
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
        userID         = jsonObject.userID;

    } catch (error) {
        console.error("Error:", error);
    }

    return userID;
}

async function addPlayertoLobby(userID, lobby_id) {

    let state = "";

    // Create a data object with the form data
    let formData = new URLSearchParams();
    formData.append("userID", userID);
    formData.append("channelID", lobby_id)

    try {
        // Validate user credentials
        let response = await fetch(
            "php-script/add_player.php",
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
        state          = jsonObject.state;
        
    }
    catch(error) {
        console.error("Error:", error);
    };

    return state;
}

async function requestPlayerViaLobbyID(lobbyID) {

    let dataList = [];

    try {
        // Retrieve list of players
        let response = await fetch(
            `php-script/get_player_list.php?channelID=${lobbyID}`,
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

        let data = await response.text();
        dataList = JSON.parse(data);
        
    }
    catch(error) {
        console.error("Error:", error);
    };

    return dataList;
}

async function delay( ms, state = null ) {
    return new Promise( ( resolve, reject ) => {
        window.setTimeout( () => resolve( state ), ms );
    } );
}

async function updatePlayerList(lobbyID) {
    try {
        let currentLengthOfPlayer = 0;

        while(true) {

            // let playerList = await requestPlayerViaLobbyID("f40b880f-d316-4caf-849f-fd60492ea440");
            let playerList = await requestPlayerViaLobbyID(lobbyID);

            let lengthOfPlayer = playerList.length;

            if(currentLengthOfPlayer !== lengthOfPlayer) {
                 // Create list of <li> from remarks
                let listOfPlayer = [];
                for(let index = 0; index < lengthOfPlayer; index++) {
                    let li = document.createElement("li");
                    li.innerHTML = playerList[index].username;
                    li.classList.add("list-group-item", "py-2");

                    // Insert element <li>
                    listOfPlayer.push(li);
                }

                // Remove any child nodes first
                if(playerListContent.hasChildNodes()) {
                    while(playerListContent.firstChild) {
                        playerListContent.removeChild(playerListContent.firstChild);
                    }
                }

                // Insert into playerListContent
                for(let index = 0; index < lengthOfPlayer; index++) {
                    playerListContent.appendChild(listOfPlayer[index]);
                }

                currentLengthOfPlayer = lengthOfPlayer;
            }
            else {
                console.log("No new players found");
            }

            await delay( 5 * 1000 );
        }
    }
    catch( err ) {
        console.error( "Error in myProgram: %o", err );
    }
    finally {
        await browser.close();
    }
}

async function requestIfSettingsHasBeenSet(lobbyID) {

    let state = "";

    try {
        // Retrieve list of players
        let response = await fetch(
            `php-script/get_state_of_has_settings_been_set.php?channelID=${lobbyID}`,
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
        
    }
    catch(error) {
        console.error("Error:", error);
    };

    return state;
}

async function hasSettingsBeenSet(lobbyID) {
    try {
        while(true) {

            let state = await requestIfSettingsHasBeenSet(lobbyID);

            if(state === "True") {
                redirectToRolesPage();
            }
            else {
                console.log("Settings has not been set; No redirect");
            }

            await delay( 3 * 1000 );
        }
    }
    catch( err ) {
        console.error( "Error in myProgram: %o", err );
    }
    finally {
        await browser.close();
    }
}

function redirectToRolesPage() {
    window.location.href = "get_roles_lobby.html";
}

async function main() {
    // Setup lobby ID and add current client to arena_player as NIL state
    let state   = "";
    let lobbyID = getCookieValue("lobby_id");
    let userID  = await getCurrentUserID();

    setCookieValue("timer", 0);

    state = await addPlayertoLobby(userID, lobbyID);

    // Setup is finish continue on
    if(state === "success") {
        // Updates list every 5 seconds
        updatePlayerList(lobbyID);
        // Check if lobby setup is finish every 3 seconds
        hasSettingsBeenSet(lobbyID);
    }
    else {
        console.error("Issued occured adding player");
    }
}

main();