var current;

window.onload = function () {
    const dbCommentRef = firebase.database().ref().child("UserInfo").child("User Comments");
    userDataDisplay();
    signoutUser();
    showComments(dbCommentRef);
};


function signoutUser() {

    document.getElementById('signout').addEventListener('click', function () {
        firebase.auth().signOut();
        location.href = "Sign-in.html";
    });
}

function userDataDisplay() {

    const displayName = document.getElementById("userName");
    const displayContact = document.getElementById("userContact");
    const displayfbName = document.getElementById("fbName");
    const displayinstaName = document.getElementById("instaName");
    var dp = document.getElementById("#dp");

    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            current = user;
            console.log(user.uid, current.uid);
            var userEmail = firebase.auth().currentUser.email;
            console.log(userEmail);
            firebase.database().ref('UserInfo').child('Users').once('value').then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    if (userEmail === childSnapshot.val().email) {
                        var username = (childSnapshot.val().username);
                        displayName.innerText = username;
                        displayfbName.innerText = username;
                        displayinstaName.innerText = username;

                        console.log(childSnapshot.val().contact);

                        var usercontact = (childSnapshot.val().contact);
                        displayContact.innerText = usercontact;
                    }

                });
            });

            firebase.database().ref("UserInfo").child("User Images").child(current.uid).child(
                "Profile Photo").on('value', function (data) {
                console.log(data.val().dp);
                if (data.val().dp) {
                    dp.src = data.val().dp;
                }
            });

        } else {
            // No user is signed in.
            console.log("nothing");
        }
    });
}
// <!--===============================================================================================-->

// <!-- DP Uploading -->
document.querySelector('.file-select').addEventListener('change', handleFileUploadChange);
document.querySelector('.file-submit').addEventListener('click', handleFileUploadSubmit);


var selectedFile;

function handleFileUploadChange(e) {
    selectedFile = e.target.files[0];
}

function handleFileUploadSubmit(e) {
    dpRef = storageRef.child(`User Uploads/Profile Pictures/` + current.uid);
    dpRef.delete().then(function () {
        // File deleted successfully
    }).catch(function (error) {
        // Uh-oh, an error occurred!
    });
    const uploadTask = dpRef.put(selectedFile); //create a child directory called images, and place the file inside this directory
    uploadTask.on('state_changed', (snapshot) => {
        // Observe state change events such as progress, pause, and resume
    }, (error) => {
        // Handle unsuccessful uploads
        console.log(error);
        alert("Error Uploading File");
    }, () => {
        // Do something once upload is complete
        console.log('success');
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            updatePhoto(downloadURL);
        });
        alert("Profile Photo Updated");

    });
    document.getElementById("#dp").src = url;
}

function updatePhoto(downloadURL) {
    var current_dpRef = firebase.database().ref().child("UserInfo").child("User Images").child(current.uid).child(
        "Profile Photo");
    // Delete the file
    current_dpRef.remove();
    // Push a new recommendation to the database using those values
    current_dpRef.set({
        "dp": downloadURL
    });
}


function showComments(dbCommentRef) {
    // Get the elements that need to be directly changed or appended to
    var commmentHolder = document.getElementById("#commentStructure");

    dbCommentRef.on('value', function (data) {
        console.log("1data " + data.key);

        data.forEach(function (resSnap) {
            console.log("1nest1" + resSnap.key);

            resSnap.forEach(function (uidSnap) {
                if (uidSnap.key == current.uid) {
                    console.log("2nest2" + uidSnap.key);
                    uidSnap.forEach(function (messageSnap) {
                        console.log("3nest3" + messageSnap.key);

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
                }
            });
        });
    });
    // Start Query
    // dbCommentRef.on('value', function (data) {
    //     // console.log("comments " + data.key);

    //     data.forEach(function (uidSnap) {
    //         // console.log("nest" + uidSnap.key);

    //         uidSnap.forEach(function (messageSnap) {
    //             // console.log("nest" + messageSnap.val().username);


    //         });
    //     });
    // });


}