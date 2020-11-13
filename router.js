const controllers = require("./controllers");
const express = require("express");
const { auth } = require("./middleWares");

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

/* user actions user authentication required */
// like item request
router.post("/item/like/:id", auth, controllers.likeItem);
// add item to wish list request
router.post("/item/addToWishList/:id", auth, controllers.addItemToWishList);
// user store follow request
router.post("/store/follow/:id", auth, controllers.followStore);
// user store follow request
router.post("/store/notiSub/:id", auth, controllers.getStoreNotifications);

// get user liked items from db, get based on item uid in liked items field of user object
router.get("/user/likedItems/", auth, controllers.getUserLikedItems);

// get user wished items from db, get based on item uid in wished items list field of user object
router.get("/user/wishList/", auth, controllers.getUserWishList);

// get user followed items from db
router.get("/user/followedStore/", auth, controllers.getUserFollowedStoreItems);

module.exports = router;
