require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT !== undefined ? process.env.PORT : 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

/// start a session with a set of characters and preload possible words
//query in form of: localhost:3000/start?letters=abcde
app.get("/start", (req, res) => {
  //get letters being used from the query
  let letters = req.query.letters;

  //make call to dictionary api
  fetch(`https://www.anagrammer.com/word-unscrambler/${letters}`)
    .then((response) => response.text())
    .then((siteText) => {
      const $ = cheerio.load(siteText);

      let validWords = [];
      // in the div with class = vissible-sm
      $('div[class="vissible-sm"]')
        //find the <a> tags in the elements with class = r
        .find(".r > a")
        //for each <a> tag push the text content to list
        .each(function (index, element) {
          validWords.push($(element).text());
        });
      //send a json response of the list
      res.json(validWords);
    });
});
