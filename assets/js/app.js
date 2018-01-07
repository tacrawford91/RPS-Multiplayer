
console.log("hello")

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

  //set database varible 
  var database = firebase.database();

  //initialize database structure
  database.ref().set({
    players: {"1":{
        choice:"",
        losses:0,
        name:"",
        wins:0
        }  
    ,"2":{
        choice:"",
        losses:0,
        name:"",
        wins:0
        }
    }
})
  


  //listen to form
  //If(db.players.1 !== "") If (player one doesnt exist)
  //set to player 1
  //if existing setup player 2
