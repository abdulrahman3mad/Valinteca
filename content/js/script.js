// Variables
const API = `https://goldblv.com/api/hiring/tasks/register`;
let username = document.querySelector("#name");
let email = document.querySelector("#email");
let password = document.querySelector("#password");
let passwordConfirm = document.querySelector("#password-confirmation");
let form = document.querySelector("form");

let InputNames = {
    "username": username,
    "email": email,
    "password": password,
    "password_confirmation": passwordConfirm
}

const formRegex = {
    "username": [/^[a-zA-Z]{1}[a-zA-Z0-9]{4,14}/, "must contain 5 to 15 char and only start with a letter"],
    "email": [/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+/, "must be a valid email address. ex: example@gmail.com"],
    "password": [/[a-zA-Z0-9]{8,}/, "password must contain at least 8 char"],
}

// Events
window.onload = () => username.focus();

form.addEventListener("submit", (event) => {
    event.preventDefault();
    validateForm() && sendFormData();
})

// General Functions
async function sendFormData() {
    try {
        let res = await fetch(API, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password: password.value,
                password_confirmation: passwordConfirm.value
            })
        })

        let data = await res.json()
        if (data && data.errors && Object.keys(data.errors).length) displayErrors(data.errors)

        else {
            saveInStorage();
            window.location.replace("Valinteca-/succeed.html")
        }
    } catch (err) {
        console.log(err)
    }
}

function saveInStorage() {
    localStorage.setItem("user", JSON.stringify({
        "username": username.value,
        "email": email.value,
    }))
}

function displayErrors(errors) {
    Object.keys(errors).forEach((inputName) => {
        errors[inputName].forEach((err) => {
            unvalidTextItem = InputNames[inputName].closest(".input-container").querySelector(".unvalid-text");
            unvalidTextItem.innerText = err;
            unvalidTextItem.style.display = "block";
        })
    })
}

function validateForm(input) {
    let errors = {
        "username": [],
        "email": [],
        "password": [],
        "password_confirmation": [],
    };

    validateInput(errors, username) && validateInput(errors, email) && validateInput(errors, password);
    if (passwordConfirm.value !== password.value)
        errors.password_confirmation = ["The password confirmation doesn't match"]
    else errors.password_confirmation = [""]


    displayErrors(errors);
    for (let err in errors) {
        if (errors[err][0] !== "") return false;
    }
    return true
}

function validateInput(errors, input) {

    let inputname = input.getAttribute("name");
    let [inputRegex, errMessage] = formRegex[inputname];

    if (input.value === "") errors[inputname] = [`${inputname} is required`]
    else if (!inputRegex.test(input.value)) {
        errors[inputname] = [`${inputname} ${errMessage}`]
    } else errors[inputname] = [""]

    return true;
}