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
module.exports.setUserPreference = async (req, res) => {
  try {
    //get item uid
    let itemUid = req.params.id;

    //get user action if there is no action return error response
    let action = req.query.action;
    if (!action) return badRequestOutput(res, "No action found");

    //retrieve user object from DB
    let user = req.user;

    switch (action) {
      //TODO: find best handler method of user action
      case "like": {
        //check if user liked this item before, if true remove item uid from likedItems arr
        if (user.likedItems.includes(itemUid)) {
          user.likedItems = user.likedItems.filter((e) => e !== itemUid);
          successOutput(res, user, "Unlike Item");
        } else {
          //add item uid to likedItem arr of to user
          user.likedItems.push(itemUid);
          successOutput(res, user, "Like Item");
        }
        break;
      }
      case "addToWishList": {
        //check if user liked this item before, if true remove item uid from likedItems arr
        if (user.wishList.includes(itemUid)) {
          user.wishList = user.wishList.filter((e) => e !== itemUid);
          successOutput(res, user, "Added to wish list");
        } else {
          //add item uid to likedItem arr of to user
          user.wishList.push(itemUid);
          successOutput(res, user, "Removed from wish list");
        }
        break;
      }
      case "unlike": {
        //TODO: decide to keep it or remove this action parameter
        break;
      }
      case "removeFromWishList": {
        //TODO: decide to keep it or remove this action parameter
        break;
      }
    }

    //save changes to db
    await db.saveUser(user);
    return;
  } catch (err) {
    return serverErrorOutput(res, err.message, "Error on like item");
  }
};
