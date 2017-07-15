
var secretKeys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var userInput1 = process.argv[2];
var userInput2 = process.argv[3];
var omdbURL = 'http://www.omdbapi.com/?apikey=40e9cece&t=';

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

function movieThis(body) {
    var obj = JSON.parse(body);
    console.log('Title:' + ' ' + obj.Title);
    console.log('Year:' + ' ' +obj.Year);
    console.log('Rating:' + ' ' +obj.Ratings[0].Source + ':' + ' ' + obj.Ratings[0].Value );
    console.log('Rating:' + ' ' +obj.Ratings[1].Source + ':' + ' ' + obj.Ratings[1].Value );
    console.log('Country:' + ' ' +obj.Country);
    console.log('Language:' + ' ' +obj.Language);
    console.log('Plot:' + ' ' +obj.Plot);
    console.log('Actors:' + ' ' +obj.Actors); 
}

function spotifySearch(){
        spotify.search({ type: 'track', query: userInput2}, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            } 
            for (var i = 0; i < 6; i++) {
                console.log("Artist(s):" + ' ' + data.tracks.items[i].artists[0].name);
                console.log("Song Name:" + ' ' + data.tracks.items[i].name);
                console.log("Spotify Link:" + ' ' + data.tracks.items[i].preview_url);
                console.log("Album:" + ' ' + data.tracks.items[i].album.name);
                console.log("\n")       
            }
        });
}

if (!userInput1){
    console.log("You didn't type anything after 'node liri.js' !");
    return;
}

switch(userInput1) {
  
    case 'my-tweets':
        if(userInput1 && userInput2){
            console.log("Please do not enter data after 'my-tweets' on the command line.  Please try the command again.");
            return;
        }
        client.get('https://api.twitter.com/1.1/statuses/user_timeline.json', function(error, tweets, response) {
            tweets.forEach(function(element) {
            console.log(element.created_at + '     ' +  element.text);        
        });
    });
    break;
    
    case 'spotify-this-song':
        if (!userInput2){
            spotify.search({ type: 'track', query: 'Ace of Base'}, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artist(s):" + ' ' + data.tracks.items[0].album.artists[0].name);
        console.log("Song Name:" + ' ' + data.tracks.items[0].name);
        console.log("Spotify Link:" + ' ' + data.tracks.items[0].preview_url);
        console.log("Album:" + ' ' + data.tracks.items[0].album.name);
        });
        return;
        }
        spotifySearch();
        break;
    
    case 'movie-this':
        if (!userInput2){
            request(omdbURL + 'Mr Nobody', function (error, response, body){
                movieThis(body);
        });
            return;
        }

        request(omdbURL + userInput2, function (error, response, body){
            movieThis(body);
        });
        break;
    
    case 'do-what-it-says':
        fs.readFile('./random.txt','utf8', function(err, data){
            var randomArr = data.split(',');
            userInput2 = randomArr[1];
            spotifySearch();
        });
        break;

    default:
    console.log("You typed something wrong.  Please check your command line entry!")
}

