const Sauce = require('../models/sauces');
const fs = require('fs');

exports.addSauce = (req, res, next) => {
  req.body.sauce = JSON.parse(req.body.sauce);
  const url = req.protocol + '://' + req.get('host');
  const sauce = new Sauce({
    userId: req.body.sauce.userId,
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    imageUrl: url + '/images/' + req.file.filename,
    mainPepper: req.body.sauce.mainPepper,
    heat: req.body.sauce.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save().then(
    () => {
      res.status(201).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json(error);
    }
  );
}

exports.findOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json(error);
    }
  );
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}).then(
    (sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        Sauce.deleteOne({_id: req.params.id}).then(
          () => {
            res.status(200).json();
          }
        ).catch(
          (error) => {
            res.status(400).json(error);
          }
        );
      });
    }
  );
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json(error);
    }
  );
}

exports.modifySauce = (req, res, next) => {
  Sauce.updateOne({_id: req.params.id}, req.body.sauce).then(
    () => {
      res.status(201).json({message: 'success'});
    }
  ).catch(
    (error) => {
      res.status(400).json(error);
    }
  );
}

exports.likeSauce = (req, res, next) => {
  const newObj = {};
  if (like === 1) {
    newObj.$inc = { likes: 1 }
		newObj.$push = { usersLiked: req.body.userId }
  } else if (like === -1) {
    newObj.$inc = { dislikes: 1 }
    newObj.$push = { usersDisLiked: userId }
  } else {
    Sauce.findOne({_id: req.params.id}).then(
      (sauce) => {
				newObj.$inc = { likes: -1 }
				newObj.$pull = { usersLiked: req.body.userId }
				newObj.$inc = { dislikes: -1 }
				newObj.$pull = { usersDisliked: req.body.userId }
			}
  )}
};
    
  
/*
exports.likeSauce = (req, res, next) => {
  let userId = req.params.userId;
  Sauce.findOne({_id: req.params.id}).then(
    (sauce) => {
    if (!sauce.usersLiked.includes(userId)) {(
      { $inc: { likes: 1 },
      $push: { usersLiked: userId }}
    )
    } else if (!sauce.usersDisliked.includes(userId)) {(
      { $inc: { dislikes: 1 },
      $push: { usersDisLiked: userId }}
    )
    } else {
      ({ $inc: { likes: -1 },
      $pull: { usersLiked: [userId] }},
    { $inc: { dislikes: -1 },
      $pull: { usersDisliked: [userId] }}
      )}
    Sauce.updateOne({_id: req.params.id}, sauce).then(
      () => {
        res.status(201).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(400).json(error);
      }
    );
  })
};
*/


/*
exports.likeSauce = (req, res, next) => {
  Sauce.updateOne(
    { userId: req.params.userId, 
      usersLiked: { $ne: req.params.userId }
    },
    {$inc: { likes: 1 },
      $push: { usersLiked: req.params.userId }
    }
  )
  Sauce.updateOne(
    { userId: req.params.userId, 
      dislikes: req.params.userId },
    { $inc: { dislikes: -1 },
      $pull: { usersDisLiked: req.params.userId }
    })
    Sauce.find(
      { userId: req.params.userId, },
      { usersLiked: { $elemMatch: { $eq: req.params.userId }
    }
    }).then(
    () => {
      res.status(201).json(Sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json(error);
    }
  );
}
*/