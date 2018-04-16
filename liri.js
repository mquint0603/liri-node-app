require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
// console.log(client)

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