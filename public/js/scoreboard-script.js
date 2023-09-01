import { getCookieValue, setCookieValue } from "./cookie-cutter.js";

function generateScoreBoard() {

    let content = `
        <div class="row">
            <div class="container min-vh-100 flex-column d-flex justify-content-center align-items-center">
                <div class="mb-3">
                    <h1 class="text-center m-0">Final Score</h1>
                </div>
                <div class="mb-3">
                    <h1 class="text-center m-0">Defender VS Attacker</h1>
                </div>
                <div class="mb-3">
                    <h1 class="text-center m-0" id="scoreboardContent">0 : 0</h1>
                </div>
                <div class="mb-3">
                    <button class="btn btn-primary w-auto" id="exit">Exit Arena</button>
                </div>
            </div>
        </div>
    `;

    return content;

}

function createScoreboardContent(idOfMainContainer) {

    let mainSection = document.getElementById(idOfMainContainer);

    let generateHTMLScoreBoard = generateScoreBoard();

    let content = `
        ${generateHTMLScoreBoard}
    `;

    mainSection.insertAdjacentHTML("afterbegin", content);
}

async function getDefenderAndAttackerScore(lobbyID) {

    let points = [];

    try {
        // Request for user information via UUID
        let response = await fetch(
            `php-script/get_defender_and_attacker_points.php?channelID=${lobbyID}`,
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
        points.push(jsonObject.defenderPoints);
        points.push(jsonObject.attackerPoints);

    } catch (error) {
        console.error("Error:", error);
    }

    return points;

}

async function delay( ms, state = null ) {
    return new Promise( ( resolve, reject ) => {
        window.setTimeout( () => resolve( state ), ms );
    } );
}

async function updateScoreboard(lobbyID) {
    try {
        while(true) {

            let points = await getDefenderAndAttackerScore(lobbyID);

            let scoreboardContent = document.getElementById("scoreboardContent");

            scoreboardContent.innerHTML = `${points[0]} : ${points[1]}`;

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

function redirectToScoreboardPage() {
    window.location.href = "dashboard.html";
}

function setReturnToMainMenu() {
    let exitButton = document.getElementById("exit");

    exitButton.addEventListener(
        "click",
        (event) => {
            event.preventDefault();

            setCookieValue("lobby_id", "");
            setCookieValue("timer", "0");
            redirectToScoreboardPage();
        },
        false
    );

}

async function main() {

    let UUID    = getCookieValue("UUID");
    let lobbyID = getCookieValue("lobby_id");

    createScoreboardContent("main-content", lobbyID);

    // Create a timer interval that updates the scoreboard (5 seconds)
    updateScoreboard(lobbyID);

    setReturnToMainMenu();
}

main();