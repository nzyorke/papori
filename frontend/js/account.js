const goBtn = document.getElementById("go-button");
const accountResult = document.getElementById("account-result");


// =================================
//        DISPLAY PRODUCTS
// =================================

// This function allows us to display our products from the MongoDB on our app
let showOwnProduct = () => {
    $.ajax({
        type: "GET",
        url: "http://localhost:3400/allProduct",
        // your success function contains a object which can be named anything
        success: (products) => {
            console.log(products);
            renderProductsAccount(products);
        },
        error: (error) => {
            console.log(error);
        },
    });
};

const addNewProductDivAccount = document.getElementById("add-product-div-account");
// =================================
//        ADD NEW PRODUCTS
// =================================
let addNewProductsAccount = () => {
    goBtn.onclick = () => {
        const nameInput = document.getElementById("name-input");
        const priceInput = document.getElementById("price-input");
        const descriptionInput = document.getElementById("description-input");
        const imageURLInput = document.getElementById("image-url-input");

        $.ajax({
            url: "http://localhost:3400/addProduct",
            // use the post type to create data somewhere
            // requesting to POST our data
            type: "POST",
            // we can send objects through to the backend, using the data argument
            data: {
                // the first property (i.e. the one on the left) called name has to be spelt exactly as the schema
                name: nameInput.value,
                price: priceInput.value,
                description: descriptionInput.value,
                img_url: imageURLInput.value,
                createdby: sessionStorage.userID,
                productowner: sessionStorage.userName,
            },
            success: () => {
                console.log("A new product was added.");
                showOwnProduct();
                console.log(sessionStorage.userName);
                console.log(sessionStorage.userID);
            },
            error: () => {
                console.log("Error: cannot reach the backend");
            },
        });
    };
};

// =================================
//        RENDER PRODUCTS
// =================================

// This function renders our products
let renderProductsAccount = (products) => {
    let productId = products.id;
    console.log("the render products function is working");
    accountResult.innerHTML = "";
    products.forEach((item) => {
        //  RENDER COMMENTS
        let renderComments = () => {
            if (item.comments.length > 0) {
                let allComments = "";
                item.comments.forEach((comment) => {
                    allComments += `<li>${comment.text}</li>`;
                });
                return allComments;
            } else {
                return "<p>Be the first to place a comment!</p>";
            }
        };

        // how to render comments: ${renderComments()}

        if (item.createdby == sessionStorage.userID) {
            accountResult.innerHTML += `

        <div class="product-container" id="${item._id}">
        <div class="product-item">
            <div class="product-buttons">
            <i class="bi bi-trash trash-button" id="delete" data-bs-toggle="modal" data-bs-target="#deleteModal"></i>
            <i class="bi bi-pencil edit-button" data-bs-toggle="modal" data-bs-target="#editModal"></i>
            </div>
            <div class="product-image">
                <img src="${item.img_url}" class="open-image" alt="${item.name
                }">
            </div>
            <div class="product-description">
                <h4>${item.name.toUpperCase()}</h4>
                <p>BY ${item.productowner.toUpperCase()}</p> 
                <div id="favourite">
                <h3>$${item.price}</h3>
                </div>
            </div>
        </div>
    </div>
    
        `;
        }
        //         else {
        //             accountResult.innerHTML += `
        //       <div class="product-container" id="${item._id}">
        //       <div class="product-item">
        //           <div class="product-buttons">
        //           </div>
        //           <div class="product-image">
        //               <img src="${item.img_url}" class="open-image" alt="${item.name}">
        //           </div>
        //           <div class="product-description">
        //               <h4>${item.name.toUpperCase()}</h4>
        //               <p>BY ${item.productowner.toUpperCase()}</p> 
        //               <div id="favourite">
        //               <h3>$${item.price}</h3>
        //               </div>
        //           </div>
        //       </div>
        //   </div>
        //       `;
        //         }
    });

    // running collect edit buttons function
    collectEditButtonsAccount();
    // running collect delete buttons function
    collectDeleteButtonsAccount();
    // running add comment buttons function
    collectCommentButtonsAccount();

    collectProductModalsAccount();

    let deleteBtn = document.getElementById("submitDelete");
    deleteBtn.onclick = () => {
        console.log(productId);
        populateDeleteModal(productId);
    };
};




// =================================
//      ADD COMMENT FUNCTION
// =================================
// This function will send the id to the onclick listener of the submit button
let addCommentAccount = (productId) => {
    const commentBtn = document.getElementById("submitComment");
    // add a listener for the add comment button
    commentBtn.onclick = () => {
        console.log(productId);
        $.ajax({
            url: "http://localhost:3400/postComment",
            type: "POST",
            data: {
                text: document.getElementById("productComment").value,
                product_id: productId,
            },
            success: () => {
                console.log("Comment placed successfully");
                showOwnProduct();
                $("#commentModal").modal("hide");
            },
            error: () => {
                console.log("error, can't post comment");
            },
        });
    };
};

// =================================
//COLLECT EDIT BUTTONS & EDIT FUNCTION
// =================================

//this function will ask the backend for data relating to the product we clicked on to edit
populateEditModal = (productId) => {
    console.log(productId);
    $.ajax({
        url: `http://localhost:3400/product/${productId}`,
        type: "GET",
        success: (productData) => {
            console.log("Product was found!");
            console.log(productData);
            fillEditInputs(productData, productId);
        },
        error: () => {
            console.log(error);
        },
    });
};

populateDeleteModal = (productId) => {
    $.ajax({
        url: `http://localhost:3400/product/${productId}`,
        type: "GET",
        success: (productData) => {
            console.log("Product was found!");
            console.log(productData);
            renderDeleteModalAccount(productData, productId);
        },
        error: () => {
            console.log(error);
        },
    });
};

let renderDeleteModalAccount = (productData) => {
    let productId = productData._id;
    let deleteBtn = document.getElementById("submitDelete");
    deleteBtn.onclick = () => {
        deleteProductAccount(productId);
        console.log(productId);
    };
};

//this function will handle all our edits and add a click listener
//if we click on an edit button it will get the id from the parent node (the div around around our prodcuts)
let collectEditButtonsAccount = () => {
    // this will return an Array, but it's a slightly different one
    // it returns HTML "nodes" instead
    // Well have to use a regular loop over these
    let editButtonsArray = document.getElementsByClassName("edit-button");
    //this will loop over every edit button
    for (let i = 0; i < editButtonsArray.length; i++) {
        editButtonsArray[i].onclick = () => {
            console.log(editButtonsArray[i].id);
            console.log("edit button clicked");
            let currentId = editButtonsArray[i].parentNode.parentNode.parentNode.id;
            //edit products based on the id
            populateEditModal(currentId);
        };
    }
};

fillEditInputs = (product, id) => {
    let productName = document.getElementById("productName");
    let productPrice = document.getElementById("productPrice");
    let productDescription = document.getElementById("productDescription");
    let imageUrl = document.getElementById("imgUrl");

    productName.value = product.name;
    productPrice.value = product.price;
    productDescription.value = product.description;
    imageUrl.value = product.img_url;

    let imagePreview = document.getElementById("image-preview");

    imagePreview.innerHTML = `
    <img class="edit-modal-image" src="${product.img_url}" alt="${productName}">
    `;

    //=================================
    //      EDIT CLICK LISTENER
    //=================================
    $("#updateProduct").click(function () {
        event.preventDefault();
        let productId = id;
        let productName = document.getElementById("productName").value;
        let productPrice = document.getElementById("productPrice").value;
        let productDescription =
            document.getElementById("productDescription").value;
        let imageUrl = document.getElementById("imgUrl").value;

        console.log(
            productId,
            productName,
            productPrice,
            productDescription,
            imageUrl
        );

        $.ajax({
            url: `http://localhost:3400/updateProduct/${productId}`,
            type: "PATCH",
            data: {
                name: productName,
                price: productPrice,
                description: productDescription,
                img_url: imageUrl,
            },
            success: (data) => {
                console.log(data);
                console.log("Success - product was updated");
                showOwnProduct();
                $("#updateProduct").off("click");
            },
            error: () => {
                console.log("Error not updated");
            },
        });
    });
};

// =================================
//COLLECT DELETE BUTTONS & DELETE FUNCTION
// =================================

// // this function gets run when we click on a delete button
let deleteProductAccount = (productId) => {
    // use ajax and go to the delete route
    $.ajax({
        // Let's go to our route
        url: `http://localhost:3400/deleteProduct/${productId}`,
        type: "DELETE",
        success: () => {
            // at this point, we can assume that the delete was successful
            showOwnProduct();
        },
        error: () => {
            console.log("Cannot call API");
        },
    });
};

// this function will handle all our deletes
let collectDeleteButtonsAccount = () => {
    // this will return an Array, but it's a slightly different one
    // it returns HTML "nodes" instead
    // we'll have use a regular loop to loop over these
    let deleteButtonsArray = document.getElementsByClassName("trash-button");
    // this will loop over every delete button
    for (let i = 0; i < deleteButtonsArray.length; i++) {
        deleteButtonsArray[i].onclick = () => {
            let productId = deleteButtonsArray[i].parentNode.parentNode.parentNode.id;
            populateDeleteModal(productId);
            // delete product based on the id
        };
    }
};

// ==============================================
//         COLLECT POST COMMENT BUTTONS
// ==============================================
// this function will handle all our comments
let collectCommentButtonsAccount = () => {
    // this will return an Array, but it's a slightly different one
    // it returns HTML "nodes" instead
    // we'll have use a regular loop to loop over these
    let commentButtonsArray = document.getElementsByClassName("comment-button");
    // this will loop over every delete button
    for (let i = 0; i < commentButtonsArray.length; i++) {
        commentButtonsArray[i].onclick = () => {
            let currentId = commentButtonsArray[i].parentNode.id;
            addCommentAccount(currentId);
        };
    }
};

// ==============================================
//   RUNNING THE FUNCTION TO SHOW ALL PRODUCTS
// ==============================================
showOwnProduct();

const postProductBtnDivAccount = document.getElementById("add-product-button-account");
// ==============================================
//      CHECK IF USER IS LOGGED IN OR NOT
// ==============================================
// this function checks if the users logged in
// if they are, show the username and their profile image

let checkLoginAccount = () => {
    const userDetails = document.getElementById("user-details");
    let navContent;
    if (sessionStorage.userID) {
        // console.log("You're logged in")
        // console.log(sessionStorage.userName)
        addNewProductsAccount();
        navContent = `
        <div class="account-button" id="nav-img-acc-account">
      <span id="username">${sessionStorage.userName.toUpperCase()}</span>
      <span id="dp" style="background-image: url('${sessionStorage.profileImg
            }')"></span>
      </div>
      `;
        //   <a id="sign-out-button" href="#">Sign Out</a>
        addNewProductDivAccount.innerHTML = `
      <form id="add-project-form" action="javascript:void(0)">
      <label for="name-input">Product Name: </label>
      <input id="name-input" name="name-input" type="text">
      <label for="price-input">Product Price: </label>
      <input id="price-input" name="price-input" type="text">
      <label for="description-input">Product Description: </label>
      <input id="description-input" name="description-input" type="text">
      <label for="image-url-input">Product Image URL:</label>
      <input id="image-url-input" name="image-url-input" type="text">
  </form>
      `;
    } else {
        collectCommentButtonsAccount.innerHTML = `
        <a href="login.html"><button id="go-button">Post New Product</button></a>
        `;
        navContent = `<div id="nav-btn-acc">
        <a id="account-symbol" href="signup.html"><span class="material-symbols-outlined"> account_circle </span></a>
        <button id="account-button">ACCOUNT</button>
        </div>
        <div id="nav-img-acc-account" style="display: none;"></div>
      `;
    }
    // render our logged in elements
    userDetails.innerHTML = navContent;
};

checkLoginAccount();

const signoutBtnAccount = document.getElementById("sign-out-button-account");

let logOutAccount = () => {
    console.log("log out");
    sessionStorage.clear();
    window.location.reload();
};

if (sessionStorage.userID) {
    signoutBtnAccount.onclick = () => {
        logOutAccount();
    };
}

// const accountBtn = document.getElementById('nav-btn-acc');
const accountImgAccount = document.getElementById("nav-img-acc-account");
const accountDetailsAccount = document.getElementById("account-details");

accountImgAccount.onclick = function () {
    accountExpand();
};

function accountExpand() {
    accountDetailsAccount.classList.toggle("account-expand");

    // ==============================
    //  COLLECT PRODUCT MODAL
    // ==============================

    // Render the inner HTML for the modal
}

let renderProductModalAccount = (projectData) => {
    let productOwner = document.getElementById("product-owner");
    let productName = document.getElementById("product-name");
    // let productDescription = document.getElementById("product-description");
    let productImage = document.getElementById("product-image");
    let currentId = projectData._id;
    productOwner.innerHTML = `
<h1>${projectData.productowner}</h1>
<div class="name-underline"></div>
`;

    productName.innerHTML = `
<h2>${projectData.name}</h2>
`;

    // productDescription.innerHTML = `
    // <p>${projectData.description}</p>

    // `;

    productImage.innerHTML = `
<img src="${projectData.img_url}" alt="">
`;

    // let deleteBtn = document.getElementById('delete-button');
    // deleteBtn.onclick = () => {
    //   console.log(currentId);
    //   deleteStudent(currentId);
    //   projectModal.classList.toggle("active");
    // };

    // let editBtn = document.getElementById('edit-button');
    // editBtn.onclick = () => {
    //   console.log(currentId);
    //   populateEditModal(currentId);
};

// Getting data from MongoDB to put in our project modal

let populateProductModalAccount = (projectId) => {
    $.ajax({
        url: `http://localhost:3400/product/${projectId}`,
        type: "GET",
        success: (projectData) => {
            // console.log('student was found');
            console.log(projectData);
            // thias is where renderprojectmodal is getting its data from
            renderProductModalAccount(projectData);
        },
        error: (error) => {
            console.log(error);
        },
    });
};

const openImageAccount = document.getElementsByClassName("open-image");
const closeModalBtnAccount = document.getElementById("close-modal");
const productModalAccount = document.getElementById("productModalAccount");

let collectProductModalsAccount = () => {
    for (let i = 0; i < openImageAccount.length; i++) {
        // This is when the user clicks on the project image

        openImageAccount[i].onclick = () => {
            console.log("You clicked the modal");
            let productId = openImageAccount[i].parentNode.parentNode.parentNode.id;
            console.log(productId);
            populateProductModalAccount(productId);
            productModalAccount.classList.toggle("active");
        };
    }
    closeModalBtnAccount.onclick = () => {
        productModalAccount.classList.toggle("active");
    };
};

// openImageAccount.onclick = () => {
//   console.log("you clicked me");
// }

let footerTopInfo1Account = document.getElementsByClassName(`footer-top-info1-account`);

for (let i = 0; i < footerTopInfo1Account.length; i++) {
    const element = footerTopInfo1Account[i];
    element.addEventListener('click', function () {
        this.classList.toggle('active');
        console.log('clicked');
    })

}

console.log('hello');

