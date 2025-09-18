
document.body.addEventListener("submit", async (event) => {
    console.log("submit");
    event.preventDefault(); // stop default

    const form = document.getElementById("contact-form");
    const messageBox = document.getElementById("form-message");
    
    messageBox.innerHTML = "Sending...<br>&nbsp;";
    // messageBox.className = "sending";
    
    const data = new FormData(form);

    const response = await fetch(form.action, {
        method: form.method,
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: data
    })// fetch response
        .then(response => {
            if (!response.ok) {
                throw new Error('Oops! Something went wrong.');
            }
            console.log(response.text());
            return response.text();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
            messageBox.innerHTML = "Network error. Please try again later.<br>&nbsp;";
            // messageBox.className = "error";
        });
});