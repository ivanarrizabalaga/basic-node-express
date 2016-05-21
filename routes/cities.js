var express = require("express");
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

var router = express.Router();

router.route("/")
    .get(function(request, response) {
        client.hkeys("cities", function(error, names) {
            response.send(names);
        })

    }).post(urlencoded, function(request, response) {
        var newCity = request.body;

        if (!newCity.name || !newCity.description) {
            response.sendStatus(400);
            return;
        }

        client.hset("cities", newCity.name, newCity.description, function(error) {
            if (error) throw error;
            response.status(201).json(newCity.name);
        });
    });
    
router.route("/:name")
    .delete(function(request, response) {
        client.hdel("cities", request.params.name, function(error) {
            if (error) throw error;

            response.sendStatus(204);
        });
    }).get(function(request, response) {
        client.hget("cities", request.params.name, function(error, description) {
            response.render("show.ejs", {
                city: {
                    name: request.params.name,
                    description: description
                }
            });
        });
    });
    
    
module.exports = router;