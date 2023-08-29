import { setCookieValue, getCookieValue } from "./cookie-cutter.js";

const playerListContent = document.getElementById("playerList");

async function getLobbyID() {

    let lobby_id = "";

    try {
        // Request Channel ID from server
        let response = await fetch(
            "php-script/get_uuid.php",
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
        lobby_id       = jsonObject.channel_id;

        setCookieValue("lobby_id", lobby_id);
    } catch (error) {
        console.error("Error:", error);
    }

    return lobby_id;
}

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

async function addArenaWithLobbyID(lobby_id) {

    let state = "";

    // Create a data object with the form data
    let formData = new URLSearchParams();
    formData.append("channelID", lobby_id);

    try {
        // Validate user credentials
        let response = await fetch(
            "php-script/add_arena.php",
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

function displayLobbyID(lobbyID) {
    let lobbyIdDisplay = document.getElementById("createdLobbyID");
    lobbyIdDisplay.innerHTML = lobbyID;
}

async function copyToClipboard(textToCopy) {
    // Navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
    } 
    else {
        // Use the 'out of viewport hidden text area' trick
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
            
        // Move textarea out of the viewport so it's not visible
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
            
        document.body.prepend(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (error) {
            console.error(error);
        } finally {
            textArea.remove();
        }
    }
}

function copyLobbyID(lobbyID) {
    let copyIDButton = document.getElementById("copyID");

    copyIDButton.addEventListener(
        "click",
        async (event) => {
            event.preventDefault();
            await copyToClipboard(lobbyID);
            alert("Copied Lobby ID");
        },
        false);
}

async function submitLobbySettings() {
    let defenderLimit = document.getElementById("defenderLimit").value;
    let attackerLimit = document.getElementById("attackerLimit").value;
    let timeLimit     = document.getElementById("timeLimit").value;
    let points        = document.getElementById("points").value;
    let lobbyID       = getCookieValue("lobby_id");

    let state = "";

    // Create a data object with the form data
    let formData = new URLSearchParams();
    formData.append("defenderLimit", defenderLimit);
    formData.append("attackerLimit", attackerLimit);
    formData.append("timeLimit", timeLimit);
    formData.append("points", points);
    formData.append("channelID", lobbyID);

    try {
        // Validate user credentials
        let response = await fetch(
            "php-script/add_lobby_settings.php",
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

function redirectToRolesPage() {
    window.location.href = "get_roles_lobby.html";
}

function setSubmitSettingsButton() {
    let submitButton = document.getElementById("startArena");

    submitButton.addEventListener(
        "click",
        async (event) => {
            event.preventDefault();
            let state = "";

            state = await submitLobbySettings();

            if(state === "success") {
                redirectToRolesPage();
            }
        },
        false
    );
}

async function main() {
    // Setup lobby ID and add current client to arena_player as NIL state
    let state   = "";
    let lobbyID = await getLobbyID();
    let userID  = await getCurrentUserID();

    state = await addArenaWithLobbyID(lobbyID);
    if(state === "success") {
        state = await addPlayertoLobby(userID, lobbyID);
    }
    else {
        console.error("Issued occured creating arena");
    }

    // Setup is finish continue on
    if(state === "success") {
        // Display Lobby ID
        displayLobbyID(lobbyID);
        // Set Copy Button
        copyLobbyID(lobbyID);
        // Set Start Arena Button
        setSubmitSettingsButton();
        // Updates list every 5 seconds
        updatePlayerList(lobbyID);
    }
}

main();