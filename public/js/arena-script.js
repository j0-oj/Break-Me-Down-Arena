import { getCookieValue, setCookieValue} from "./cookie-cutter.js";

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

async function getTimeLimit(lobbyID) {

    let timeLimit = 0;

    try {
        // Request for user information via UUID
        let response = await fetch(
            `php-script/get_time_limit.php?channelID=${lobbyID}`,
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
        timeLimit      = jsonObject.timeLimit;

    } catch (error) {
        console.error("Error:", error);
    }

    return timeLimit;

}

function generateTimeContent() {

    let content = `
        <div class="row">
            <div class="container timer-wrapper flex-column">
                <div class="timer-title-wrapper">
                    <h1 class="text-center m-0">Timer</h1>
                </div>
                <div class="timer-content-wrapper">
                    <h1 class="text-center m-0" id="timer-content">00:00</h1>
                </div>
            </div>
        </div>
    `;

    return content;
}

async function getListOfFormDetails(lobbyID) {

    let listOfFormDetails = [];

    try {
        let response = await fetch(
            `php-script/get_list_of_room_details.php?channelID=${lobbyID}`,
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

        let totalCount    = jsonObject.length;

        for(let index = 0; index < totalCount; index++) {
            let roomID          = jsonObject[index].roomID;
            let title           = jsonObject[index].title;
            let flagDescription = jsonObject[index].flagDescription;
            let nameOfFile      = jsonObject[index].nameOfFile;

            let formValue       = [roomID, title, flagDescription, nameOfFile];

            listOfFormDetails.push(formValue)
        }

    } catch (error) {
        console.error("Error:", error);
    }

    return listOfFormDetails;

}

function generateRoomsBasedOnFormDetails(listOfFormDetails) {

    let generatedHTMLString = "";

    let totalCount = listOfFormDetails.length;

    for(let count = 0; count < totalCount; count++) {

        let formDetails = listOfFormDetails[count];

        let roomID          = formDetails[0];
        let title           = formDetails[1];
        let flagDescription = formDetails[2];
        let nameOfFile      = formDetails[3];
        let fileName        = nameOfFile.split("/")[1];

        let linkToFile = function (nameOfFile, fileName) {

            let content = ``;

            if(nameOfFile !== "") {
                content = `
                    <div class="row mb-3">
                        <p class="form-label-wrapper m-0">File: 
                            <a href="${nameOfFile}" class="link-primary" download>${fileName}</a>
                        </p>
                    </div>
                `;
            }

            return content;
        }

        let content = `
            <form>
                <div class="row mb-3">
                    <h1 class="form-label-wrapper">Room #${count}</h1>
                    <input id=roomID value=${roomID} hidden>
                </div>
                <div class="row mb-3">
                    <h3 class="form-label-wrapper">Title: ${title}</h3>
                </div>
                <div class="row mb-3">
                    <h6 class="form-label-wrapper">${flagDescription}</h6>
                </div>
                ${linkToFile(nameOfFile, fileName)}
                <div class="row mb-3">
                    <label class="form-label-wrapper form-label" for="flagAnswer">Flag Answer</label>
                    <input class="form-control" id="flagAnswer" type="text" required>
                </div>
                <div class="row mb-3">
                    <button class="btn btn-primary w-auto submitAnswer">Submit Answer</button>
                </div>
            </form>
        `;

        generatedHTMLString = generatedHTMLString + " " + content;
    }

    return generatedHTMLString;

}

async function createAttackerContent(idOfMainContainer, lobbyID) {

    let mainSection = document.getElementById(idOfMainContainer);

    let listOfFormDetails = await getListOfFormDetails(lobbyID);

    let generatedHTMLTimer = generateTimeContent();

    let generatedHTMLString = generateRoomsBasedOnFormDetails(listOfFormDetails);

    let content = `
        ${generatedHTMLTimer}
        <div class="row">
            <div class="container py-3">
                ${generatedHTMLString}
            </div>
        </div>
    `;

    mainSection.insertAdjacentHTML("afterbegin", content);
}

async function submitAnswer(roomID, answerInput) {

    let state = "";

    // Create a data object with the form data
    let formData = new URLSearchParams();
    formData.append("roomID", roomID);
    formData.append("answerInput", answerInput)

    try {
        // Validate user credentials
        let response = await fetch(
            "php-script/update_room.php",
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

function disableButton(answerBtn) {
    answerBtn.setAttribute("disabled","disabled");
    answerBtn.classList.remove("btn-primary");
    answerBtn.classList.add("btn-outline-success");
    answerBtn.innerHTML = "Correct Answer";
}

function createSubmitAnswerButton() {

    let listOfSubmitButton = document.getElementsByClassName("submitAnswer");

    let numberOfButton = listOfSubmitButton.length;

    for(let index = 0; index < numberOfButton; index++) {
        let currentButton = listOfSubmitButton[index];
        currentButton.addEventListener(
            "click",
            async (event) => {
                event.preventDefault();

                let form        = event.target.parentNode.parentNode;
                let roomID      = form["roomID"].value;
                let answerInput = form["flagAnswer"].value;
                let answerBtn   = currentButton;
                
                // Submit answer to table
                let state = await submitAnswer(roomID, answerInput);

                // If successful replace button with "correct" h3
                if(state === "success") {
                    disableButton(answerBtn);
                    alert("Correct Answer");
                }
                // Else alert that value is 
                else {
                    alert("Wrong Answer");
                }
            },
            false
        );
    }

}

async function delay( ms, state = null ) {
    return new Promise( ( resolve, reject ) => {
        window.setTimeout( () => resolve( state ), ms );
    } );
}

async function createTimerContent(timeLimit) {

    let timeLimitInSeconds = getCookieValue("timer");

    if(getCookieValue("timer") === 0) {
        timeLimitInSeconds = timeLimit * 60;
    }
    
    let timerContent = document.getElementById("timer-content");

    try {
        while(true) {

            let minute = Math.trunc(timeLimitInSeconds / 60);
            let second = timeLimitInSeconds % 60;

            let minuteStr = minute.toString();
            let secondStr = second.toString();

            if(timeLimitInSeconds === -1) {
                setCookieValue("timer", 0);
                // Redirect to scoreboard.html
            }
            else {
                timerContent.innerHTML = `${minuteStr.padStart(2, "0")}:${secondStr.padStart(2, "0")}`;
                timeLimitInSeconds = timeLimitInSeconds - 1;
                setCookieValue("timer", timeLimitInSeconds);
            }

            await delay( 1000 );
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
    let role = await getCurrentRoleOfPlayer(lobbyID, UUID);

    // Get timeLimit of game
    let timeLimit = await getTimeLimit(lobbyID);

    if(getCookieValue("timer") === 0) {
        setCookieValue("timer", timeLimit * 60);
    }

    if(role === "ATTACKER") {
        await createAttackerContent("main-content", lobbyID);
    }
    else {

    }

    // Create timer with time limit
    createTimerContent(timeLimit);

    if(role === "ATTACKER") {
        // Set Submit Answer event for each button
        await createSubmitAnswerButton();
        // Create a timer interval that checks if all rooms has been solved then redirect to scoreboard


    }
    else {
        // Create a timer interval that updates the scoreboard

        // Create a timer interval that checks if game has been finished

    }

}

main();