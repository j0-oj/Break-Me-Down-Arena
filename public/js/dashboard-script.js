const arenaPromptSection = document.getElementById("arenaPrompt");

const joinAnArenaSection = `
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

const createAnArenaSection = `
    <div class="container arena-wrapper d-flex justify-content-center align-items-center">
        <form>
            <div class="row mx-0 mb-1">
                <h4 class="p-0">Start your game play with friends by creating an Arena!</h4>
            </div>
            <div class="row mx-0">
                <button class="btn btn-outline-light w-auto" id="createArena">Create a Lobby</button>
            </div>
        </form>
    </div>
`;

// Create the join arena section and add it to arenaPrompt by default
arenaPromptSection.insertAdjacentHTML("afterbegin", joinAnArenaSection);

// Set joinAnArenaButton set prompt to joinAnArenaSection
let joinAnArenaButton = document.getElementById("join");
joinAnArenaButton.addEventListener(
    "click",
    (event) => {
        event.preventDefault();
        // Remove any child nodes first
        if(arenaPromptSection.hasChildNodes()) {
            while(arenaPromptSection.firstChild) {
                arenaPromptSection.removeChild(arenaPromptSection.firstChild);
            }
        }
        // Insert join arena section
        arenaPromptSection.insertAdjacentHTML("afterbegin", joinAnArenaSection);
    },
    false
);

// Set createAnArenaButton set prompt to joinAnArenaSection
let createAnArenaButton = document.getElementById("create");
createAnArenaButton.addEventListener(
    "click",
    (event) => {
        event.preventDefault();
        // Remove any child nodes first
        if(arenaPromptSection.hasChildNodes()) {
            while(arenaPromptSection.firstChild) {
                arenaPromptSection.removeChild(arenaPromptSection.firstChild);
            }
        }
        // Insert join arena section
        arenaPromptSection.insertAdjacentHTML("afterbegin", createAnArenaSection);
    },
    false
);