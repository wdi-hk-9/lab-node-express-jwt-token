var Safehouse = require('../models/safehouse');

// INDEX
function getAll(request,response){
  Safehouse.find(function(error, safehouses){
    if (error) response.json({message: 'There is no MI6, and there are no safehouses here.'});

    response.json({safehouses: safehouses});
  });
}

// CREATE
function createSafehouse(request,response){
  var safehouse = new Safehouse(request.body);
  safehouse.save(function(error){
    if (error) response.json({message: "This location isn't secure enough, you cannot create it here."});

    response.json({safehouse: safehouse});
  });
}

// SHOW
function getSafehouse(request, response){
  var id = request.params.id;

  Safehouse.findOne({_id: id}, function(error, safehouse){

    if(error) { response.status(404).json({message: 'You seem to be mistaken, we have no safehouse with that ID.'}); }
    else if (!safehouse) { response.status(404).json({message: 'You seem to be mistaken, we have no safehouse with that ID.'}); }
    else {
      response.json({safehouse: safehouse});
    }

  });
}

// UPDATE
function updateSafehouse(request, response){
  var id = request.params.id;

  Safehouse.findById({_id: id}, function(error, safehouse) {
    if (error) response.json({message: 'You seem to be mistaken, we have no safehouse with that ID.'});

    if(request.body.name) safehouse.name = request.body.name;
    if(request.body.codename) safehouse.codename = request.body.codename;

    safehouse.save(function(error) {
      if (error) response.json({message: "There seems to be some error in updating your safehouse."});

      response.json({message: 'Safehouse successfully updated.', safehouse: safehouse});
    });
  });
}

// DELETE
function removeSafehouse(request, response){
  var id = request.params.id;
  Safehouse.remove({_id: id}, function(error) {
    if (error) response.json({message: 'You seem to be mistaken, we have no safehouse with that identity.'});

    response.json({message: 'Safehouse has been successfully deleted'});
  });
}

module.exports = {
  getAll: getAll,
  createSafehouse: createSafehouse,
  getSafehouse: getSafehouse,
  updateSafehouse: updateSafehouse,
  removeSafehouse: removeSafehouse
};