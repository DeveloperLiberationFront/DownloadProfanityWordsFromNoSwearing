var request = require('request'),
    cheerio = require('cheerio'),
    _ = require('lodash'),
    Promise = require('bluebird');


function pProfanityWords() {
  var letters = _.map(new Array(26), function(value, index) {
    return String.fromCharCode('a'.charCodeAt(0) + index);
  });

  var wordsPs = _.map(letters, function(letter) {
    return new Promise(function(resolve, reject) {
      request('http://www.noswearing.com/dictionary/' + letter,
          function(err, res, body) {
        if (err) return reject(err);
        var $ = cheerio.load(body);

        var words = $('center > div > table td:nth-child(1) b')
        .map(function(i, el) {
          var word = $(el).text();
          return word;
        }).toArray();

        return resolve(words);
      });
    });
  });

  return Promise.all(wordsPs)
  .then(function(wordsLists) {
    return _.flatten(wordsLists);
  });
}

if (module.parent) {
  return pProfanityWords;
} else {
  pProfanityWords().then(console.log.bind(console)).done();
}

