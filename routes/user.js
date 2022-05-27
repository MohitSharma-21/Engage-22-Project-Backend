const { Router } = require("express");
const { UserController } = require("../controllers");

const {requireAuth} = require('../middleware/requireAuth')
const router = Router();

router.post("/sign-in/", UserController.signin);
router.post("/sign-up", UserController.signup);
router.get("/profile",requireAuth, UserController.profile);

module.exports = router;
