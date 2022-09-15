
// =================================
//        NAV BAR FUNCTIONS
// =================================

const navBar = document.getElementById("nav-bar");
const navSearch = document.getElementById("nav-search");

navSearch.onclick = function () {
  navExpand();
};

function navExpand() {
  navBar.classList.toggle("nav-expand");
}

const filterBtn = document.getElementById("filter");
const filterOptions = document.getElementById("filter-dropdown");

filterBtn.onclick = function () {
  filterExpand();
  console.log("you clicked me");
};

function filterExpand() {
  filterOptions.classList.toggle("filter-expand");
}


populateAccountEditPage = () => {
  userId = sessionStorage.userID;
  $.ajax({
    url: `http://localhost:3400/user/${userId}`,
    type: "GET",
    success: (userData) => {
      console.log("Product was found!");
      console.log(userData);
      fillEditUserInputs(userData, userId);
    },
    error: () => {
      console.log(error);
    },
  });
};


fillEditUserInputs = (user, id) => {
  let username = document.getElementById("username-input");
  let password = document.getElementById("edit-password-input");
  let bio = document.getElementById("bio-input");
  let imageUrl = document.getElementById("profilepic-input");

  username.value = user.username;
  password.value = user.password;
  if (sessionStorage.bio == "undefined") {
    bio.value = "";
} else {
bio.value = user.userdescription;
};
  imageUrl.value = user.profile_img_url;

  //=================================
  //      EDIT CLICK LISTENER
  //=================================
  $("#edit-button2").click(function () {
    event.preventDefault();
    let editProfileImage = document.getElementById("edit-profile-image");
    let userId = sessionStorage.userID;
    let username = document.getElementById("username-input").value;
    let password = document.getElementById("edit-password-input").value;
    let bio = document.getElementById("bio-input").value;
    let imageUrl = document.getElementById("profilepic-input").value;

    console.log(username, password, imageUrl, bio);

    $.ajax({
      url: `http://localhost:3400/updateUser/${userId}`,
      type: "PATCH",
      data: {
        username: username,
        password: password,
        userdescription: bio,
        profile_img_url: imageUrl,
      },
      success: (data) => {
        console.log(data);
        console.log("Success - user was updated");
        newUsername = username;
        newBio =  bio;
        // newDescription = description;
        newImageUrl = imageUrl;
        sessionStorage.setItem("userName", newUsername);
        sessionStorage.setItem("profileImg", newImageUrl);
        sessionStorage.setItem("bio", newBio);
        editProfileImage.innerHTML = `
        <img class="profile-image" src="${sessionStorage.profileImg}">
        `;
        console.log(newBio);
      },
      error: () => {
        console.log("Error not updated");
      },
    });
  });
};


populateAccountEditPage();


let checkLogin = () => {
  const userDetails = document.getElementById("user-details");
  let navContent;
  if (sessionStorage.userID) {
    // console.log("You're logged in")
    // console.log(sessionStorage.userName)
    navContent = `
        <div class="account-button" id="nav-img-acc">
      <span id="username">${sessionStorage.userName.toUpperCase()}</span>
      <span id="dp" style="background-image: url('${
        sessionStorage.profileImg
      }')"></span>
      </div>
      `;
    //   <a id="sign-out-button" href="#">Sign Out</a>
   
  } else {
   
    navContent = `<div id="nav-btn-acc">
        <a id="account-symbol" href="signup.html"><span class="material-symbols-outlined"> account_circle </span></a>
        <button id="account-button">ACCOUNT</button>
        </div>
        <div id="nav-img-acc" style="display: none;"></div>
      `;
  }
  // render our logged in elements
  userDetails.innerHTML = navContent;
};

// =======================================
// ADD PROFILE PICTURES FOR ACCOUNT PAGES
// =======================================
let displayProfilePictures = () => {
  let editProfileImage = document.getElementById("edit-profile-image");

  // let userDescription = document.getElementById("profile-description-input").value;
  if (sessionStorage.userID) {
    editProfileImage.innerHTML = `
      <img class="profile-image" src="${sessionStorage.profileImg}">
      `;
  }
}

displayProfilePictures();

checkLogin();

const signoutBtn = document.getElementById("sign-out-button");

let logOut = () => {
  console.log("log out");
  sessionStorage.clear();
  window.location.reload();
};

if (sessionStorage.userID) {
  signoutBtn.onclick = () => {
    logOut();
  };
}

// const accountBtn = document.getElementById('nav-btn-acc');
const accountImg = document.getElementById("nav-img-acc");
const accountDetails = document.getElementById("account-details");

accountImg.onclick = function () {
  accountExpand();
};

function accountExpand() {
  accountDetails.classList.toggle("account-expand");

}


