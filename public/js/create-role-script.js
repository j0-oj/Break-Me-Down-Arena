import { getCookieValue } from "./cookie-cutter.js";

async function getNumberOfDefender(lobbyID) {

    let numberOfDefender = 0;

    try {
        // Request for user information via UUID
        let response = await fetch(
            `php-script/get_attacker_or_defender_number.php?channelID=${lobbyID}&role=defender`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
        
        // Check if response is ok or not (ok = 200) 
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Get data from response and parse it to JSON object 
        let data         = await response.text();
        let jsonObject   = JSON.parse(data);
        numberOfDefender = jsonObject.defenderLimit;

    } catch (error) {
        console.error("Error:", error);
    }

    return numberOfDefender;
}

async function getNumberOfAttacker(lobbyID) {

    let numberOfAttacker = 0;

    try {
        // Request for user information via UUID
        let response = await fetch(
            `php-script/get_attacker_or_defender_number.php?channelID=${lobbyID}&role=attacker`,
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

        let data         = await response.text();
        let jsonObject   = JSON.parse(data);
        numberOfAttacker = jsonObject.attackerLimit;

    } catch (error) {
        console.error("Error:", error);
    }

    return numberOfAttacker;
}

function createThreeColumns(idOfMainContainer) {
    let mainSection = document.getElementById(idOfMainContainer);

    let content = `
        <div class="row">
            <div class="col-4" id="leftSection">
            </div>
            <div class="col-4" id="middleSection">
            </div>
            <div class="col-4" id="rightSection">
            </div>
        </div>
    `;

    mainSection.insertAdjacentHTML("afterbegin", content);
}

function createTwoColumns(idOfMainContainer) {
    let mainSection = document.getElementById(idOfMainContainer);

    let content = `
        <div class="row">
            <div class="col-6" id="leftSection">
            </div>
            <div class="col-6" id="rightSection">
            </div>
        </div>
    `;

    mainSection.insertAdjacentHTML("afterbegin", content);
}

function createKingDefenderContent(containerName, numberOfPlayer) {
    let kingDefenderSection = document.getElementById(containerName);

    let content = `
        <div class="container min-vh-100 d-flex justify-content-center align-items-center">
            <form>
                <div class="row mb-3 row-wrapper">
                    <h2 class="text-center">King Defender</h1>
                </div>
                <div class="row mb-3 row-wrapper">
                    <i class="fa-solid fa-crown fa-2xl m-auto w-auto"></i>
                </div>
                <div class="row mb-3 row-wrapper">
                    <label class="form-label text-center" for="firstName">Number of Player</label>
                    <h6 class="text-center" id="numberOfKingDefender">0/${numberOfPlayer}</h6>
                </div>
                <div class="row mb-3 row-wrapper">
                    <button class="btn btn-primary w-50 mx-auto" id="selectKingDefender">Select</button>
                </div>
            </form>
        </div>
    `;

    kingDefenderSection.insertAdjacentHTML("afterbegin", content);
}

function createDefenderContent(containerName, numberOfPlayer) {
    let defenderSection = document.getElementById(containerName);

    let content = `
        <div class="container min-vh-100 d-flex justify-content-center align-items-center">
            <form>
                <div class="row mb-3 row-wrapper">
                    <h2 class="text-center">Defender</h1>
                </div>
                <div class="row mb-3 row-wrapper">
                    <i class="fa-solid fa-shield fa-2xl m-auto w-auto"></i>
                </div>
                <div class="row mb-3 row-wrapper">
                    <label class="form-label text-center" for="firstName">Number of Player</label>
                    <h6 class="text-center" id="numberOfDefender">0/${numberOfPlayer}</h6>
                </div>
                <div class="row mb-3 row-wrapper">
                    <button class="btn btn-primary w-50 mx-auto" id="selectDefender">Select</button>
                </div>
            </form>
        </div>
    `;

    defenderSection.insertAdjacentHTML("afterbegin", content);
}

function createAttackerContent(containerName, numberOfPlayer) {
    let attackerSection = document.getElementById(containerName);

    let content = `
        <div class="container min-vh-100 d-flex justify-content-center align-items-center">
            <form>
                <div class="row mb-3 row-wrapper">
                    <h2 class="text-center">Attacker</h1>
                </div>
                <div class="row mb-3 row-wrapper">
                    <i class="fa-solid fa-bolt fa-2xl m-auto w-auto"></i>
                </div>
                <div class="row mb-3 row-wrapper">
                    <label class="form-label text-center" for="firstName">Number of Player</label>
                    <h6 class="text-center" id="numberOfAttacker">0/${numberOfPlayer}</h6>
                </div>
                <div class="row mb-3 row-wrapper">
                    <button class="btn btn-primary w-50 mx-auto" id="selectAttacker">Select</button>
                </div>
            </form>
        </div>
    `;

    attackerSection.insertAdjacentHTML("afterbegin", content);
}

async function updateRole(UUID, channelID, role) {
    // Create a data object with the form data
    let formData = new URLSearchParams();
    formData.append("UUID", UUID);
    formData.append("channelID", channelID);
    formData.append("role", role);

    try {
        // Update Player
        let response = await fetch(
            "php-script/update_role.php",
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

function updateKingDefenderState(UUID, lobbyID, numberOfKingDefender) {

    let button = document.getElementById("selectKingDefender");

    button.addEventListener(
        "click",
        async (event) => {
            event.preventDefault();
            let newNumberOfKingDefender = await getKingDefenderCount(lobbyID);

            if(newNumberOfKingDefender !== numberOfKingDefender) {
                await updateRole(UUID, lobbyID, "KING-DEFENDER");
                console.log("Updated Role: King-Defender");
                redirectToPreArenaPage();
            }
            else {
                alert("No more space for King Defender!");
            }
        },
        false
    );
}

function updateDefenderState(UUID, lobbyID, numberOfDefender) {
    
    let button = document.getElementById("selectDefender");

    button.addEventListener(
        "click",
        async (event) => {
            event.preventDefault();
            let newNumberOfDefender = await getDefenderCount(lobbyID);

            if(newNumberOfDefender !== numberOfDefender) {
                await updateRole(UUID, lobbyID, "DEFENDER");
                console.log("Updated Role: Defender");
                redirectToPreArenaPage();
            }
            else {
                alert("No more space for Defender!");
            }
        },
        false
    );
}

function updateAttackerState(UUID, lobbyID, numberOfAttacker) {
    
    let button = document.getElementById("selectAttacker");

    button.addEventListener(
        "click",
        async (event) => {
            event.preventDefault();
            let newNumberOfAttacker = await getAttackerCount(lobbyID);

            if(newNumberOfAttacker !== numberOfAttacker) {
                await updateRole(UUID, lobbyID, "ATTACKER");
                console.log("Updated Role: Attacker");
                redirectToPreArenaPage();
            }
            else {
                alert("No more space for Attacker!");
            }
        },
        false
    );
}

function redirectToPreArenaPage() {
    window.location.href = "pre_arena.html";
}

async function getKingDefenderCount(lobbyID) {

    let kingDefenderCount = 0;

    try {
        // Update Player
        let response = await fetch(
            `php-script/get_player_role_count.php?channelID=${lobbyID}&role=king-defender`,
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

        let data          = await response.text();
        let jsonObject    = JSON.parse(data);
        kingDefenderCount = jsonObject.playerCount;
    }
    catch(error) {
        console.error("Error:", error);
    };

    return kingDefenderCount;
}

async function getDefenderCount(lobbyID) {

    let defenderCount = 0;

    try {
        // Update Player
        let response = await fetch(
            `php-script/get_player_role_count.php?channelID=${lobbyID}&role=defender`,
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
        defenderCount  = jsonObject.playerCount;
    }
    catch(error) {
        console.error("Error:", error);
    };

    return defenderCount;
}

async function getAttackerCount(lobbyID) {

    let attackerCount = 0;

    try {
        // Update Player
        let response = await fetch(
            `php-script/get_player_role_count.php?channelID=${lobbyID}&role=attacker`,
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
        attackerCount  = jsonObject.playerCount;
    }
    catch(error) {
        console.error("Error:", error);
    };

    return attackerCount;
}

async function delay( ms, state = null ) {
    return new Promise( ( resolve, reject ) => {
        window.setTimeout( () => resolve( state ), ms );
    } );
}

async function updateStateForThreeRoles(lobbyID, numberOfKingDefender, numberOfDefender, numberOfAttacker) {

    let currentNumberOfKingDefender = 0;
    let currentNumberOfDefender     = 0;
    let currentNumberOfAttacker     = 0;

    let labelOfKingDefender         = document.getElementById("numberOfKingDefender");
    let labelOfDefender             = document.getElementById("numberOfDefender");
    let labelOfAttacker             = document.getElementById("numberOfAttacker");

    try {

        while(true) {

            let newNumberOfKingDefender = await getKingDefenderCount(lobbyID);
            let newNumberOfDefender     = await getDefenderCount(lobbyID);
            let newNumberOfAttacker     = await getAttackerCount(lobbyID);

            if(currentNumberOfKingDefender !== newNumberOfKingDefender) {

                labelOfKingDefender.innerHTML = `${newNumberOfKingDefender}/${numberOfKingDefender}`;
                currentNumberOfKingDefender   = newNumberOfKingDefender;

            }
            if(currentNumberOfDefender !== newNumberOfDefender) {

                labelOfDefender.innerHTML = `${newNumberOfDefender}/${numberOfDefender}`;
                currentNumberOfDefender   = newNumberOfDefender;

            }
            if(currentNumberOfAttacker !== newNumberOfAttacker) {

                labelOfAttacker.innerHTML = `${newNumberOfAttacker}/${numberOfAttacker}`;
                currentNumberOfAttacker   = newNumberOfAttacker;

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

async function updateStateForTwoRoles(lobbyID, numberOfKingDefender, numberOfAttacker) {

    let currentNumberOfKingDefender = 0;
    let currentNumberOfAttacker     = 0;

    let labelOfKingDefender         = document.getElementById("numberOfKingDefender");
    let labelOfAttacker             = document.getElementById("numberOfAttacker");

    try {

        while(true) {

            let newNumberOfKingDefender = await getKingDefenderCount(lobbyID);
            let newNumberOfAttacker     = await getAttackerCount(lobbyID);

            if(currentNumberOfKingDefender !== newNumberOfKingDefender) {

                labelOfKingDefender.innerHTML = `${newNumberOfKingDefender}/${numberOfKingDefender}`;
                currentNumberOfKingDefender   = newNumberOfKingDefender;

            }
            if(currentNumberOfAttacker !== newNumberOfAttacker) {

                labelOfAttacker.innerHTML = `${newNumberOfAttacker}/${numberOfAttacker}`;
                currentNumberOfAttacker   = newNumberOfAttacker;

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

async function main() {

    let UUID                 = getCookieValue("UUID");
    let lobbyID              = getCookieValue("lobby_id");
    let numberOfKingDefender = 1;
    let numberOfDefender     = await getNumberOfDefender(lobbyID);
    let numberOfAttacker     = await getNumberOfAttacker(lobbyID);
    let state                = "";

    // Display roles
    if(numberOfDefender > 1) {
        numberOfDefender     = numberOfDefender - numberOfKingDefender;
        state                = "three-roles";
        createThreeColumns("main-content");
        createKingDefenderContent("leftSection", numberOfKingDefender)
        createDefenderContent("middleSection", numberOfDefender);
        createAttackerContent("rightSection", numberOfAttacker);
    }
    else {
        state = "two-roles";
        createTwoColumns("main-content");
        createKingDefenderContent("leftSection", numberOfKingDefender);
        createAttackerContent("rightSection", numberOfAttacker);
    }

    // Set button event
    if(state === "three-roles") {
        updateKingDefenderState(UUID, lobbyID, numberOfKingDefender);
        updateDefenderState(UUID, lobbyID, numberOfDefender);
        updateAttackerState(UUID, lobbyID, numberOfAttacker);
    }
    if(state === "two-roles") {
        updateKingDefenderState(UUID, lobbyID, numberOfKingDefender);
        updateAttackerState(UUID, lobbyID, numberOfAttacker);
    }

    // Set a 5 sec interval that checks for players
    if(state === "three-roles") {
        updateStateForThreeRoles(lobbyID, numberOfKingDefender, numberOfDefender, numberOfAttacker);
    }
    if(state === "two-roles") {
        updateStateForTwoRoles(lobbyID, numberOfKingDefender, numberOfAttacker);
    }
}

main();