const { ToDo, Token, User } = require("../models");

const getAllToDo = async (req, res) => {

  ToDo.find({ createdBy: req.user }, { _id: 1, title: 1 })
    .then((result) => {
      res.status(200).send(result);
    })

    .catch((err) => {
      console.log(err);
      res.status(500).send("some err occured at our end");
    });

};

const createToDo = async (req, res) => {

  if (req.body.title) {
    let todo = {
      title: req.body.title,
      createdBy: req.user,
    };

    ToDo.create(todo)
      .then((newTodo) => {

        res.status(200).send(newTodo);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("some err occured at our end");
      });

  } else res.status(400).send("Title is rquired");

};

const getParticularToDo = async (req, res) => {

  ToDo.findOne({ $and: [{ createdBy: req.user }, { _id: req.params.id }] })
    .then((singleTodo) => {
      if (singleTodo) 
        res.status(200).send(singleTodo);
      else 
        res.status(200).send("No todo available.");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("some err occured at our end");
    });

};

const editToDo = async (req, res) => {

  ToDo.findOneAndUpdate(
    { $and: [{ createdBy: req.user }, { _id: req.params.id }] },
    { title: req.body.title }
  )
    .then(() => {
      ToDo.findOne({ _id: req.params.id })

        .then((updatedTodo) => res.status(200).send(updatedTodo))
        .catch((err) => {
          console.log(err);
          res.status(500).send("some err occured at our end");
        });
    })

    .catch((err) => {
      console.log(err);
      res.status(500).send("some err occured at our end");
    });

};

const editToDoPatch = async (req, res) => {

  ToDo.findOneAndUpdate(
    { $and: [{ createdBy: req.user }, { _id: req.params.id }] },
    { title: req.body.title }
  )
    .then(() => {
      ToDo.findOne({ _id: req.params.id })
        .then((updatedTodo) => res.status(200).send(updatedTodo))
        .catch((err) => {
          console.log(err);
          res.status(500).send("some err occured at our end");
        });
    })

    .catch((err) => {
      console.log(err);
      res.status(500).send("some err occured at our end");
    });

};

const deleteToDo = async (req, res) => {

  ToDo.findOneAndDelete({
    $and: [{ createdBy: req.user }, { _id: req.params.id }],
  })
    .then((dlt) => {
      res.status(204).send("DELETED SUCESSFULLY");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("some err occured at our end");
    });
    
};

module.exports = {
  createToDo,
  editToDo,
  editToDoPatch,
  deleteToDo,
  getAllToDo,
  getParticularToDo,
};
