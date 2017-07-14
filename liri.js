var secretKeys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var userInput1 = process.argv[2];
var userInput2 = process.argv[3];

var client = new Twitter({
  consumer_key: secretKeys.twitterKeys.consumer_key,
  consumer_secret: secretKeys.twitterKeys.consumer_secret,
  access_token_key: secretKeys.twitterKeys.access_token_key,
  access_token_secret: secretKeys.twitterKeys.access_token_secret
});

var spotify = new Spotify({
  id: secretKeys.spotifyKeys.clientId_key,
  secret: secretKeys.spotifyKeys.clientSecret_key
});

if (!userInput1){
    console.log("You didn't type anything after 'node liri.js' !")
}

else if (userInput1 === 'my-tweets') {
    client.get('https://api.twitter.com/1.1/statuses/user_timeline.json', function(error, tweets, response) {
        tweets.forEach(function(element) {
            console.log(element.created_at + '     ' +  element.text);
        });
    });
}

else if (userInput1 === 'spotify-this-song') {
    spotify.search({ type: 'track', query: userInput2}, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // data.tracks.items.forEach(function(element){
        //     console.log(element.album.artists);
        // });
        console.log(data.tracks.items);
    });
}
