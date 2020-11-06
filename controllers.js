const { firebaseApp } = require("./middleWares");
const { getItems, getItemById, getComplexes,getComplexById } = require("./tools/db");
const {
  successOutput,
  serverErrorOutput,
  userErrorOutput,
} = require("./tools/helper");

module.exports.latestItems = async (req, res) => {
  //get limit query over 50 item not acceptable
  let limit = Number.parseInt(req.query.limit);
  //check if limit equals 0 then get 10 items
  if (!limit) limit = 10;
  //if items limit query over 50 get 50 only
  limit = limit > 50 ? 50 : limit;

  //get latest items from db
  try {
    let data = await getItems(limit);
    return successOutput(res, data);
  } catch (err) {
    return serverErrorOutput(res, err);
  }
};

module.exports.getItemById = async (req, res) => {
  let itemUid = req.params.id;
  try {
    item = await getItemById(itemUid);
    return successOutput(res, item, "item data");
  } catch (err) {
    console.log(err);
    return userErrorOutput(res, err);
  }
};

module.exports.getComplexById = async (req, res) => {
  let complexUid = req.params.id;
  try {
    item = await getComplexById(complexUid);
    return successOutput(res, item, "complex data");
  } catch (err) {
    console.log(err);
    return userErrorOutput(res, err);
  }
};

module.exports.getComplexes = async (req, res) => {
  try {
    let complexes = await getComplexes();
    return successOutput(res, complexes, "complexes");
  } catch (err) {
    return serverErrorOutput(res, err);
  }
};
