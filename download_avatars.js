var request = require('request');
var fs = require('fs');
var {token} = require('./secrets');
console.log('Welcome to the GitHub Avatar Downloader!');

const args = process.argv.slice(2);

function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
      url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
      headers: {
      'User-Agent': 'request',
      "Authorization": token,
    },
    json: true  //will automatically do JSON parse on results
  }
  // console.log(options.url);
  request.get(options, function(err, res, body) {
    cb(err, body);
  });

}

function downloadImageByURL(url, filePath) {
  console.log('Starting downloadImageByURL with', url, filePath);
  request.get(url)               
         .on('error', function (err) {                                   // Note 2
           throw err; 
         })
         .on('response', function (response) {                           // Note 3
           console.log('Response Status Code: ', response.statusCode);
         })
         .pipe(fs.createWriteStream(filePath));  
}

getRepoContributors(args[0], args[1], function(err, contributors) {
  console.log("Errors:", err);
  // console.log(JSON.stringify(result, null, 2));
  for (const contributor of contributors) {
    // console.log(contributor.login);
    // console.log(contributor.avatar_url);
    downloadImageByURL(contributor.avatar_url, `./avatar/${contributor.login}.jpg`);
  }
});
