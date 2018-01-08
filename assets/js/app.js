
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
var rockChoice1 = $("<p>").text("Rock").attr("data-choice", "rock").addClass("choicep1"); 
var paperChoice1 = $("<p>").text("Paper").attr("data-choice", "paper").addClass("choicep1"); 
var scissorsChoice1 = $("<p>").text("Scissors").attr("data-choice", "scissors").addClass("choicep1"); 
var rockChoice2 = $("<p>").text("Rock").attr("data-choice", "rock").addClass("choicep2"); 
var paperChoice2 = $("<p>").text("Paper").attr("data-choice", "paper").addClass("choicep2"); 
var scissorsChoice2 = $("<p>").text("Scissors").attr("data-choice", "scissors").addClass("choicep2");
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
        var dbPlayer1Name = snapshot.child("one").child("name").val()
        var dbPlayer2Name = snapshot.child("two").child("name").val()

        if (dbPlayer1Name === "") {
            dbPlayer1Name = newPlayer
            //set player 1 in db
            db.ref("players/one/name").set(dbPlayer1Name)
             //show player 1 choices
            $(".choicep1").show();

        } else if (dbPlayer2Name === "" && dbPlayer1Name !== newPlayer) {
            dbPlayer2Name = newPlayer
            //set player 2 in db
            db.ref("players/two/name").set(dbPlayer2Name)
            //show player 2 choices
            $(".choicep2").show();
            console.log("player 2" + dbPlayer2Name)
        } 
    })
})

//listen for click, set as choice, run game, update wins,
$(".choicep1").on("click", function() {
    //set player choice to what was clicked
    player1Choice = $(this).attr("data-choice")
    //set players choice in db
    db.ref("players/one/choice").set(player1Choice)
    //hide other choices
    $(".choicep1").hide()
    $(this).show();
})
$(".choicep2").on("click", function() {
    //set player choice to what was clicked
    player2Choice = $(this).attr("data-choice")
    //set players choice in db
    db.ref("players/two/choice").set(player2Choice)
    //hide other choices
    $(".choicep2").hide()
    $(this).show();
})





// play game
db.ref().on("value", function(snapshot) {

    var dbplayer1Choice = snapshot.val().players.one.choice
    console.log(snapshot.val().players.one.choice)
    console.log("dbplayer1   " + dbplayer1Choice);
    var dbplayer2Choice = snapshot.val().players.two.choice
    console.log("dbplayer2   " + dbplayer2Choice);

    if (dbplayer1Choice !== "" && dbplayer2Choice !=="") {
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

})



// function rps() {


    // var dbplayer1Choice = snapshot.child("one").child("choice").val()
    // var dbplayer2Choice = snapshot.child("two").child("choice").val()
//     var dbplayer1Choice = player1Choice;
//     var dbplayer2Choice = player2Choice;

//     if (dbplayer1Choice !== "" && dbplayer2Choice !=="") {
//         if ((dbplayer1Choice === "rock") || (dbplayer1Choice === "paper") || (dbplayer1Choice === "scissors")) {

//             if ((dbplayer1Choice === "rock") && (dbplayer2Choice === "scissors")) {
//             player1winner()
//             } else if ((dbplayer1Choice === "rock") && (dbplayer2Choicecd .. === "paper")) {
//             player1loser()
//             } else if ((dbplayer1Choice === "scissors") && (dbplayer2Choice === "rock")) {
//                 player1loser();
//             } else if ((dbplayer1Choice === "scissors") && (dbplayer2Choice === "paper")) {
//             player1winner()
//             } else if ((dbplayer1Choice === "paper") && (dbplayer2Choice === "rock")) {
//             player1winner()
//             } else if ((dbplayer1Choice === "paper") && (dbplayer2Choice === "scissors")) {
//             player1loser()
//             } else if (dbplayer1Choice === dbplayer2Choice) {
//             return
//             }
//         }
//     } else { return}
// }

function player1winner() {
    //update wins/loses 
    player1Wins++
    player2Losses++
    //diplay in middle square choices of both oppoents

    //user timer before starting next round 
    // setTimeout(function {},8000)
        db.ref("players/one/choice").set("") 
        db.ref("players/two/choice").set("") 
        //update win/losses in db 
        db.ref("players/one/wins").set(player1Wins)
        db.ref("players/two/losses").set(player2Losses)
        //empty player1 & 2 varibles
        player1Choice = "";
        player2Choice = "";
         // //Show Choices for next round
        
    
    // //Show Choices for next round
    // //change choices to empty
    // db.ref("players/one/choice").set("") 
    // db.ref("players/two/choice").set("") 
    // //update win/losses in db 
    // db.ref("players/one/wins").set(player1Wins)
    // db.ref("players/two/losses").set(player2Losses)
    // //empty player1 & 2 varibles
    // player1Choice = "";
    // player2Choice = "";
    
}

function player1loser() {
    player2Wins++
    player1Losses++
    db.ref("players/two/wins").set(player2Wins)
    //diplay in middle square choices of both oppoents
    //user timer before starting next round 
    //Show Choices for next round
    //change choices to empty
    db.ref("players/one/choice").set("") 
    db.ref("players/two/choice").set("")
    //update win/losses in db 
    db.ref("players/two/wins").set(player2Wins)
    db.ref("players/one/losses").set(player1Losses)
    //empty player1 & 2 varibles
    player1Choice = "";
    player2Choice = "";
}