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
  var database = firebase.database();
 //initial database set up
//  database.ref().set({
//     players: {"one":{
//         choice:"",
//         losses:0,
//         name:"",
//         wins:0
//         }  
//     ,"two":{
//         choice:"",
//         losses:0,
//         name:"",
//         wins:0
//         }
//     }
// })
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

// create player players node once on load, do not if it exists

//listen to form and define user
$("#add-player").on("click", function(){
    event.preventDefault();
    //get store name in unknown
    var newPlayer = $("#new-player").val().trim();
    //assign to either player one or two
    //first see if player 1 exists 

    database.ref("players").on("value", function(snapshot) {
        //set db varibles for easy access
        dbPlayer1Name = snapshot.child("one").child("name").val()
        dbPlayer2Name = snapshot.child("two").child("name").val()

        // if (existingplayer1 === undefined) {
        //     database.ref().set("players")
        //     database.ref("players").push({"one":{
        //         choice:"",
        //         losses:0,
        //         name:newPlayer,
        //         wins:0
        //         }  

        //     })
        // } else





        if (dbPlayer1Name === "") {
            dbPlayer1Name = newPlayer
            //set player 1 in db
            database.ref("players/one/name").set(dbPlayer1Name)
             //show player 1 choices
            $(".choicep1").show();
            //remove p2 choices
            $(".choicep2").remove();

        } else if (dbPlayer2Name === "" && dbPlayer1Name !== newPlayer) {
            dbPlayer2Name = newPlayer
            //set player 2 in db
            database.ref("players/two/name").set(dbPlayer2Name)
            //show player 2 choices
            $(".choicep2").show();
            //remove p1 choices
            $(".choicep1").remove();
        } 
    })
})

















  // USE THIS CODE AND ASSIGN ONLINE AFTER PLAYER 1 has been assign a user then assign connnection value?
  // connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#watchers").text(snap.numChildren());
});