var request = require("request");
var SlackBot = require('slackbots');
var secrets = require("./secrets.json");

var employeeList = [];

var bambooHrSubdomain = secrets.bambooHrSubdomain;
var bambooHrApiKey = secrets.bambooHrApiKey;


function updateEmployeeList() {

  var options = { method: 'GET',
    url: `https://${bambooHrApiKey}:x@api.bamboohr.com/api/gateway.php/${bambooHrSubdomain}/v1/employees/directory`,
    headers:
     { accept: 'application/json' } };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    employeeList = JSON.parse(body).employees;
    console.log(employeeList);
  });

  setTimeout(updateEmployeeList, 1000*60*60*24);
}

updateEmployeeList();

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
        var randomEmployee = employeeList[Math.floor(Math.random()*employeeList.length)];
        var name = randomEmployee.displayName;
        if(randomEmployee.preferredName)
          name = randomEmployee.preferredName;
        console.log(u.name + ' requested employee, received ' + name);
        bot.postMessageToUser(u.name, `hi ${u.name} your random employee is ${name}\n${randomEmployee.photoUrl}`, params);
      })
    }
});
