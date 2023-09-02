import { getCookieValue, setCookieValue } from "./cookie-cutter.js";

function generateUserInformation() {

    let content = `
        <div class="row">
            <div class="mt-4 mb-1">
                <h5><b id="userTitle">foo</b>@BreakMeDown:/home$ cat welcome.txt</h5>
            </div>
        </div>
        <div class="row">
            <div class="mb-3">
                <h1><b>Get Cracking</b></h1>
            </div>
        </div>
        <div class="row">
            <div class="row">
                <div class="col-8">
                    <div class="row">
                        <div class="my-2">
                            <h5 class="m-0"><b>Recent Gameplays</b></h5>
                        </div>
                    </div>
                    <div class="row">
                        <div class="mb-3 mt-1">
                            <table class="table table-light table-bordered">
                                <thead>
                                    <tr>
                                    <th scope="col">Date of Game</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Points</th>
                                    <th scope="col">Result</th>
                                    </tr>
                                </thead> 
                                <tbody id="tableContent">                               
                                </tbody>                       
                            </table>
                        </div>
                    </div>
                </div>
                <div class="col-4 my-auto">
                    <div class="mb-2">
                        <h5 class="text-center m-0"><b>Total Game Count:</b></h5>
                    </div>
                    <div class="my-3">
                        <h1 class="text-center m-0"><b id="gameCount">0</b></h1>
                    </div>
                    <div class="mt-2">
                        <h5 class="text-center m-0"><b>Gameplays</b></h5>
                    </div> 
                </div>
            </div>
        </div>
    `;

    return content;

}

function generateArenaSection() {

    let content = `
        <div class="row">
            <div class="mb-3">
                <h1 class="text-center m-0"><b>Arena</b></h1>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-4 mb-auto">
                <div class="my-3 mx-2">
                    <button class="btn btn-outline-secondary w-100" id="join">Join a Lobby</button>
                </div>
                <div class="my-3 mx-2">
                    <button class="btn  btn-outline-secondary w-100" id="create">Create a Lobby</button>
                </div>
            </div>
            <div class="col-8">
                <div class="m-3" id="joinArenaSection">
                    <div class="mb-3">
                        <h5 class="m-0">Join an existing arena created by your friends and play!</h5>
                    </div>
                    <div class="my-3">
                        <label class="form-label-wrapper form-label" for="channelID">Enter Channel ID</label>
                        <div class="row">
                            <div class="col-sm-8">
                                <input class="form-control" id="channelID" type="text" placeholder="Channel ID">
                            </div>
                            <div class="col-sm-4">
                                <button class="btn btn-outline-secondary" id="joinArena">Join</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="m-3" id="createArenaSection">
                    <div class="mb-3">
                        <h5>Start your game play with friends by creating an Arena!</h5>
                    </div>
                    <div class="my-3">
                        <button class="btn btn-outline-secondary" id="createArena">Create</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    return content;
}

async function createDashBoardInformation(idOfMainContainer) {

    let mainSection = document.getElementById(idOfMainContainer);

    let generatedHTMLUserInformation = generateUserInformation();

    let generatedHTMLArenaSection = generateArenaSection();

    let content = `
        ${generatedHTMLUserInformation}
        ${generatedHTMLArenaSection}
    `;

    mainSection.insertAdjacentHTML("afterbegin", content);

}

function setDefaultArenaSection() {

    let createArenaHTMLSection = document.getElementById("createArenaSection");
    let joinArenaHTMLSection   = document.getElementById("joinArenaSection");
    
    createArenaHTMLSection.style.display = "none";
    joinArenaHTMLSection.style.display   = "block";

}

function addEventButtonToJoinAndCreate() {

    let createArenaHTMLSection = document.getElementById("createArenaSection");
    let joinArenaHTMLSection   = document.getElementById("joinArenaSection");

    let createArenaButton      = document.getElementById("create");
    let joinArenaButton        = document.getElementById("join");

    createArenaButton.addEventListener(
        "click",
        (event) => {
            event.preventDefault();
            createArenaHTMLSection.style.display = "block";
            joinArenaHTMLSection.style.display   = "none";
        },
        false
    );

    joinArenaButton.addEventListener(
        "click",
        (event) => {
            event.preventDefault();
            createArenaHTMLSection.style.display = "none";
            joinArenaHTMLSection.style.display   = "block";
        },
        false
    );

}

function addEventToRedirect() {

    let goToCreateLobbyButton = document.getElementById("createArena");
    let goToJoinLobbyButton   = document.getElementById("joinArena");

    goToCreateLobbyButton.addEventListener(
        "click",
        (event) => {
            event.preventDefault();
            window.location.href = "create_lobby.html";
        },
        false
    );

    goToJoinLobbyButton.addEventListener(
        "click",
        (event) => {
            event.preventDefault();

            let lobbyIDCookie = document.getElementById("channelID").value;
            setCookieValue("lobby_id", lobbyIDCookie);

            window.location.href = "join_lobby.html";
        },
        false
    );

}

async function getUsername(UUID) {

    let username = "";

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
        username         = jsonObject.username;

    } catch (error) {
        console.error("Error:", error);
    }

    return username;
    
}

async function getUserID(UUID) {

    let userID = "";

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
        userID         = jsonObject.userID;

    } catch (error) {
        console.error("Error:", error);
    }

    return userID;
    
}

function updateUsername(username) {

    let usernameLabel = document.getElementById("userTitle");
    usernameLabel.innerHTML = username;

}

async function getNumberOfGamesPlayed(userID) {
    
    let numberOfGames = 0;

    try {
        // Request for user information via UUID
        let response = await fetch(
            `php-script/get_number_of_games_played.php?userID=${userID}`,
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
        numberOfGames  = jsonObject.numberOfGames;

    } catch (error) {
        console.error("Error:", error);
    }

    return numberOfGames;
    
}

function updateTotalGamesPlayed(numberOfGames) {

    let usernameLabel = document.getElementById("gameCount");
    usernameLabel.innerHTML = numberOfGames;

}

async function getFiveRecentGamesPlayed(userID) {

    let listOfGame = [];

    try {
        // Request for user information via UUID
        let response = await fetch(
            `php-script/get_list_of_game_history.php?userID=${userID}`,
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

        let state = jsonObject[0].state;

        listOfGame.push(state)

        if(state === "success") {
            let totalCount    = jsonObject.length;

            for(let index = 1; index < totalCount; index++) {
                let dateOfGame   = jsonObject[index].dateOfGame;
                let gameRole     = jsonObject[index].gameRole;
                let pointsEarned = jsonObject[index].pointsEarned;
                let result       = jsonObject[index].result;

                let formValue       = [dateOfGame, gameRole, pointsEarned, result];

                listOfGame.push(formValue)
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }

    return listOfGame;
}

function updateTableHistory(listOfGames) {

    console.log(listOfGames);

    let tableHistoryContent = document.getElementById("tableContent");

    let historyContent = "";

    let state = listOfGames[0];

    if(state === "success") {
        for(let index = 1; index < listOfGames.length; index++) {

            let historyDetail = listOfGames[index];
    
            let dateOfGame   = historyDetail[0];
            let gameRole     = historyDetail[1];
            let pointsEarned = historyDetail[2];
            let result       = historyDetail[3];
    
            let content = `
                <tr>
                    <th scope="row">${dateOfGame}</th>
                    <td>${gameRole}</td>
                    <td>${pointsEarned}</td>
                    <td>${result}</td>
                </tr> 
            `;
    
            historyContent = historyContent + " " + content;
        }
    }
    else {
        let content = `
                <tr>
                    <th scope="row" colspan="4">NO GAMES FOUND</th>
                </tr> 
            `;

        historyContent = historyContent + " " + content;
    }

    tableHistoryContent.insertAdjacentHTML("afterbegin", historyContent);
}

async function main() {

    let UUID    = getCookieValue("UUID");

    // Must be set first before doing anything
    createDashBoardInformation("main-content");
    setDefaultArenaSection();

    // Get username of client & update dashboard
    let username = await getUsername(UUID);
    updateUsername(username);

    // Get total number of games played
    let userID = await getUserID(UUID);
    let numberOfGames = await getNumberOfGamesPlayed(userID);
    updateTotalGamesPlayed(numberOfGames);

    // Get game history stats
    let listOfGames = await getFiveRecentGamesPlayed(userID);
    updateTableHistory(listOfGames);

    // Add Listeners to the required buttons
    addEventButtonToJoinAndCreate();
    addEventToRedirect();

}

main();