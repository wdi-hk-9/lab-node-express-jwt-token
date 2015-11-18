var mongoose = require('mongoose');

var SafehouseSchema = mongoose.Schema({
  location: String,
  codename: String,
    agents: Array
});

// Let's craft how our JSON object should look!
// http://mongoosejs.com/docs/api.html#document_Document-toObject
SafehouseSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var returnJson = {
      id: ret._id,
      codename: ret.codename,
      location: ret.location,
      agents: ret.agents
    };
    return returnJson;
  }
});

module.exports = mongoose.model('Safehouse', SafehouseSchema);