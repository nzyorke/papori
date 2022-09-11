const server = "http://localhost:3400"
const loginBtn = document.getElementById("login-button");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");

loginBtn.onclick = () => {
    $.ajax({
        url: `${server}/loginUser`,
        type: 'POST',
        data: {
            username: usernameInput.value,
            password: passwordInput.value
        },
        success: (user) => {
            if (user == 'user not found') {
                console.log("user is not found");
            } else if (user == 'not authorised') {
                console.log("Incorrect password");
            } else {
                console.log("logged in successfully");
                console.log(user);
                // set the session storage with the user grabbed from MongoDB
                sessionStorage.setItem('userID', user._id);
                sessionStorage.setItem('userName', user.username);
                sessionStorage.setItem('profileImg', user.profile_img_url);

                // redirect automatically
                document.location.href = 'index.html';
            }
        },
        error: () => {
            console.log("error, cannot call API");
        }
    })
}