const Sauce = require('../models/sauces')
const fs = require('fs')

exports.addSauce = (req, res, next) => {
  req.body.sauce = JSON.parse(req.body.sauce)
  const url = req.protocol + '://' + req.get('host')
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
  })
  sauce.save().then(
    () => {
      res.status(201).json(sauce)
    }
  ).catch(
    (error) => {
      res.status(400).json(error)
    }
  )
}

exports.findOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce)
    }
  ).catch(
    (error) => {
      res.status(404).json(error)
    }
  )
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(
    (sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlink('images/' + filename, () => {
        Sauce.deleteOne({ _id: req.params.id }).then(
          () => {
            res.status(200).json()
          }
        ).catch(
          (error) => {
            res.status(400).json(error)
          }
        )
      })
    }
  )
}

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces)
    }
  ).catch(
    (error) => {
      res.status(400).json(error)
    }
  )
}

exports.modifySauce = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  let sauce = req.body || {}

  if (req.file) {
    sauce = JSON.parse(req.body.sauce)
    sauce.imageUrl = url + '/images/' + req.file.filename
  }

  Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(
      (sauce) => {
        res.status(201).json(sauce)
      }
    ).catch(
      (error) => {
        res.status(400).json(error)
      }
    )
}

exports.likeSauce = (req, res, next) => {
  const sauce = {}
  const userId = req.body.userId

  if (req.body.like !== 0) {
    if (req.body.like === 1) {
      sauce.$inc = { likes: 1 }
      sauce.$addToSet = { usersLiked: userId }
      Sauce.updateOne({ _id: req.params.id }, sauce).then(
        () => {
          res.status(201).json({ message: 'Liked sauce!' })
        })
    } else {
      sauce.$inc = { dislikes: 1 }
      sauce.$addToSet = { usersDisliked: userId }
      Sauce.updateOne({ _id: req.params.id }, sauce).then(
        () => {
          res.status(201).json({ message: 'Disliked sauce!' })
        })
    }
  } else {
    Sauce.findOne({ _id: req.params.id }).then(
      (sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne({ _id: req.params.id },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          ).then(
            () => {
              res.status(201).json({ message: 'Cancelled like!' })
            })
        } else {
          Sauce.updateOne({ _id: req.params.id },
            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
          ).then(
            () => {
              res.status(201).json({ message: 'Cancelled dislike!' })
            })
        }
      }
    ).catch(
      (error) => {
        res.status(400).json(error)
      }
    )
  }
}
