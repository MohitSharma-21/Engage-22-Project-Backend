const { Router } = require("express");
const { PhotoController } = require("../controllers");
const router = Router();
const { requireAuth } = require("../middleware/requireAuth");

router.get("/", requireAuth, PhotoController.getPhotoLabels);
router.post("/upload", requireAuth, PhotoController.addPhoto);
router.get("/:id", requireAuth, PhotoController.getAllPhotoByLabel);
router.put("/:id/:index", requireAuth, PhotoController.deletePhoto);

module.exports = router;
