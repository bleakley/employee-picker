var htmlToJson = require("html-to-json")
var SlackBot = require('slackbots');
var secrets = require("./secrets.json");

var recursionautList = [];

htmlToJson.request('http://www.recursionpharma.com/team.html', {
  'data': {
    $container: '#153152873426670938-gallery',
    'team': function ($t) {
      htmlToJson.parse($t.html(), {
        'employees': ['.galleryInnerImageHolder', function ($galleryInnerImageHolder) {
          	return $galleryInnerImageHolder.find('a').attr('href');
        }]
      }, function (err, result) {
        recursionautList = result.employees;
        boardOfDirectorsElement = recursionautList.indexOf('/uploads/9/4/2/1/942150/slide61_orig.gif');
        recursionautList = recursionautList.slice(0, boardOfDirectorsElement);
        recursionautList = recursionautList.filter(x => {
          return !x.startsWith('/uploads');
        });
        console.log(recursionautList);
        console.log(recursionautList.length);
      });
    }
  }
});

var bot = new SlackBot({
    token: secrets.slackApiToken,
    name: 'Employee Roller'
});

var params = {
    as_user: true
};

bot.on('message', function(data) {
    if(data.type == 'message' && data.user != 'U4ZED7AN7') {
      bot.getUserById(data.user).then(function(u){
        var randomEmployee = recursionautList[Math.floor(Math.random()*recursionautList.length)];
        var url = 'http://www.recursionpharma.com' + randomEmployee;
        console.log(u.name + ' requested employee, received ' + url);
        bot.postMessageToUser(u.name, 'hi ' + u.name + ' your random employee is ' + url, params);
      })
    }
});
