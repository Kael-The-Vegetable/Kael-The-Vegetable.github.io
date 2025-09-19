
document.body.addEventListener("submit", async (event) => {
    event.preventDefault(); // stop default

    const form = document.getElementById("contact-form");
    const messageBox = document.getElementById("form-message");
    
    messageBox.innerHTML = "Sending...<br>&nbsp;";
    
    const data = new FormData(form);

    fetch(form.action, {
        method: form.method,
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(data))
    })// fetch response
        .then(response => {
            if (!response.ok) {
                throw new Error('Network error! Something went wrong. ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success === "false") {
                throw new Error("External error. " + data.message);
            }
            console.log("Success:", data);
            window.location.hash = "thank_you";
        })
        .catch(error => {
            messageBox.innerHTML = error.message + " Please try again later.<br>&nbsp;";
        });
});