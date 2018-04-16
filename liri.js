require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var request = require("request");

var command = process.argv[2];
var args = process.argv;
var media;
var queryUrl;
for (var i = 3; i < args.length; i++) {
    if (i > 3 && i < args.length) {
      media = media + "+" + args[i];
    }
    else {
      media = args[i];
    }
  }

  console.log(command, media)

  switch (command) {
    case "my-tweets":
        console.log("this will eventually show 20 tweets");
        break;
        
    case "spotify-this":
        console.log("this will eventually show Artist(s), The song's name, A preview link of the song from Spotify, The album that the song is from")
        
        spotify.search({ type: 'track', query: media }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var info = data.tracks.items;
            console.log(
                "\nArtist: " + info[0].artists[0].name +
                "\nSong: " + info[0].name +
                "\nAlbum: " + info[0].album.name +
                // ATTN: Some songs preview url returns null
                "\nPreview: " + info[0].preview_url
            )
        });
        break;

    case "movie-this":
        var queryUrl = "http://www.omdbapi.com/?t=" + media + "&y=&plot=short&apikey=trilogy";
        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              console.log("Title: " + JSON.parse(body).Title + "\nRelease Year: " + JSON.parse(body).Year +
                "\nRating: " + JSON.parse(body).Rated + "\nRotten Tomatoes Score: " + JSON.parse(body).Ratings[1].Value
                + "\nLanugage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors);
            }
          });
        
        break;
    case "do-what-it-says":
        console.log("spotify info for I Want it That Way")
        break;
  }