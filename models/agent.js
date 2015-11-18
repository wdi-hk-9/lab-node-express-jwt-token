var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');


var AgentSchema = mongoose.Schema({
  name: String,
  unencryptedName: String,
  codename: String
});

// Let's craft how our JSON object should look!
// http://mongoosejs.com/docs/api.html#document_Document-toObject
AgentSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var returnJson = {
      id: ret._id,
      name: ret.name,
      unencryptedName: ret.unencryptedName,
      codename: ret.codename
    };
    return returnJson;
  }
});

// Let's encrypt our passwords using only the model!
// This is a hook, a function that runs just before you save.
AgentSchema.pre('save', function(next) {
  var agent = this;

  // only hash the name if it has been modified (or is new)
  if (!agent.isModified('name')) return next();

  // just for example purposes, let's keep the agent's name in a separate field
  agent.unencryptedName = agent.name;
  // bcrypt can come up with a salt for us (just pass it a number)
  agent.name = bcrypt.hashSync(agent.unencryptedName, 10);

  next();
});

AgentSchema.methods.authenticate = function(name, callback) {
  // Compare is a bcrypt method that will return a boolean,
  // if the first argument once encrypted corresponds to the second argument
  bcrypt.compare(name, this.name, function(err, isMatch) {
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('Agent', AgentSchema);
