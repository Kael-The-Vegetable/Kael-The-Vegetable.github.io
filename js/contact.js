const form = document.getElementById("contact-form");
const messageBox = document.getElementById("form-message");
console.log("Log");
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // stop default

    messageBox.textContent = "Sending...";
    messageBox.className = "sending";
    
    const data = new FormData(form);
    try {
        const response = await fetch(form.action, {
            method: form.method,
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: data
        });

        if (response.ok) {
            messageBox.textContent = "Thank you! Your message has been sent.";
            messageBox.className = "success";
            form.reset();
            console.log("AH");
        } else {
            messageBox.textContent = "Oops! Something went wrong.";
            messageBox.className = "error";
        }
    } catch (error) {
        messageBox.textContent = "Network error. Please try again later.";
        messageBox.className = "error";
    }
});