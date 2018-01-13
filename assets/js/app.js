
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
  // set up connections ref
  var connectionsRef = db.ref("/connections")
  var connectedRef = db.ref(".info/connected");
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
 var numberOfPlayers = 0;
 var player1Exists = false;
 var player1ChoiceDisp;
var player2ChoiceDisp;
var turns = 0;


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
//set initial presence


// //listen to form and define user
// $("#add-player").on("click", function(){
//     event.preventDefault();
//     //get store name in unknown
//     var newPlayer = $("#new-player").val().trim();
//     //assign to either player one or two
//     db.ref("players").on("value", function(snapshot) {
//         //set db varibles for easy access
//         dbPlayer1Name = snapshot.child("one").child("name").val()
//         dbPlayer2Name = snapshot.child("two").child("name").val()

//         if (dbPlayer1Name === "") {
//             // //set player 1 in db
//             db.ref("players/one/name").set(dbPlayer1Name)
//              //show player 1 choices
//             $(".choicep1").show();
//             //remove p2 choices
//             $(".choicep2").remove();
//             //Presence Stuff
//             connectedRef.on("value", function(snap) {
//                 // If they are connected..
//                 if (snap.val()) {
//                  // Add user to the connections list.
//                   var con1 = connectionsRef.push(true);
//                   db.ref("players/one/status").set("online")
//                   // Remove user from the connection list when they disconnect.
//                   con1.onDisconnect().remove();
//                   db.ref("players/two").onDisconnect().remove();
//                 }
//               });

//         } else if (dbPlayer2Name === "" && dbPlayer1Name !== newPlayer) {
//             dbPlayer2Name = newPlayer
//             //set player 2 in db
//             db.ref("players/two/name").set(dbPlayer2Name)
//             //show player 2 choices
//             $(".choicep2").show();
//             //remove p1 choices
//             $(".choicep1").remove();
//              //Presence Stuff
//              connectedRef.on("value", function(snap) {
//                 // If they are connected..
//                 if (snap.val()) {
//                  // Add user to the connections list.
//                   var con2 = connectionsRef.push(true);
//                   db.ref("players/two/status").set("online")
//                   // Remove user from the connection list when they disconnect.
//                   con2.onDisconnect().remove();
//                   db.ref("players/one").onDisconnect().remove();
//                 }
//             })
//         } 
//     })
// })

//Delete above - 
$("#add-player").on("click", function(){
    event.preventDefault();
    var newPlayer = $("#new-player").val().trim();

    if (numberOfPlayers < 1) {
        // show player 1 choices
            $(".choicep1").show();
            //remove p2 choices
            $(".choicep2").remove();
            //Presence Stuff
            connectedRef.on("value", function(snap) {
                // If they are connected..
                if (snap.val()) {
                 // Add user to the connections list.
                  var con1 = connectionsRef.push(true);
                  // Remove user from the connection list when they disconnect.
                  con1.onDisconnect().remove();
                  db.ref("players/one").onDisconnect().remove();
                }
              });
              
              //create player one
         db.ref("players/one").set({
            choice: "",
            losses: player1Losses,
            name: newPlayer,
            wins: player1Wins
        
        });
        //show player 1 name
        $(".player1Name").html(`Player 1:${newPlayer}`);
        newPlayer = ""
    } else if (numberOfPlayers === 1) {
        //create user two 
            db.ref("players/two").set({
                choice: "",
                losses: player2Losses,
                name: newPlayer,
                wins: player2Wins
            }) 
            //show player 2 name
            $(".player2Name").html(`Player 2:${newPlayer}`);
            // show player 2 choices
            $(".choicep2").show();
            //remove p1 choices
            $(".choicep1").remove();
            //Presence Stuff
            connectedRef.on("value", function(snap) {
            // If they are connected..
                if (snap.val()) {
                    // Add user to the connections list.
                    var con2 = connectionsRef.push(true);
                    // Remove user from the connection list when they disconnect.
                    con2.onDisconnect().remove();
                    db.ref("players/two").onDisconnect().remove();
                }
        })
    }
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
        turns++
        db.ref("turns").set(turns)
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
        turns++
        db.ref("turns").set(turns)
})

//number of players
connectionsRef.on("value", function(snap) {
    numberOfPlayers = snap.numChildren()
    console.log("number of players" + numberOfPlayers);
//check number of players
    if (numberOfPlayers === 2) {
        db.ref().on("value", function(snapshot) {
            // get players 1 choice and name from db
            if( snapshot.val().players.one !== undefined) {
            dbplayer1Choice = snapshot.val().players.one.choice
            dbPlayer1Name = snapshot.val().players.one.name;
            $(".player1Name").html(`Player 1:${dbPlayer1Name}`);
            } else {
                $(".player1Name").html("Player 1 Disconnected");
                player1Wins = 0;
                player1Losses = 0;
            }
            //set player 2 choice name if exists (also not disconnected)
            if( snapshot.val().players.two !== undefined) {
                dbplayer2Choice = snapshot.val().players.two.choice;
                dbPlayer2Name = snapshot.val().players.two.name;
                $(".player2Name").html(`Player 2:${dbPlayer2Name}`);
            } else {
                //player 2 disconnect message
                $(".player2Name").html("Player 2 Disconnected");
                player2Wins = 0;
                player2Losses = 0;
            } 
            //Play Game

        }) 

   }

});

db.ref("turns").set(turns)
// play game
db.ref("turns").on("value", function(snapshot) {
rps()
})

function rps() {
    if (dbplayer1Choice !== "" && dbplayer2Choice !=="") {
        //The following is the rps logic
        if ((dbplayer1Choice === "rock") || (dbplayer1Choice === "paper") || (dbplayer1Choice === "scissors")) {

            if ((dbplayer1Choice === "rock") && (dbplayer2Choice === "scissors")) {
            player1winner()
            console.log(" I PLAYED THE GAME")
            return
            } else if ((dbplayer1Choice === "rock") && (dbplayer2Choice === "paper")) {
            player1loser()
            return
            } else if ((dbplayer1Choice === "scissors") && (dbplayer2Choice === "rock")) {
                player1loser();
                return
            } else if ((dbplayer1Choice === "scissors") && (dbplayer2Choice === "paper")) {
            player1winner();
            return
            } else if ((dbplayer1Choice === "paper") && (dbplayer2Choice === "rock")) {
            player1winner();
            return
            } else if ((dbplayer1Choice === "paper") && (dbplayer2Choice === "scissors")) {
            player1loser();
            return
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
    player1ChoiceDisp = dbplayer1Choice
    player2ChoiceDisp = dbplayer2Choice
    player1Choice = "";
    player2Choice = "";
    //diplay in middle square choices of both oppoents
    middlePlayer1Wins()
    //user timer before starting next round 
    setTimeout(roundOver,2000)
}

function player1loser() {
    player2Wins++
    player1Losses++
    player1ChoiceDisp = dbplayer1Choice
    player2ChoiceDisp = dbplayer2Choice
    player1Choice = "";
    player2Choice = "";
    //diplay in middle square choices of both oppoents
    middlePlayer1Loses()
    //user timer before starting next round 
    setTimeout(roundOver,2000)
}

function middlePlayer1Wins() {
    //hide player choices in original blocks 
    $(".selected1").hide()
    $(".selected2").hide()
    // create player 1 to display in the middle square
    var middleSquareP1 = $("<p>").html(`<p>${dbPlayer1Name} Wins! <br> ${player1ChoiceDisp} </p>`).addClass("result winner")
    // create player 2 to displ= $("<p>").html(`<p>${dbPlayer1Name} Wins! <br> ${dbplayer1Choice} </p>`)ay in the middle square
    var middleSquareP2 = $("<p>").html(`<p>${dbPlayer2Name} Lost. <br> ${player2ChoiceDisp} </p>`).addClass("result loser")
    //append to middle square
    $(".middleSquare").append(middleSquareP1);
    $(".middleSquare").append(middleSquareP2);
}
function middlePlayer1Loses() {
    //hide player choices in original blocks 
    $(".selected1").hide()
    $(".selected2").hide()
    // create player 1 to display in the middle square
    var middleSquareP1 = $("<p>").html(`<p>${dbPlayer1Name} Lost. <br> ${player1ChoiceDisp} </p>`).addClass("result loser")
    // create player 2 to displ= $("<p>").html(`<p>${dbPlayer1Name} Wins! <br> ${dbplayer1Choice} </p>`)ay in the middle square
    var middleSquareP2 = $("<p>").html(`<p>${dbPlayer2Name} Wins! <br> ${player2ChoiceDisp} </p>`).addClass("result winner")
    //append to middle square
    $(".middleSquare").append(middleSquareP1);
    $(".middleSquare").append(middleSquareP2);

}
function roundOver() {
    console.log("roundover function ran");
    db.ref("players/one").update({wins: player1Wins})
    db.ref("players/one").update({losses: player1Losses})
    db.ref("players/two").update({wins: player2Wins})
    db.ref("players/two").update({losses: player2Losses})
    //reset choices
    db.ref("players/one/choice").set("") 
    db.ref("players/two/choice").set("") 
    //empty player1 & 2 varibles
    $(".selected1").addClass("choicep1")
    $(".selected2").addClass("choicep2")
    $(".result").remove();
    $(".choicep1").removeClass("selected1");
    $(".choicep2").removeClass("selected2");
    // //Show Choices for next round
    $(".choicep1").show();
    $(".choicep2").show();
    return
}