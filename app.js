var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var urlencoded = bodyParser.urlencoded({ extended: false });
var redis = require("redis");

//REDIS connection....
var client;
if (process.env.REDISTOGO_URL) {
    var rtg = require("url").parse(process.env.REDISTOGO_URL);
    client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
} else {
    client = redis.createClient(); 
    client.select((process.env.NODE_ENV || "development").length);
}

//END REDIS connection....

app.use(express.static("public"));

app.get("/", function(request, response) {
    response.send("OK");
});

app.get("/cities", function(request, response) {
    client.hkeys("cities", function(error, names) {
        response.send(names);
    })

});

app.post("/cities", urlencoded, function(request, response) {
    var newCity = request.body;

    client.hset("cities", newCity.name, newCity.description, function(error) {
        if (error) throw error;
        response.status(201).json(newCity.name);
    });
});

module.exports = app;