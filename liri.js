require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var fs = require("fs");
var request = require("request");

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


  switch (command) {
    case "my-tweets":
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
        break;

    case "do-what-it-says":
        fs.readFile("random.txt", "utf8", function(err, data){
            if (err) {
                return console.log(err);
            }
            var defaultItems = data.split(",")
            media = defaultItems[1]
            song()
        });
        break;

    case "spotify-this":
        if (media === '' && command === "spotify-this"){
            media = 'the sign ace of base'
        } 
        song()
        break;

    case "movie-this":
        if (media === ''){
            media = 'mr nobody'
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + media + "&y=&plot=short&apikey=trilogy";
        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              console.log("Title: " + JSON.parse(body).Title + "\nRelease Year: " + JSON.parse(body).Year +
                "\nRating: " + JSON.parse(body).Rated + "\nRotten Tomatoes Score: " + JSON.parse(body).Ratings[1].Value
                + "\nLanugage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors);
            }
          });
        
        break;
  }

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
      
  }