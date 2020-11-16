const { json } = require("express");
const db = require("./tools/db");
const {
  successOutput,
  serverErrorOutput,
  badRequestOutput,
} = require("./tools/responses");
const I18n = require("./tools/language");
const validate = require("validate.js");
const validations = require("./tools/validations");
const { async } = require("validate.js");

module.exports.latestItems = async (req, res) => {
  //get limit query over 50 item not acceptable
  let limit = Number.parseInt(req.query.limit);
  //check if limit equals 0 then get 10 items
  if (!limit) limit = 10;
  //if items limit query over 50 get 50 only
  limit = limit > 50 ? 50 : limit;

  //get latest items from db
  try {
    let data = await db.getItems(limit);
    return successOutput(res, data);
  } catch (err) {
    return serverErrorOutput(res, err.message);
  }
};

module.exports.getItemById = async (req, res) => {
  let itemUid = req.params.id;
  try {
    item = await db.getItemById(itemUid);
    return successOutput(res, item, "item data");
  } catch (err) {
    return badRequestOutput(res, err.message, I18n.__("itemNotFound"));
  }
};

module.exports.getComplexById = async (req, res) => {
  let complexUid = req.params.id;
  try {
    item = await db.getComplexById(complexUid);
    return successOutput(res, item, "complex data");
  } catch (err) {
    return userErrorOutput(res, err.message);
  }
};

module.exports.getComplexes = async (req, res) => {
  try {
    let complexes = await db.getComplexes();
    return successOutput(res, complexes, "complexes");
  } catch (err) {
    return serverErrorOutput(res, err.message);
  }
};

module.exports.getStores = async (req, res) => {
  try {
    let complexUid = req.params.id;
    let stores = await db.getStores(complexUid, true);
    return successOutput(res, stores, "stores");
  } catch (err) {
    return serverErrorOutput(res, err.message);
  }
};

//store controller
module.exports.getStoreById = async (req, res) => {
  try {
    let store = await db.getStoreById(req.params.id);
    return successOutput(res, store, "store");
  } catch (err) {
    return serverErrorOutput(res, err.message);
  }
};

//user favorites and preference handler
module.exports.likeItem = async (req, res) => {
  try {
    //get item from db
    let itemUid = req.params.id;
    let item = await db.getItemById(itemUid, false);
    //create likes counter is null
    if (!item.likeCounter) {
      item.likeCounter = 0;
    }

    //retrieve user object from DB
    let user = req.user;

    if (user.likedItems.includes(itemUid)) {
      user.likedItems = user.likedItems.filter((e) => e !== itemUid);
      --item.likeCounter;
      await db.saveItem(item);
      successOutput(
        res,
        { itemLikeCounter: item.likeCounter, like: false },
        "Unlike Item"
      );
    } else {
      //add item uid to likedItem arr of to user
      user.likedItems.push(itemUid);
      ++item.likeCounter;
      await db.saveItem(item);
      successOutput(
        res,
        { itemLikeCounter: item.likeCounter, like: true },
        "Like Item"
      );
    }

    //save changes to db
    await db.saveUser(user);
    return;
  } catch (err) {
    console.log(err);
    return serverErrorOutput(res, err.message, "Error on like item");
  }
};

//user add item to wish list handler
module.exports.addItemToWishList = async (req, res) => {
  try {
    //get item uid
    let itemUid = req.params.id;

    //retrieve user object from DB
    let user = req.user;

    if (user.wishList.includes(itemUid)) {
      user.wishList = user.wishList.filter((e) => e !== itemUid);
      successOutput(
        res,
        { saved: false, item: itemUid },
        "Removed from wish list"
      );
    } else {
      //add item uid to likedItem arr of to user
      user.wishList.push(itemUid);
      successOutput(res, { saved: true, item: itemUid }, "Added to wish list");
    }

    //save changes to db
    await db.saveUser(user);
    return;
  } catch (err) {
    return serverErrorOutput(
      res,
      err.message,
      "Error while adding item to wish list"
    );
  }
};

//user follow store request handler
module.exports.followStore = async (req, res) => {
  try {
    //get item uid
    let storeUid = req.params.id;

    //retrieve user object from DB
    let user = req.user;

    if (user.followedStores.includes(storeUid)) {
      user.followedStores = user.followedStores.filter((e) => e !== storeUid);
      successOutput(res, user, "Store not followed");
    } else {
      //add item uid to likedItem arr of to user
      user.followedStores.push(storeUid);
      successOutput(res, user, "store followed");
    }

    //save changes to db
    await db.saveUser(user);
    return;
  } catch (err) {
    return serverErrorOutput(res, err.message, "Error on following store");
  }
};

//user get store notifications request handler
module.exports.getStoreNotifications = async (req, res) => {
  try {
    //get item uid
    let storeUid = req.params.id;

    //retrieve user object from DB
    let user = req.user;

    if (user.notificationsSubs.includes(storeUid)) {
      user.notificationsSubs = user.notificationsSubs.filter(
        (e) => e !== storeUid
      );
      successOutput(res, user, "Subscribed to notification channel");
    } else {
      //add item uid to likedItem arr of to user
      user.notificationsSubs.push(storeUid);
      successOutput(res, user, "unsubscribed to Notification channel");
    }

    //save changes to db
    await db.saveUser(user);
    return;
  } catch (err) {
    return serverErrorOutput(
      res,
      err.message,
      "Error on Subscribed to notification channel"
    );
  }
};

module.exports.getUserLikedItems = async (req, res) => {
  //TODO: improve error handlers
  let items = await db.getUserLikedItems(req.user);
  return successOutput(res, items, "user liked items");
};

module.exports.getUserWishList = async (req, res) => {
  let items = await db.getUserWishList(req.user);
  return successOutput(res, items, "user wish list");
};

module.exports.getUserFollowedStoreItems = async (req, res) => {
  let items = await db.getUserFollowedStoreItems(req.user);
  return successOutput(res, items, "user wish list");
};

module.exports.getStoreRelatedItems = async (req, res) => {
  let item = await db.getItemById(req.params.id, false);
  if (item) {
    let items = await db.getStoreRelatedItems(
      req.params.id,
      item.itemCategoryUid,
      item.storeUid
    );
    return successOutput(res, items, "store related items");
  } else {
    return successOutput(res, [], "no items found");
  }
};

module.exports.getComplexRelatedItems = async (req, res) => {
  let item = await db.getItemById(req.params.id, false);
  if (item) {
    let items = await db.getComplexRelatedItems(
      item.itemCategoryUid,
      item.storeUid
    );
    return successOutput(res, items, "complex related items");
  } else {
    return successOutput(res, [], "no items found");
  }
};
