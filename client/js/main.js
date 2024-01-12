// Create a WebSocket connection using Socket.IO
const socket = io("http://localhost:3005");
globalActiveArray = null;
globalResponseActive = false;
processEnd = false;
globalType = 0;

// Create a wrapper div element
const wrapper = document.createElement("div");

// Set the class name for styling
wrapper.className = "wrapper";

// Append the wrapper to the body
document.body.appendChild(wrapper);

// Create a chat box holder div element
const ChatBoxHeader = document.createElement("div");
ChatBoxHeader.className = "chat-box-header";

// Create a chat box header content holder
const chatBoxHeaderContent = document.createElement("div");
chatBoxHeaderContent.className = "chat-box-header-content";
ChatBoxHeader.appendChild(chatBoxHeaderContent);

// Create a chat box header title
const chatBoxHeaderTitle = document.createElement("div");
chatBoxHeaderTitle.id = "chat-box-header-title";
chatBoxHeaderTitle.textContent = "Telemedicine";
chatBoxHeaderTitle.style.display = "inline-block";

// Create a minimize button for the chat popup
const minimizeButton = document.createElement("div");
minimizeButton.id = "minimize-button";
minimizeButton.innerHTML = '<i class="fa-solid fa-window-minimize"></i>';
minimizeButton.style.cursor = "pointer";

// append the header title into header content
chatBoxHeaderContent.appendChild(chatBoxHeaderTitle);

// append the header minimize button  into header content
chatBoxHeaderContent.appendChild(minimizeButton);

// Create a chat box holder div element
const ChatBoxHolder = document.createElement("div");

// Set the class name for styling
ChatBoxHolder.className = "chat-box-holder";

// Create a chat holder div element
const ChatHolder = document.createElement("div");

// Set the class name for styling
ChatHolder.className = "chat-holder";

// Create a response paragraph element for displaying messages
const responseParagraph = document.createElement("div");

// Set an ID for manipulation
responseParagraph.id = "response";

// Create a div for condition selection
const conditionSelectionDiv = document.createElement("div");
conditionSelectionDiv.className = "conditionSelection";
ChatHolder.appendChild(conditionSelectionDiv);

// Create a form element for user input
const form = document.createElement("form");
form.id = "colorForm";
form.className = "form-holder";

// Create a div to hold the input field
const inputHolder = document.createElement("div");
inputHolder.className = "input-holder";

// Create an input element for user messages
const input = document.createElement("input");
input.id = "input";
input.type = "text";
input.className = "form-control";
input.placeholder = "Write your reply...";
input.required = true;

// Create a div for displaying typing indicator
const typing = document.createElement("div");
typing.id = "typing";
typing.className = "typing d-none";
typing.innerHTML = `Typing<span></span><span></span><span></span>`;

// Create a div to hold buttons
const btnHolder = document.createElement("div");
btnHolder.className = "btn-holder";

// Create the submit button
const submitButton = document.createElement("button");
submitButton.type = "submit";
const paperPlaneIcon = document.createElement("i");
paperPlaneIcon.classList = "fa-solid fa-paper-plane";
submitButton.appendChild(paperPlaneIcon);
submitButton.className = "btn btn-submit";
submitButton.id = "submit-button";

// Create the reset button
const resetButton = document.createElement("button");
resetButton.type = "button";
const arrowIcon = document.createElement("i");
arrowIcon.classList = "fa-solid fa-arrows-rotate";
resetButton.appendChild(arrowIcon);
resetButton.addEventListener("click", handleReset);
resetButton.className = "btn btn-reset";

// Append the input and submit button to the form
inputHolder.appendChild(input);
form.appendChild(inputHolder);
btnHolder.appendChild(resetButton);
btnHolder.appendChild(submitButton);
form.appendChild(btnHolder);

// Append elements to create the chat interface
wrapper.appendChild(ChatBoxHeader)
wrapper.appendChild(ChatBoxHolder);
ChatBoxHolder.appendChild(ChatHolder);
ChatHolder.appendChild(responseParagraph);
ChatBoxHolder.appendChild(typing);
ChatBoxHolder.appendChild(form);
form.addEventListener("submit", handleSubmit);

// Listen for typing events from the server and show/hide typing animation
socket.on("typing", (isTyping) => {
    const typingElement = document.getElementById("typing");
    if (isTyping) {
        typingElement.classList.remove("d-none"); // Show typing animation
    } else {
        typingElement.classList.add("d-none"); // Hide typing animation
    }
});

function showToast(message) {
    // Create a toast container element
    const toastContainer = document.createElement("div");
    toastContainer.classList.add("toast-container");

    // Create a toast message element
    const toastMessage = document.createElement("div");
    toastMessage.classList.add("toast-message");
    toastMessage.textContent = message;

    // Append the toast message to the toast container
    toastContainer.appendChild(toastMessage);

    // Append the toast container to the document body
    document.body.appendChild(toastContainer);

    // Automatically remove the toast after 5 seconds
    setTimeout(function () {
        toastContainer.remove();
    }, 1000);
}

function renderMessageWithOptions(message, options) {
    // Create a div to hold the message
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message-holder");

    // Create a paragraph for the message text
    const messageText = document.createElement("p");
    messageText.textContent = message;

    // Create a div to hold the options
    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    globalActiveArray = options;

    // Iterate over the options and create pills
    options.forEach((option) => {

        const optionPill = document.createElement("div");
        optionPill.classList.add("pill-badge");
        optionPill.textContent = option;

        if (globalResponseActive) {
            optionPill.addEventListener("click", function () {
                messageDiv.classList.add("disabled");
                messageDiv.style.cursor = "not-allowed";

                // Handle option click here
                const selectedOption = option;

                if (globalResponseActive)
                    if (globalActiveArray.includes(selectedOption)) {
                        {
                            globalResponseActive = false;

                            // Send the selected option as the user message
                            socket.emit("answer", selectedOption);

                            // Display the selected option as a user message on the right side
                            const userMessageContainer = document.createElement("div");
                            userMessageContainer.classList.add("message-right");

                            // Create a div to hold the user message text and time
                            const textTimeHolder = document.createElement("div");
                            textTimeHolder.classList.add("text-time-holder");

                            const userMessageText = document.createElement("p");
                            userMessageText.textContent = selectedOption;

                            // Create an image holder for the user message
                            const imageHolder = document.createElement("div");
                            imageHolder.classList.add("image-holder");
                            const image = document.createElement("img");
                            image.classList.add("img-fluid");

                            // Replace with the actual image source
                            image.src = "images/user.png";
                            imageHolder.appendChild(image);

                            // Create a div to hold the time
                            const timeHolderParent = document.createElement("div");
                            timeHolderParent.classList.add("time-holder-parent");
                            const timeHolder = document.createElement("div");
                            timeHolder.classList.add("time-holder");

                            // date and time
                            const currentDate = new Date();
                            const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
                            const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
                            const datePart = currentDate.toLocaleDateString(undefined, dateOptions);
                            const timePart = currentDate.toLocaleTimeString(undefined, timeOptions);

                            timeHolder.textContent = `${datePart} ${timePart}`;
                            timeHolderParent.appendChild(timeHolder);

                            // Append the image, time, and user message to the response paragraph
                            textTimeHolder.appendChild(userMessageText);
                            textTimeHolder.appendChild(timeHolderParent);
                            userMessageContainer.appendChild(imageHolder);
                            userMessageContainer.appendChild(textTimeHolder);
                            responseParagraph.appendChild(userMessageContainer);
                            responseParagraph.lastChild.scrollIntoView({
                                behavior: "smooth",
                                block: "end",
                            });

                            // Optionally, you can re-enable the input field when an option is clicked
                            document.getElementById("input").removeAttribute("disabled");
                            document.getElementById("input").setAttribute("placeholder", "Write your reply...");
                            document.getElementById("input").classList.remove("not-allowed");
                            document.getElementById("submit-button").removeAttribute("disabled");
                        }
                    }
                    else {
                        showToast("Please select a valid option");
                    }
                else {
                    if (!processEnd)
                        showToast("Please hold system is processing !");
                }
            });
        }

        optionsDiv.appendChild(optionPill);
    });

    // Append message text and options to the message div
    messageDiv.appendChild(messageText);
    messageDiv.appendChild(optionsDiv);

    // Create an image holder for the message
    const imageHolder = document.createElement("div");
    imageHolder.classList.add("image-holder");
    const image = document.createElement("img");
    image.classList.add("img-fluid");

    // Replace with the bot's image source
    image.src = "images/bot.png";
    imageHolder.appendChild(image);

    // Create a div to hold the time for the bot message
    const botTimeHolderParent = document.createElement("div");
    botTimeHolderParent.classList.add("time-holder-parent");
    const botTimeHolder = document.createElement("div");
    botTimeHolder.classList.add("time-holder");
    botTimeHolder.textContent = new Date().toLocaleString();
    const currentDate = new Date();
    const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

    const datePart = currentDate.toLocaleDateString(undefined, dateOptions);
    const timePart = currentDate.toLocaleTimeString(undefined, timeOptions);

    botTimeHolder.textContent = `${datePart} ${timePart}`;

    botTimeHolderParent.appendChild(botTimeHolder);

    // Wrap the message-holder elements with message-holder-section
    const messageHolderSection = document.createElement("div");
    messageHolderSection.classList.add("message-holder-section");
    const customSection = document.createElement("div");
    customSection.classList.add("custom-section");
    messageHolderSection.appendChild(imageHolder);
    messageHolderSection.appendChild(customSection);
    customSection.appendChild(messageDiv);
    customSection.appendChild(botTimeHolderParent);

    // Create a container for the entire message (including left and right)
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");

    // Create a div for the left message
    const leftMessageContainer = document.createElement("div");
    leftMessageContainer.classList.add("message-left");

    // Add the message holder section to the left message
    leftMessageContainer.appendChild(messageHolderSection);

    // Append all div and sub-html tags to the message container
    messageContainer.appendChild(leftMessageContainer);

    // Append the message container to the response paragraph
    responseParagraph.appendChild(messageContainer);
    responseParagraph.lastChild.scrollIntoView({
        behavior: "smooth",
        block: "end",
    });
}

socket.on("general", (data) => {
    globalType = data.type;
    const { message, type, option } = data;
    globalResponseActive = true;

    // Create a message container for both left and right messages
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");

    if (type === 2) {
        // Render message with options
        renderMessageWithOptions(message, option);
        document.getElementById("input").setAttribute("disabled", "disabled");
        document.getElementById("input").setAttribute("placeholder", "");
        document.getElementById("input").classList.add("not-allowed");
        document.getElementById("submit-button").setAttribute("disabled", "disabled");
        document.getElementById("submit-button").classList.add("disable-btn");
        // Append the message container to the response paragraph
        responseParagraph.appendChild(messageContainer);
    } else {
        if (type === 3)
            if (type === 1) {
                document.getElementById("input").removeAttribute("disabled");
                document.getElementById("input").setAttribute("placeholder", "Write a reply");
                document.getElementById("submit-button").removeAttribute("disabled");
                document.getElementById("input").classList.remove("not-allowed");
            }
        if (type === 4) {
            socket.disconnect();
            globalResponseActive = false;
            processEnd = true;
            document.getElementById("input").setAttribute("disabled", "disabled");
            document.getElementById("input").setAttribute("placeholder", "");
            document.getElementById("input").classList.add("not-allowed");
            document.getElementById("submit-button").setAttribute("disabled", "disabled");
            document.getElementById("submit-button").classList.add("disable-btn");
            console.log("dataType", data.url);

            // Open a new tab and navigate to the URL
            setTimeout(function () {
                if (data.url) {
                    window.open(data.url, "_self");
                }
            }, 500);
        }

        const questionContainer = document.createElement("div");
        const questionImageDiv = document.createElement("div");
        questionImageDiv.classList.add("image-holder");
        const image = document.createElement("img");
        image.classList.add("img-fluid");
        image.src = "images/bot.png";

        const questionDiv = document.createElement("div");
        // Determine the class based on the 'type'
        const textHolderClass = type === 3 ? "text-holder-danger" : "text-holder";

        // Create the questionDiv and add the determined class
        questionDiv.classList.add(textHolderClass);

        const questionText = document.createElement("p");
        questionText.textContent = message;

        // Create a div to hold the time for the left message
        const timeHolder = document.createElement("div");
        timeHolder.classList.add("time-holder");
        const currentDate = new Date();
        const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        const datePart = currentDate.toLocaleDateString(undefined, dateOptions);
        const timePart = currentDate.toLocaleTimeString(undefined, timeOptions);

        timeHolder.textContent = `${datePart} ${timePart}`;

        questionImageDiv.appendChild(image);
        questionContainer.classList.add("message-left");
        questionDiv.appendChild(questionText);

        // Wrap the time-holder element with time-holder-section
        const timeHolderSection = document.createElement("div");
        timeHolderSection.classList.add("time-holder-section");
        timeHolderSection.appendChild(timeHolder);

        // Wrap the message-holder elements with message-holder-section
        const messageHolderSection = document.createElement("div");
        messageHolderSection.classList.add("message-holder-section-one");
        messageHolderSection.appendChild(questionDiv);
        messageHolderSection.appendChild(timeHolderSection);

        // Append all div and sub-html tags
        questionContainer.appendChild(questionImageDiv);
        questionContainer.appendChild(messageHolderSection);

        // Append the message container to the response paragraph
        messageContainer.appendChild(questionContainer);
        responseParagraph.appendChild(messageContainer);
    }

    // Scroll to the newly added message
    responseParagraph.lastChild.scrollIntoView({
        behavior: "smooth",
        block: "end",
    });
    document.getElementById("typing").classList.add("d-none");
});

// Function to handle form submission
function handleSubmit(e, selectedFile) {
    e.preventDefault();
    let userInput = document.getElementById("input").value;
    if (!userInput && !selectedFile) {
        alert("Please enter your answer");
        return;
    }
    if (globalType != 2)
        sendResponse(userInput, selectedFile);
}

// Function to send user responses
function sendResponse(userInput, selectedFile) {
    const answerContainer = document.createElement("div");
    const answerImageDiv = document.createElement("div");
    const image = document.createElement("img");

    // Image preview divs
    let logoPreviewHolder;
    if (selectedFile) {
        logoPreviewHolder = document.createElement("div");
        const logoPreview = document.createElement("img");
        logoPreviewHolder.className = "logo-preview-holder";
        logoPreviewHolder.appendChild(logoPreview);
        const reader = new FileReader();
        reader.addEventListener('load', function () {
            logoPreview.src = reader.result;
        });
        reader.readAsDataURL(selectedFile);
    }
    answerImageDiv.classList.add("image-holder");
    image.classList.add("img-fluid");
    image.src = "images/user.png";

    const answerDiv = document.createElement("div");
    answerDiv.classList.add("text-holder");
    const answer = document.createElement("p");

    const answerTime = document.createElement("div");
    answerTime.classList.add("time-holder");
    answerTime.textContent = new Date().toLocaleString();
    answer.textContent = userInput;
    answerContainer.classList.add("message-right");
    answerDiv.appendChild(selectedFile ? logoPreviewHolder : answer);
    answerDiv.appendChild(answerTime);
    answerImageDiv.appendChild(image);
    answerContainer.appendChild(answerImageDiv);
    answerContainer.appendChild(answerDiv);
    responseParagraph.appendChild(answerContainer);
    responseParagraph.lastChild.scrollIntoView({
        behavior: "smooth",
        block: "end",
    });

    socket.emit("answer", userInput);
    document.getElementById("input").value = "";
}

// Function to handle reset button click
function handleReset() {
    window.location.reload();
}
// chat box header
ChatBoxHeader.style.backgroundColor = "#447bd6";
ChatBoxHeader.style.padding = "15px";
ChatBoxHeader.style.color = "#fff";
ChatBoxHeader.style.fontSize = "20px";
ChatBoxHeader.style.fontWeight = "500";
// Create a chat icon
const chatIcon = document.createElement("div");
chatIcon.id = "chat-icon";
chatIcon.innerHTML = '<i class="fa-solid fa-comment"></i>';
chatIcon.style.position = "fixed";
chatIcon.style.bottom = "20px";
chatIcon.style.right = "20px";
chatIcon.style.width = "55px";
chatIcon.style.height = "55px";
chatIcon.style.backgroundColor = "#447bd6";
chatIcon.style.color = "#fff";
chatIcon.style.padding = "10px 20px";
chatIcon.style.borderRadius = "50px";
chatIcon.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.3)";
chatIcon.style.cursor = "pointer";

// Create a chat popup container
const chatPopup = document.createElement("div");
chatPopup.id = "chat-popup";
chatPopup.classList.add("chat-popup");

// Create a chat content area
const chatContent = document.createElement("div");
chatContent.id = "chat-content";
chatContent.style.overflowY = "auto";

// Append chat icon and chat popup to the body main
document.body.appendChild(chatIcon);
document.body.appendChild(chatPopup);

// Append the chat content area to the chat popup
chatPopup.appendChild(wrapper);

// Function to toggle chat popup
function toggleChatPopup() {
    if (chatPopup.style.display === "block") {
        chatPopup.style.display = "none";
    } else {
        chatPopup.style.display = "block";
    }
}

// Toggle chat popup when clicking on the chat icon
chatIcon.addEventListener("click", toggleChatPopup);

// Function to minimize the chat popup
function minimizeChatPopup() {
    chatPopup.style.display = "none";
}

// Minimize chat popup when clicking on the minimize button
minimizeButton.addEventListener("click", minimizeChatPopup);
