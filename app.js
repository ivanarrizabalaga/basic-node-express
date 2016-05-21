var express = require("express");
var app = express();
var cities = require("./routes/cities");

app.use(express.static("public"));
app.get("/", function(request, response) {
    response.send("OK");
});
app.use("/cities",cities);

module.exports = app;