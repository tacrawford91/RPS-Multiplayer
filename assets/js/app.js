
// Initialize Firebase
var config = {
    apiKey: "AIzaSyA9QFuajLJLShzSTTG1jCuqWmmboPPhjSA",
    authDomain: "rps-multiplayer-be493.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-be493.firebaseio.com",
    projectId: "rps-multiplayer-be493",
    storageBucket: "rps-multiplayer-be493.appspot.com",
    messagingSenderId: "1065208274108"
  };

  firebase.initializeApp(config);

  //set db varible 
  var db = firebase.database();
 // intial varibles
 var player1Wins = 0;
 var player2Wins = 0;
 var player1Losses = 0;
 var player2Losses = 0;
 var player1Choice ="";
 var player2Choice = "";
 var dbPlayer1Name = "";
 var dbPlayer2Name ="";
 var dbplayer1Choice = "";
 var dbplayer2Choice = "";

  //initialize db structure
  db.ref().set({
    players: {"one":{
        choice:"",
        losses:0,
        name:"",
        wins:0
        }  
    ,"two":{
        choice:"",
        losses:0,
        name:"",
        wins:0
        }
    }
})
  
//create choices 
var rockChoice1 = $("<p>").text("Rock").attr("data-choice", "rock").addClass("choice choicep1"); 
var paperChoice1 = $("<p>").text("Paper").attr("data-choice", "paper").addClass("choice choicep1"); 
var scissorsChoice1 = $("<p>").text("Scissors").attr("data-choice", "scissors").addClass("choice choicep1"); 
var rockChoice2 = $("<p>").text("Rock").attr("data-choice", "rock").addClass("choice choicep2"); 
var paperChoice2 = $("<p>").text("Paper").attr("data-choice", "paper").addClass("choice choicep2"); 
var scissorsChoice2 = $("<p>").text("Scissors").attr("data-choice", "scissors").addClass("choice choicep2");
// append to player div
$(".player1"). append(rockChoice1,paperChoice1,scissorsChoice1);
$(".player2"). append(rockChoice2,paperChoice2,scissorsChoice2);
//hide until player is chosen
$(".choicep1").hide();
$(".choicep2").hide();

//listen to form and define user
$("#add-player").on("click", function(){
    event.preventDefault();
    //get store name in unknown
    var newPlayer = $("#new-player").val().trim();
    //assign to either player one or two
    db.ref("players").on("value", function(snapshot) {
        //set db varibles for easy access
        dbPlayer1Name = snapshot.child("one").child("name").val()
        dbPlayer2Name = snapshot.child("two").child("name").val()

        if (dbPlayer1Name === "") {
            dbPlayer1Name = newPlayer
            //set player 1 in db
            db.ref("players/one/name").set(dbPlayer1Name)
             //show player 1 choices
            $(".choicep1").show();
            //remove p2 choices
            $(".choicep2").remove();

        } else if (dbPlayer2Name === "" && dbPlayer1Name !== newPlayer) {
            dbPlayer2Name = newPlayer
            //set player 2 in db
            db.ref("players/two/name").set(dbPlayer2Name)
            //show player 2 choices
            $(".choicep2").show();
            //remove p1 choices
            $(".choicep1").remove();
        } 
    })
})

//listen for click, set as choice, run game, update wins,
$(".choicep1").on("click", function() {
    //set player choice to what was clicked
    player1Choice = $(this).attr("data-choice")
    //add selected class
    $(this).addClass("selected1")
    //set players choice in db
    db.ref("players/one/choice").set(player1Choice)
    // remove class from this
    $(this).removeClass("choicep1")
    //hide other choices
    $(".choicep1").hide()
});
$(".choicep2").on("click", function() {
    //set player choice to what was clicked
    player2Choice = $(this).attr("data-choice")
    //add selected class
    $(this).addClass("selected2")
    //set players choice in db
    db.ref("players/two/choice").set(player2Choice)
    // remove class from this
    $(this).removeClass("choicep2")
    //hide other choices
    $(".choicep2").hide()
})





// play game
db.ref().on("value", function(snapshot) {

    // get players 1 & 2 choice from db
    dbplayer1Choice = snapshot.val().players.one.choice
    dbplayer2Choice = snapshot.val().players.two.choice
    rps();
})


function rps() {
    if (dbplayer1Choice !== "" && dbplayer2Choice !=="") {
        //The following is the rps logic
        if ((dbplayer1Choice === "rock") || (dbplayer1Choice === "paper") || (dbplayer1Choice === "scissors")) {

            if ((dbplayer1Choice === "rock") && (dbplayer2Choice === "scissors")) {
            player1winner()
            console.log(" I PLAYED THE GAME")
            } else if ((dbplayer1Choice === "rock") && (dbplayer2Choice === "paper")) {
            player1loser()
            } else if ((dbplayer1Choice === "scissors") && (dbplayer2Choice === "rock")) {
                player1loser();
            } else if ((dbplayer1Choice === "scissors") && (dbplayer2Choice === "paper")) {
            player1winner()
            } else if ((dbplayer1Choice === "paper") && (dbplayer2Choice === "rock")) {
            player1winner()
            } else if ((dbplayer1Choice === "paper") && (dbplayer2Choice === "scissors")) {
            player1loser()
            } else if (dbplayer1Choice === dbplayer2Choice) {
            return
            }
        }
    } else { 
        console.log(" I DID NOT PLAY THE GAME")
        return}
}

function player1winner() {
    //update wins/loses 
    player1Wins++
    player2Losses++
    //diplay in middle square choices of both oppoents
    middlePlayer1Wins()
    //user timer before starting next round 
    setTimeout(roundOver,4000)
}

function player1loser() {
    player2Wins++
    player1Losses++
    //diplay in middle square choices of both oppoents
    middlePlayer1Loses()
    //user timer before starting next round 
    setTimeout(roundOver,4000)
    // db.ref("players/two/wins").set(player2Wins)
    // //diplay in middle square choices of both oppoents
    // //user timer before starting next round 
    // //Show Choices for next round
    // //change choices to empty
    // db.ref("players/one/choice").set("") 
    // db.ref("players/two/choice").set("")
    // //update win/losses in db 
    // db.ref("players/two/wins").set(player2Wins)
    // db.ref("players/one/losses").set(player1Losses)
    // //empty player1 & 2 varibles
    // player1Choice = "";
    // player2Choice = "";
}



function middlePlayer1Wins() {
    //hide player choices in original blocks 
    $(".selected1").hide()
    $(".selected2").hide()
    // create player 1 to display in the middle square
    var middleSquareP1 = $("<p>").html(`<p>${dbPlayer1Name} Wins! <br> ${dbplayer1Choice} </p>`).addClass("result winner")
    // create player 2 to displ= $("<p>").html(`<p>${dbPlayer1Name} Wins! <br> ${dbplayer1Choice} </p>`)ay in the middle square
    var middleSquareP2 = $("<p>").html(`<p>${dbPlayer2Name} Lost. <br> ${dbplayer2Choice} </p>`).addClass("result loser")
    //append to middle square
    $(".middleSquare").append(middleSquareP1);
    $(".middleSquare").append(middleSquareP2);
}
function middlePlayer1Loses() {
    //hide player choices in original blocks 
    $(".selected1").hide()
    $(".selected2").hide()
    // create player 1 to display in the middle square
    var middleSquareP1 = $("<p>").html(`<p>${dbPlayer1Name} Lost. <br> ${dbplayer1Choice} </p>`).addClass("result loser")
    // create player 2 to displ= $("<p>").html(`<p>${dbPlayer1Name} Wins! <br> ${dbplayer1Choice} </p>`)ay in the middle square
    var middleSquareP2 = $("<p>").html(`<p>${dbPlayer2Name} Wins! <br> ${dbplayer2Choice} </p>`).addClass("result winner")
    //append to middle square
    $(".middleSquare").append(middleSquareP1);
    $(".middleSquare").append(middleSquareP2);

}
function roundOver() {
    db.ref("players/one/choice").set("") 
    db.ref("players/two/choice").set("") 
    //update win/losses in db 
    db.ref("players/one/wins").set(player1Wins)
    db.ref("players/one/losses").set(player1Losses)
    db.ref("players/two/wins").set(player2Wins)
    db.ref("players/two/losses").set(player2Losses)
    //empty player1 & 2 varibles
    player1Choice = "";
    player2Choice = "";
    $(".selected1").addClass("choicep1")
    $(".selected2").addClass("choicep2")
    $(".result").remove();
    $(".choicep1").removeClass("selected1");
    $(".choicep2").removeClass("selected2");
    // //Show Choices for next round
    $(".choicep1").show();
    $(".choicep2").show();
}