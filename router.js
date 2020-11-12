const controllers = require("./controllers");
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({ message: "Hello from api" });
});

// items routes
router.get("/items", controllers.latestItems);
router.get("/item/:id", controllers.getItemById);

// items complexes routes
router.get("/complexes", controllers.getComplexes);
router.get("/complex/:id", controllers.getComplexById);

// items store routes
router.get("/stores/:id", controllers.getStores);
router.get("/store/:id", controllers.getStoreById);

/* user actions */
// user items actions
router.post("/item/:id", controllers.setUserPreference);
// user store actions
router.post("/store/:id", controllers.setUserPreference);

module.exports = router;
