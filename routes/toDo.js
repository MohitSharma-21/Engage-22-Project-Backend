const { Router } = require("express");
const { ToDoController } = require("../controllers");
const router = Router();
const {requireAuth} = require('../middleware/requireAuth')



router.get("/",requireAuth, ToDoController.getAllToDo);
router.post("/create",requireAuth, ToDoController.createToDo); 

router.get("/:id/",requireAuth, ToDoController.getParticularToDo);   // id  of todo

// patch only few
// put updates all

router.patch("/:id/",requireAuth,ToDoController.editToDoPatch);     // id  of todo      
router.put("/:id/",requireAuth,ToDoController.editToDo);          // id  of todo
router.delete("/:id/",requireAuth, ToDoController.deleteToDo);        // id  of todo


module.exports = router;