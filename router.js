const { latestItems, getItemById, getComplexes, getComplexById } = require("./controllers");

const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({ message: "Hello from api" });
});


// items routes
router.get("/items", latestItems);
router.get("/item/:id", getItemById);

// items complexes routes
router.get("/complexes", getComplexes);
router.get("/complex/:id", getComplexById);

module.exports = router;
