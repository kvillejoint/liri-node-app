//Variables for use in commands
const keys = require('./keys.js')
const fs = require('fs');
const request = require('request');
const omdb = require('omdb');

var Twitter = require('Twitter');

var client = new Twitter({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token_key: keys.access_token_key,
    access_token_secret: keys.access_token_secret
});


//variable to capture user commands from terminal
let command = process.argv[2];

//variable for user input of media title
let mediaArray = process.argv.slice(3);
let media = mediaArray.join(' ');
console.log('Media: ' + media);

//OMDB queryUrl setup for API calls
let queryUrl = "http://www.omdbapi.com/?t=" + media + "&y=&plot=short&apikey=40e9cece";
console.log('QueryUrl: ' + queryUrl);


//function for liri commands
//Note: alternative to switch is to use if else statements
console.log("Command triggered: " + command);
switch (command) {
    case 'my-tweets':
        console.log("pull twitter info");
        twitterInfo();
        break;
    case 'movie-this':
        console.log("pull movie info");
        movieInfo(media);
        break;
    case 'do-this':
        console.log("do this");
        doWhatItSays();
        break;
    default:
        console.log('Default');
}

//function to pull twitter info
function twitterInfo() {
    //show last 20 tweets
    var params = {
        screen_name: 'kvcoder',
        count: 20
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log('Most Recent Tweets');
            console.log('========================');

            for (var i in tweets) {
                console.log(tweets[i].text);
            }

            let twitterUrl = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=kvcoder&count=20&exclude_replies=true'

            client.get('https://api.twitter.com/1.1/statuses/user_timeline.json', 'screen_name=kvcoder&count=20&exclude_replies=true', function(response) {
                console.log(response);
            });
        }
    });
}

//function to pull movie info
function movieInfo(movie) {
    // set variables for API calls
    let queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece"; //query url for request search
    console.log(queryUrl);

    request(queryUrl, function(error, response, body) {
        console.log('error: ' + error); //prints error if there is one
        console.log('statusCode: ' + response && response.statusCode); //prints status code of response
        //console.log('body: ' + body); //prints html for homepage

        const omdbBody = JSON.parse(body);

        console.log('Title: ' + omdbBody.Title);
        console.log('Release Year: ' + omdbBody.Relseased);
        console.log('IMDB Rating: ' + omdbBody.Rating);
        console.log('Country: ' + omdbBody.Country);
        console.log('Language: ' + omdbBody.Language);
        console.log('Plot: ' + omdbBody.Plot);
        console.log('Actors: ' + omdbBody.Actors);
        console.log('Rotten Tomatoes Rating: ' + omdbBody.Ratings[1].value);
        console.log('Poster: ' + omdbBody.Poster);

        if (command == 'movie-this' && !movie) {
            //movie title ot Mr Nobody not passing into queryUrl for search
            let media = "Mr Nobody";
            let queryUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=40e9cece";
            request(queryUrl, function(error, response, body) {
                if (!error) {
                    let omdbBody = JSON.parse(body);

                    console.log('Title: ' + omdbBody.Title);
                    console.log('Release Year: ' + omdbBody.Relseased);
                    console.log('IMDB Rating: ' + omdbBody.Rating);
                    console.log('Country: ' + omdbBody.Country);
                    console.log('Language: ' + omdbBody.Language);
                    console.log('Plot: ' + omdbBody.Plot);
                    console.log('Actors: ' + omdbBody.Actors);
                    //Ratings[1] from OMDB not registring value here but works with normal movie-this command that includes movie title
                    console.log('Rotten Tomatoes Rating: ' + omdbBody.Ratings[1].value);
                    console.log('Poster: ' + omdbBody.Poster);
                }
            });
        };
    })
};

function doWhatItSays() {
    //take text from random.txt, call one of the liri commands, append log file
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            console.log(error);
        } 
        //append to log.txt file

        // else if ('')
        // fs.appendFile('log.txt', ',' + data, function (error) {
        //     if (error) {
        //         console.log(error);
        //     }
        // });
        data = data.split(",")
        console.log(data)
        if(data[0] == "movie-this") {
            console.log("Run movie function & search: " + data[1])
            //movieInfo(data[1]); //function call is not working yet
        } else {
            console.log("Run twitter function & search: " + data[1])
            twitterInfo();
        }
    });
};
