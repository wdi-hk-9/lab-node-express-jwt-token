var express = require('express'),
bodyParser  = require('body-parser'),
mongoose    = require('mongoose'),
expressJWT  = require('express-jwt'),
jwt         = require('jsonwebtoken'),
bcrypt      = require('bcrypt'),
app         = express(),
logger      = require('morgan');
Agent       = require('./models/agent');

mongoose.connect('mongodb://localhost:27017/MI6');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// our secret phrase, to help us make sure everything's encrypted the same way
var secret = "onhermajestyssecretservice";

// JWT access control. Important to have these before our routes, so it can run first!
app.use('/api/agents/:id', expressJWT({secret: secret}));
app.use(function (error, request, response, next) {
  if (error.name === 'UnauthorizedError') {
    response.status(401).json({message: 'You need an authorization token to view confidential information.'});
  }
});

app.post('/api/authorizations', function(request,response){
  var agentParams = request.body;

  // codenames are unencrypted, let's search by that
  Agent.findOne({codename: request.body.codename}, function(error, agent){
    if (!agent) response.status(404).json({message: "There is no agent by that codename."});

    // compare name with bcrypt encrypted name
    if (bcrypt.compareSync(agentParams.name, agent.name)) {
      // create JWT token & send it
      var token = jwt.sign(agent, secret);
      response.json({ agent: agent, token: token });
    } else {
      // if name is not what you claim it is, you get a 401 Not Authorized
      response.status(401).json({message: "You don't have clearance, agent."});
    }
  });
});

var routes = require('./config/routes');
app.use('/api', routes);

app.listen(3000);