// Set up ----------------------------------------------------------------------------------------------------------------------------------------------

require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var fs = require("fs");
var request = require("request");


//Take in user input ----------------------------------------------------------------------------------------------------------------------------------------------
var args = process.argv;
var command = args[2];
var media = '';

for (var i = 3; i < args.length; i++) {
    if (i > 3 && i < args.length) {
      media = media + "+" + args[i];
    }
    else {
      media = args[i];
    }
  }


// Run app ----------------------------------------------------------------------------------------------------------------------------------------------
function doStuff (){
    switch (command) {
      case "my-tweets":
          showTweets()
          log()
          break;
      case "spotify-this":
          if (media === '' && command === "spotify-this"){
              media = 'the sign ace of base'
          } 
          song()
          log()
          break;
      case "movie-this":
          if (media === ''){
              media = 'mr nobody'
          }
          movie() 
          log()       
          break;
      case "do-what-it-says":
          doWhatitSays()
          break;
      default:
      console.log("Please enter a valid command. Try my-tweets, spotify-this, movie-this, or do-what-it-says")
    }
}

doStuff()


//Functionality  ----------------------------------------------------------------------------------------------------------------------------------------------
  function song () {
    spotify.search({ type: 'track', query: media }, function (err, data) {
        if (!err) {
            var info = data.tracks.items;
            console.log(
                "\nArtist: " + info[0].artists[0].name +
                "\nSong: " + info[0].name +
                "\nAlbum: " + info[0].album.name +
                // ATTN: Some songs preview url returns null
                "\nPreview: " + info[0].preview_url
            )
        } else {
            return console.log(err);
        }
    });
  }
  function movie (){
    var queryUrl = "http://www.omdbapi.com/?t=" + media + "&y=&plot=short&apikey=trilogy";
        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              console.log("Title: " + JSON.parse(body).Title + "\nRelease Year: " + JSON.parse(body).Year +
                "\nRating: " + JSON.parse(body).Rated + "\nRotten Tomatoes Score: " + JSON.parse(body).Ratings[1].Value
                + "\nLanugage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors);
            }
          });
  }
  function doWhatitSays (){
    fs.readFile("random.txt", "utf8", function(err, data){
        if (err) {
            return console.log(err);
        }
        var defaultItems = data.split(",")
        command = defaultItems[0]
        media = defaultItems[1]
        doStuff()
    });
  }
  function showTweets (){
    var params = {
        screen_name: 'QuintyQuints',
        count: 20,
        result_type: 'recent',
      }
      client.get('statuses/user_timeline', params, function(err, data, response) {
        if(!err){
          for (let i = 0; i < data.length; i++){
              console.log(data[i].created_at, ':\n' + data[i].text + '\n')
          }
        } else {
          return console.log(err);
        }
      })
  }
  function log (){
    fs.appendFile("log.txt", [`${command}  ${media} \n`], function(err) {
        if (err) {
          return console.log("error");
        }
        // console.log("log.txt was updated!");
      
      });
  }
