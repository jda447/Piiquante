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

/*
exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.params.id,
      userId: req.body.sauce.userId,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      imageUrl: url + '/images/' + req.file.filename,
      mainPepper: req.body.sauce.mainPepper,
      heat: req.body.sauce.heat
    };
  } else {
    sauce = {
      _id: req.params.id,
      userId: req.body.sauce.userId,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      imageUrl: req.body.imageUrl,
      mainPepper: req.body.sauce.mainPepper,
      heat: req.body.sauce.heat
    };
  }
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json();
    }
  ).catch(
    (error) => {
      res.status(400).json(error);
    }
  );
};
*/

exports.likeSauce = (req, res, next) => {
  if (Sauce.usersLiked.includes(req.params.id))
  Sauce.update({_id: req.params.id}).then(
    { Sauce },
    { $inc: { likes: -1 },
      $pull: { usersLiked: [_id] }}
    );
  else (
    { Sauce },
    { $inc: { likes: 1 },
      $push: { usersLiked: [_id] }}
  );

  if (Sauce.usersDisliked.includes(req.params.id))
  Sauce.update({_id: req.params.id}).then(
    { Sauce },
    { $inc: { dislikes: -1 },
      $pull: { usersDisliked: [_id] }}
    );
  else (
    { Sauce },
    { $inc: { dislikes: 1 },
      $push: { usersDisliked: [_id] }}
  );
  Sauce.updateOne({_id: req.params.id}.then(
    () => {
      res.status(201).json(Sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json(error);
    })
  );
};

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