import { setCookieValue } from "./cookie-cutter.js";

const arenaPromptSection = document.getElementById("arenaPrompt");

const joinALobbySection = `
    <div class="container arena-wrapper d-flex justify-content-center align-items-center">
        <form>
            <div class="row mx-0">
                <h4 class="p-0">Join an existing arena created by your friends and play!</h4>
            </div>
            <div class="row mx-0">
                <label class="form-label-wrapper form-label" for="channelID">Enter Channel ID</label>
                <div class="col p-0 pe-2">
                    <input class="form-control" id="channelID" type="text" placeholder="Channel ID">
                </div>
                <div class="col p-0 ps-2">
                    <button class="btn btn-outline-light" id="joinArena">Join</button>
                </div>
            </div>
        </form>
    </div>
`;

const createALobbySection = `
    <div class="container arena-wrapper d-flex justify-content-center align-items-center">
        <form>
            <div class="row mx-0 mb-1">
                <h4 class="p-0">Start your game play with friends by creating an Arena!</h4>
            </div>
            <div class="row mx-0">
                <button class="btn btn-outline-light w-auto" id="createNewLobby">Create a Lobby</button>
            </div>
        </form>
    </div>
`;

function createJoinLobbySection() {
    // Remove any child nodes first
    if(arenaPromptSection.hasChildNodes()) {
        while(arenaPromptSection.firstChild) {
            arenaPromptSection.removeChild(arenaPromptSection.firstChild);
        }
    }
    // Insert join arena section
    arenaPromptSection.insertAdjacentHTML("afterbegin", joinALobbySection);

    // Set create a join lobby button that will send client to "join_lobby.html"
    let createJoinLobbyButton = document.getElementById("joinArena");
    createJoinLobbyButton.addEventListener(
        "click",
        (event) => {
            event.preventDefault();
            let lobby_id = document.getElementById("channelID").value;
            setCookieValue("lobby_id", lobby_id);
            window.location.href = "http://localhost/join_lobby.html";
        },
        false
    );
}

function createNewLobbySection() {
    // Remove any child nodes first
    if(arenaPromptSection.hasChildNodes()) {
        while(arenaPromptSection.firstChild) {
            arenaPromptSection.removeChild(arenaPromptSection.firstChild);
        }
    }
    // Insert join arena section
    arenaPromptSection.insertAdjacentHTML("afterbegin", createALobbySection);

    // Set create a lobby button that will send client to "create_lobby.html"
    let createNewLobbyButton = document.getElementById("createNewLobby");
    createNewLobbyButton.addEventListener(
        "click",
        (event) => {
            event.preventDefault();
            window.location.href = "http://localhost/create_lobby.html";
        },
        false
    );
}

// Set joinALobbyButton set prompt to joinALobbySection
let joinALobbyButton = document.getElementById("join");
let defaultEvent = joinALobbyButton.addEventListener(
    "click",
    (event) => {
        event.preventDefault();
        createJoinLobbySection();
    },
    false
);

// Set createALobbyButton set prompt to createALobbySection
let createALobbyButton = document.getElementById("create");
createALobbyButton.addEventListener(
    "click",
    (event) => {
        event.preventDefault();
        createNewLobbySection();
    },
    false
);

// Create the join arena section and add it to arenaPrompt by default
// arenaPromptSection.insertAdjacentHTML("afterbegin", joinALobbySection);
createJoinLobbySection();

