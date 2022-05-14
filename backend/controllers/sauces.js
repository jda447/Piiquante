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
  const sauce = {};
  const url = req.protocol + '://' + req.get('host');
  req.body = sauce;
  if (req.file) {
    Sauce.updateOne({_id: req.params.id},
      { $set: { name: sauce.name,
        manufacturer: sauce.manufacturer,
        description: sauce.description,
        imageUrl: url + '/images/' + req.file.filename,
        mainPepper: sauce.mainPepper,
        heat: sauce.heat }}
    ).then(
      () => {
        res.status(201).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(400).json(error);
      }
    )
  }
};

// exports.modifySauce = (req, res, next) => {
//   if (req.file) {
//     const url = req.protocol + '://' + req.get('host');
//     Sauce.updateOne({_id: req.params.id},
//       { $set: { name: req.body.name,
//         manufacturer: req.body.manufacturer,
//         description: req.body.description,
//         imageUrl: url + '/images/' + req.file.filename,
//         mainPepper: req.body.mainPepper,
//         heat: req.body.heat }}
    // ).then(    
    //   (sauce) => {
    //     res.status(201).json(sauce);
    //   })
//     } else {
//       Sauce.updateOne({_id: req.params.id},
//         { $set: { name: req.body.name,
//           manufacturer: req.body.manufacturer,
//           description: req.body.description,
//           mainPepper: req.body.mainPepper,
//           heat: req.body.heat }}
//       ).then(    
//       (sauce) => {
//         res.status(201).json(sauce);
//       }
//       ).catch(
//         (error) => {
//           res.status(400).json(error);
//         }
//       )
//     }
//   };
  

// exports.likeSauce = (req, res, next) => {
//   const sauce = {};
//   let likedUsers = [];
//   let dislikedUsers = [];
//   if (req.body.like !== 0)
//     if (req.body.like === 1) {
//       sauce.$inc = { likes: 1 }
//       sauce.$addToSet = { usersLiked: req.body.userId }
//       likedUsers.push(req.body.userId);
//     } else {
//       sauce.$inc = { dislikes: 1 }
//       sauce.$addToSet = { usersDisliked: req.body.userId }
//       dislikedUsers.push(req.body.userId);
//     } else {
//       if (likedUsers.indexOf(req.body.userId)) {
//         { sauce.$inc = { likes: -1 } }
//         { sauce.$pull = { usersLiked: req.body.userId} }
//         likedUsers.splice(0, 1);
//       } else {
//         { sauce.$inc = { dislikes: -1 } }
//         { sauce.$pull = { usersDisliked: req.body.userId} }
//         dislikedUsers.splice(0, 1);
//       }
//     }
//     Sauce.updateOne({_id: req.params.id}, sauce).then(
//       () => {
//         res.status(201).json(sauce);
//       }
//     ).catch(
//       (error) => {
//         res.status(400).json(error);
//       }
//     )
// };

exports.likeSauce = (req, res, next) => {
  const sauce = {};
  if (req.body.like !== 0)
    if (req.body.like === 1) {
      sauce.$inc = { likes: 1 }
      sauce.$addToSet = { usersLiked: req.body.userId }
      Sauce.updateOne({_id: req.params.id}, sauce).then(
        () => {res.status(201).json({message: 'Success!'});
        })
    } else {
      sauce.$inc = { dislikes: 1 }
      sauce.$addToSet = { usersDisliked: req.body.userId }
      Sauce.updateOne({_id: req.params.id}, sauce).then(
        () => {res.status(201).json({message: 'Success!'});
        })
    } else {
      Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
      if (sauce.usersLiked.includes(req.body.userId)) {
        { sauce.$inc = { likes: -1 } }
        { sauce.$pull = { usersLiked: req.body.userId} }
      } else {
        { sauce.$inc = { dislikes: -1 } }
        { sauce.$pull = { usersDisliked: req.body.userId} }
      }
      Sauce.updateOne({_id: req.params.id}, sauce).then(
        () => {
          res.status(201).json(sauce);
        }
      ).catch(
        (error) => {
          res.status(400).json(error);
        }
      )
    })
  }
};


/* 
exports.likeSauce = (req, res, next) => {
  const sauce = {};
    if (req.body.like === 1) {
      sauce.$inc = { likes: 1 }
      sauce.$addToSet = { usersLiked: req.body.userId }
    } else if (req.body.like === -1) {
      sauce.$inc = { dislikes: 1 }
      sauce.$addToSet = { usersDisliked: req.body.userId }
    } else {
      Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
          if (sauce.usersLiked.includes(req.body.userId)) {
            console.log(sauce.usersLiked);
            { sauce.$inc = { likes: -1 } }
            { sauce.$pull = { usersLiked: req.body.userId} }
          } else {
            { sauce.$inc = { dislikes: -1 } }
            { sauce.$pull = { usersLiked: req.body.userId} }
          }
        }
      )
    }
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
*/