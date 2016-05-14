var express=require("express");
var app = express();

var bodyParser = require("body-parser");
var urlencoded = bodyParser.urlencoded({extended:false});

var cities = {
 "Lotopia":"some description", 
 "Caspiana":"description", 
 "Indigo":"description"   
};

app.use(express.static("public"));

app.get("/", function(request, response){
   response.send("OK"); 
});

app.get("/cities", function(request, response){
    response.send(Object.keys(cities));
});

app.post("/cities", urlencoded, function(request, response){
    var newCity = request.body;
    cities[newCity.name] = newCity.description;
    response.status(201).json(newCity.name);
});

module.exports=app;