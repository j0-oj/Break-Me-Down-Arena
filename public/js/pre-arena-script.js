import { getCookieValue } from "./cookie-cutter.js";

async function getCurrentRoleOfPlayer(lobbyID, UUID) {

    let role = "";

    try {
        // Request for user information via UUID
        let response = await fetch(
            `php-script/get_player_role.php?channelID=${lobbyID}&UUID=${UUID}`,
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
        role           = jsonObject.role;

    } catch (error) {
        console.error("Error:", error);
    }

    return role;
}

async function getNumberOfPoints(lobbyID) {

    let points = 0;

    try {
        // Request for user information via UUID
        let response = await fetch(
            `php-script/get_points.php?channelID=${lobbyID}`,
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
        points         = jsonObject.points;

    } catch (error) {
        console.error("Error:", error);
    }

    return points;
}

function generateRoomsBasedOnPoints(points) {

    let generatedHTMLString = "";

    for(let count = 1; count <= points; count++) {
        let content = `
            <form>
                <div class="row mb-3">
                    <h1 class="form-label-wrapper">Room Creation Form #${count}</h1>
                </div>
                <div class="row mb-3">
                    <label class="form-label-wrapper form-label" for="description">Title Name</label>
                    <input class="form-control" id="title" type="text">
                </div>
                <div class="row mb-3">
                    <div class="col-3 p-0 pe-2">
                        <label for="formFile" class="form-label-wrapper form-label">File</label>
                        <input class="form-control" id="fileInput" type="file">
                    </div>
                    <div class="col-9 p-0 ps-2">
                        <label class="form-label-wrapper form-label" for="flagAnswer">Flag Answer</label>
                        <input class="form-control" id="flagAnswer" type="text">
                    </div>
                </div>
                <div class="row mb-3">
                    <label class="form-label-wrapper form-label" for="description">Flag Description</label>
                    <textarea class="form-control" id="description" rows="3"></textarea>
                </div>
            </form>
        `;

        generatedHTMLString = generatedHTMLString + " " + content;
    }

    return generatedHTMLString;

}

async function createKingDefenderContent(idOfMainContainer, lobbyID) {

    let mainSection = document.getElementById(idOfMainContainer);

    let points = await getNumberOfPoints(lobbyID);

    let generatedHTMLString = generateRoomsBasedOnPoints(points);

    let content = `
        <div class="row">
            <div class="container py-3">
                ${generatedHTMLString}
            </div>
        </div>
        <div class="row mb-3">
            <button class="btn btn-primary w-auto" id="submitRoom">Start Game</button>
        </div>
    `;

    mainSection.insertAdjacentHTML("afterbegin", content);
}

function createAttackerOrDefenderContent(idOfMainContainer) {

    let mainSection = document.getElementById(idOfMainContainer);

    let content = `
        <div class="container min-vh-100 d-flex justify-content-center align-items-center">
            <h1 class="text-center mx-2">Waiting for rooms to finish...</h1>
            <div class="spinner-border" style="width: 2.5rem; height: 2.5rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;

    mainSection.insertAdjacentHTML("afterbegin", content);
}

function createAddRoomButtonEvent(idOfMainContainer, lobby_id) {

    let addRoomButton = document.getElementById("submitRoom");

    addRoomButton.addEventListener(
        "click",
        async(event) => {
            event.preventDefault();
            let listOfFormValues = getListOfFormData(idOfMainContainer);
            let state = await addRoomToTable(listOfFormValues, lobby_id);
            if(state === "success") {
                // Set Game start to true
                await setGameArenaAsStarted(lobby_id);
                // Redirect to arena page
                redirectToArenaPage();
            }
        },
        false  
    );
}

function getListOfFormData(idOfMainContainer) {

    let mainSection = document.getElementById(idOfMainContainer);

    let listOfForm = mainSection.getElementsByTagName("form");

    let numberOfForm = listOfForm.length;

    let listOfFormValues = [];

    for(let index = 0; index < numberOfForm; index++) {
        let titleNameInput   = listOfForm[index]["title"];
        let fileInput        = listOfForm[index]["fileInput"];
        let flagAnswerInput  = listOfForm[index]["flagAnswer"];
        let descriptionInput = listOfForm[index]["description"];

        let titleName        = titleNameInput.value;
        let file             = fileInput.files[0];
        let flagAnswer       = flagAnswerInput.value;
        let description      = descriptionInput.value;

        let formValues       = [titleName, description, flagAnswer, file];

        listOfFormValues.push(formValues);
    }

    return listOfFormValues;
}

async function addRoomToTable(listOfFormValues, lobby_id) { 

    let state         = "";
    let numberOfForms = listOfFormValues.length;


    for(let count = 0; count < numberOfForms; count++) {

        try {
            // Create a data object with the form data
            let formData = new FormData();
            formData.append("channelID", lobby_id);
            formData.append("title", listOfFormValues[count][0]);
            formData.append("flagDescription", listOfFormValues[count][1]);
            formData.append("flagAnswer", listOfFormValues[count][2]);
            formData.append("flagFile", listOfFormValues[count][3]);
        

            // Validate user credentials
            let response = await fetch(
                "php-script/add_room.php",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData
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
    }

    return state;
}

async function setGameArenaAsStarted(lobby_id) {
    // Create a data object with the form data
    let formData = new URLSearchParams();
    formData.append("channelID", lobby_id);

    try {
        // Validate user credentials
        let response = await fetch(
            "php-script/update_arena_game_start.php",
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
    }
    catch(error) {
        console.error("Error:", error);
    };
}

function redirectToArenaPage() {
    window.location.href = "arena.html";
}

async function delay( ms, state = null ) {
    return new Promise( ( resolve, reject ) => {
        window.setTimeout( () => resolve( state ), ms );
    } );
}

async function requestIfGameHasStarted(lobbyID) {

    let state = "";

    try {
        let response = await fetch(
            `php-script/get_state_of_has_game_started.php?channelID=${lobbyID}`,
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

async function hasGameStarted(lobbyID) {

    try {
        while(true) {

            let state = await requestIfGameHasStarted(lobbyID);

            if(state === "True") {
                redirectToArenaPage();
            }
            else {
                console.log("Game has not started; No redirect");
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

async function main() {

    let UUID    = getCookieValue("UUID");
    let lobbyID = getCookieValue("lobby_id");

    // Get current player's role before deciding what to display
    let role    = await getCurrentRoleOfPlayer(lobbyID, UUID);

    if(role === "KING-DEFENDER") {
        await createKingDefenderContent("main-content", lobbyID);
    }
    else {
        createAttackerOrDefenderContent("main-content");
    }

    if(role === "KING-DEFENDER") {
        // Set button event that adds rooms then redirect to arena.html
        createAddRoomButtonEvent("main-content", lobbyID);
    }
    else {
        // Set time listener for ready game state then redirect to arena.html
        await hasGameStarted(lobbyID);
    }

}

main();
