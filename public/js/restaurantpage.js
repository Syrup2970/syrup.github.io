var restaurant = "Cafe Garage";
var user = "-LToSLiVem9wl8FYV-e1";
//Create references
const dbRefRestaurantImages = database.ref().child("Restaurant Images").child(restaurant);
const dbRefRestaurant = database.ref().child("Restaurants").child(restaurant);
// const dbRefRating = database.ref().child("UserInfo").child("User Ratings")

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
setRestaurantName();
setCover();
setOverview();
setRatings();

$(document).ready(function () {
    $(".rating-grouptwo > label").on("click", function (event) {
        radio_value = $(this).next("input[type='radio']").val();
        alert(radio_value);
    });
});