var restaurant = "Cafe Garage";
var current, comment, username, rating, image;
// document.querySelector('submitbtn1').addClickListener('change', handleFileUploadChange);
//Create references
var database = firebase.database();
const dbRefRestaurantImages = database.ref().child("Restaurant Images").child(restaurant);
const dbRefRestaurant = database.ref().child("Restaurants").child(restaurant);
const dbRefRating = database.ref().child("UserInfo").child("User Ratings").child(restaurant);
const dbCommentRef = firebase.database().ref().child("UserInfo").child("User Comments").child(restaurant);

// <!-- Contribution Uploading -->
document.querySelector(".file-select").addEventListener("change", handleFileUploadChange);
document.querySelector(".file-submit").addEventListener("click", handleFileUploadSubmit);

var selectedFile, selectedFileName;


function handleFileUploadChange(e) {
    selectedFile = e.target.files[0];
    selectedFileName = selectedFile.name;
}


function handleFileUploadSubmit(e) {
    dpRef = storageRef.child(`User Uploads/Contributions/` + current.uid + "/" + selectedFileName);
    dpRef
        .delete()
        .then(function () {
            // File deleted successfully
        })
        .catch(function (error) {
            // Uh-oh, an error occurred!
        });
    const uploadTask = dpRef.put(selectedFile); //create a child directory called images, and place the file inside this directory
    uploadTask.on(
        "state_changed",
        snapshot => {
            // Observe state change events such as progress, pause, and resume
        },
        error => {
            // Handle unsuccessful uploads
            console.log(error);
            alert("Error Uploading File");
        },
        () => {
            // Do something once upload is complete
            console.log("success");
            uploadTask.snapshot.ref
                .getDownloadURL()
                .then(function (downloadURL) {
                    console.log("File available at", downloadURL);
                    updatePhoto(downloadURL);
                });
            alert("Photo Uploaded");
        }
    );
    // document.getElementById("#dp").src = url;
}


function updatePhoto(downloadURL) {
    var current_userImagesRef = firebase.database().ref().child("UserInfo").child("User Images").child(current.uid).child("Contributions").push();
    var current_resRef = firebase.database().ref().child("Restaurant Images").child(restaurant).child("Contributions").push();
    // Push a new recommendation to the database using those values
    current_resRef.set({
        image: downloadURL
    });
    current_userImagesRef.set({
        image: downloadURL
    });
}

function userRatingDisplay() {
    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            current = user;
            console.log("user.uid, current.uid", user.displayName);
            var userEmail = firebase.auth().currentUser.email;

            getDP();

            dbRefRating.child(user.uid).on('value', function (data) {
                console.log(data.val());
                if (data.val().rating != 0) {
                    document.getElementById("#userRating").innerHTML = data.val().rating;
                    (document.getElementById("rating-" + data.val().rating)).checked = true;
                    console.log("user.uid, current.uid", data.val().rating);
                    rating = data.val().rating;

                }
            });

            firebase.database().ref('UserInfo').child('Users').once('value').then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    if (userEmail === childSnapshot.val().email) {
                        username = (childSnapshot.val().username);
                    }

                });
            });

        } else {
            // No user is signed in.
            console.log("nothing");
        }
    });
}

function getDP() {
    firebase.database().ref("UserInfo").child("User Images").child(current.uid).child(
        "Profile Photo").on('value', function (data) {
        console.log("data", current.uid);
        if (data.val().dp) {
            image = data.val().dp;
            console.log("image", data.val());
        }
    });
}

function getUploads() {
    firebase.database().ref("Restaurant Images").child(restaurant).child("Contributions").on('value', function (data) {
        // console.log("data", current.uid);
        // if (data.val().dp) {
        //     image = data.val().dp;
        //     console.log("image", data.val());
        // }
        data.forEach(function (key) {
            key.forEach(function (image) {
                console.log("data9", image.val());
            })
        });
    });
}

function setRestaurantName() {
    document.getElementById("#restaurantName").innerHTML = restaurant;
}

function setCover() {
    dbRefRestaurantImages.on("value", function (data) {
        (document.getElementById("#restaurantCover")).style.backgroundImage = "url(" + data.val().cover + ")";
        (document.getElementById("#ratingsCover")).style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),url(" + data.val().cover + ")";
        console.log("cover" + data.val()['cover']);
    });
}

function setOverview() {
    dbRefRestaurant.on("value", function (data) {
        rating = data.val().rating;
        (document.getElementById("#address")).innerHTML = data.val().address;
        (document.getElementById("#rating")).innerHTML = data.val().rating;
        (document.getElementById("rating3-" + data.val().rating)).checked = true;
        (document.getElementById("#description")).innerHTML = data.val().description;
        (document.getElementById("#status")).innerHTML = data.val().status;
        (document.getElementById("#timings")).innerHTML = data.val().timings;
        (document.getElementById("#phone")).innerHTML = data.val().phone;
        (document.getElementById("#link")).innerHTML = data.val().link;
        (document.getElementById("#link")).href = data.val().link;
    });
}

function setRatings() {
    dbRefRestaurant.on("value", function (data) {
        (document.getElementById("#ambiance")).setAttribute("data-percentage", data.val().ambiance);
        (document.getElementById("#ambiance-val")).innerHTML = data.val().ambiance + "%";

        (document.getElementById("#taste")).setAttribute("data-percentage", data.val().taste);
        (document.getElementById("#taste-val")).innerHTML = data.val().taste + "%";

        (document.getElementById("#presentation")).setAttribute("data-percentage", data.val().presentation);
        (document.getElementById("#presentation-val")).innerHTML = data.val().presentation + "%";

        (document.getElementById("#value")).setAttribute("data-percentage", data.val().value);
        (document.getElementById("#value-val")).innerHTML = data.val().value + "%";
    });
}

function setUserRating(radio_value) {
    dbRefRating.child(current.uid).set({
        "rating": radio_value
    });
}

function calculateOverallRating() {
    var totalraters = 1;
    var rating = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    dbRefRating.on('value', function (data) {
        console.log("noor " + data.val());
        totalraters = data.numChildren();
        rating = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        data.forEach(user => {
            dbRefRating.child(user.key).on('value', function (data) {
                rating[data.val().rating - 1] = rating[data.val().rating - 1] + 1;
                console.log("all " + rating);
            })
        });
        overallrating = (10 * rating[9] + 9 * rating[8] + 8 * rating[7] + 7 * rating[6] + 6 * rating[5] + 5 * rating[4] + 4 * rating[3] + 3 * rating[2] + 2 * rating[1] + 1 * rating[0]) / totalraters;
        dbRefRestaurant.update({
            "rating": Math.round(overallrating)
        });
        console.log("overall" + Math.round(overallrating));
    });

}

function showComments() {
    // Get the elements that need to be directly changed or appended to
    var commmentHolder = document.getElementById("#commentStructure");
    // Start Query
    dbCommentRef.on('value', function (data) {
        console.log("comments " + data.key);

        data.forEach(function (uidSnap) {
            console.log("nest" + uidSnap.key);

            uidSnap.forEach(function (messageSnap) {
                console.log("nest" + messageSnap.val().username);

                // Create Elements
                var li = document.createElement('li'); //
                var div1 = document.createElement('div'); //
                var img = document.createElement('img'); //
                var div2 = document.createElement('div'); //
                var div3 = document.createElement('div'); //
                var h6 = document.createElement('h6'); //
                var p1 = document.createElement('p'); //
                var p2 = document.createElement('p'); //
                var span = document.createElement('span'); //

                // // Attach Classes
                li.classList.add('list-group-item');
                div1.classList.add('comments', 'row');
                img.classList.add(
                    'col-3',
                    'avatar',
                    'rounded-circle'
                );
                div2.classList.add('col-9');
                div3.classList.add('row');
                h6.classList.add('username', 'col-12', 'card-subtitle');
                p1.classList.add('date-posted', 'card-text', 'text-muted');
                p2.classList.add('comment', 'card-text');
                span.classList.add('user-rating');

                h6.innerText = messageSnap.val().username;
                p1.innerText = messageSnap.val().timestamp;
                img.src = messageSnap.val().thumbnail;
                span.innerText = messageSnap.val().userrating;

                // Structure Properly
                // Append things in proper order for example.
                li.appendChild(div1); // first the li to the ul
                div1.appendChild(img); // then the ul to the div.
                div1.appendChild(div2);
                div2.appendChild(div3);
                div3.appendChild(h6);
                div3.appendChild(p1);
                div3.appendChild(p2);
                p2.appendChild(span);
                p2.innerHTML += messageSnap.val().comment;


                // Appending to Container
                commmentHolder.appendChild(li);
            });
        });
    });


}

calculateOverallRating();
userRatingDisplay();
setRestaurantName();
setCover();
setOverview();
setRatings();
showComments();

$(document).ready(function () {
    $(".rating-grouptwo > label").on("click", function (event) {
        radio_value = $(this).next("input[type='radio']").val();
        setUserRating(radio_value);
        calculateOverallRating();
    });

    $("#submitbtn1").on("click", function (event) {
        comment = $("[name=message]").val();
        console.log("watnow");
        postComment(comment, image, username);
    });
    // $("#embedbtn").on("click", function (event) {
    // comment = $("[name=message]").val();
    // console.log("hurray");
    // postComment(comment, image, username);
    // });
});

function postComment(comment, image, username) {
    // alert("comment");
    var d = new Date();
    var strDate = d.toDateString();
    if (rating != null) {
        sendrating = rating;
    } else {
        sendrating = 0;
    }
    dbCommentRef.child(current.uid).push().set({
        "comment": comment,
        "thumbnail": image,
        "timestamp": strDate,
        "username": username,
        "userrating": sendrating
    });
    alert("Comment Added!");
}

// getUploads();