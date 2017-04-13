var express = require('express')
var htmlToJson = require("html-to-json")
var app = express()

app.get('/', function (req, res) {
  res.send("<a href='roll'>Roll!</a>")
})

app.get('/roll', function (req, res) {
  htmlToJson.request('http://www.recursionpharma.com/team.html', {
    'data': {
      $container: '#741471631897133620-gallery',
      'team': function ($t) {
        htmlToJson.parse($t.html(), {
          'employees': ['.galleryInnerImageHolder', function ($galleryInnerImageHolder) {
            	return $galleryInnerImageHolder.find('a').attr('href');
          }]
        }, function (err, result) {
          var employeeCount = result.employees.length;
          console.log(employeeCount + ' employees');
          console.log(result);
          var randomEmployee = result.employees[Math.floor(Math.random()*employeeCount)];
          console.log('randomly selected ' + randomEmployee)
          res.redirect('http://www.recursionpharma.com' + randomEmployee);
        });
      }
    }
  });
})

var port = 3000;

console.log('listening on port ' + port);
app.listen(port)
