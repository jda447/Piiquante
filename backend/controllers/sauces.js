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
  const sauce = {};
  if (req.body.like === 1) {
    sauce.$inc = { likes: 1 }
		sauce.$push = { usersLiked: req.body.userId }
  } else if (req.body.like === -1) {
    sauce.$inc = { dislikes: 1 }
    sauce.$push = { usersDisliked: req.body.userId }
  } else {
    Sauce.findOne({_id: req.params.id}, sauce).then(
      () => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          sauce.$inc = { likes: -1 };
          sauce.$pull = { usersLiked: req.body.userId };
        } else {
          sauce.$inc = { dislikes: -1 };
          sauce.$pull = { usersDisliked: req.body.userId };
        }
      })
    };
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({ message: 'Success!' });
    }
  ).catch(
    (error) => {
      res.status(400).json(error);
    }
  )
};

/*
exports.likeSauce = (req, res, next) => {
  const newObj = {};
  if (req.body.like === 1) {
    newObj.$inc = { likes: 1 }
		newObj.$push = { usersLiked: req.params.userId }
  } else if (req.body.like === -1) {
    newObj.$inc = { dislikes: 1 }
    newObj.$push = { usersDisLiked: req.params.userId }
  } else {
    Sauce.findOne({_id: req.params.id}).then(
      (sauce) => {
        if (sauce.usersLiked.includes(req.params.userId)) {
				newObj.$inc = { likes: -1 }
				newObj.$pull = { usersLiked: req.params.userId }
        } else {
				newObj.$inc = { dislikes: -1 }
				newObj.$pull = { usersDisliked: req.params.userId }
			}
      Sauce.updateOne({_id: req.params.id}, newObj).then(
        () => {
          res.status(201).json(sauce);
        }
      ).catch(
        (error) => {
          res.status(400).json(error);
        }
      );
    })
  }
};
*/