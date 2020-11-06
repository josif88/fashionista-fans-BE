const { firebaseApp } = require("../init");

let db = firebaseApp.firestore();

module.exports.getItems = async (limit = 10) => {
  //get items
  let data = [];
  let snap = await db
    .collection("items")
    .orderBy("date", "desc")
    .limit(limit)
    .get();
  snap.forEach((item) => {
    data.push(item.data());
  });

  //get items store uid`s to retrieve store object by their uid from db, Well there is no suitable ORM for Firestore db yet
  let storesUid = data.map((item) => item.storeUid);
  let storesPromises = [];
  storesUid.forEach((uid) => storesPromises.push(this.getStoreById(uid)));
  let stores = await Promise.all(storesPromises);

  //now get the complex of each store as zeyad asked
  let complexesUid = stores.map((item) => item.complexUid);
  let complexPromises = [];
  complexesUid.forEach((uid) =>
    // fetching only complex basic by passing false argument to getter method
    complexPromises.push(this.getComplexById(uid, false))
  );
  let complexes = await Promise.all(complexPromises);

  //get items category uid`s to retrieve category object by their uid from db
  let categoryUid = data.map((item) => item.itemCategoryUid);
  let categoryPromises = [];
  categoryUid.forEach((uid) =>
    categoryPromises.push(this.getCategoryById(uid))
  );
  let categories = await Promise.all(categoryPromises);

  //TODO: do same loops above to get tags objects for each item,
  let tagsUidArrays = data.map((item) => item.tagsUid);

  //get everything together
  for (let i = 0; i < data.length; i++) {
    data[i].store = stores[i];
    data[i].category = categories[i];
    data[i].complex = complexes[i];
  }

  //remove unnecessary properties from item object
  data.forEach((item) => {
    delete item.storeUid;
    delete item.itemCategoryUid;
  });

  return data;
};

module.exports.getComplexes = async () => {
  let snap = await db.collection("complexes").get();
  let complexes = [];
  snap.forEach((complex) => complexes.push(complex.data()));
  return complexes;
};

module.exports.getItemById = async (id) => {
  let snap = await db.collection("items").doc(id).get();
  let item = snap.data();
  item.store = await this.getStoreById(item.storeUid);
  item.category = await this.getCategoryById(item.itemCategoryUid);
  delete item.storeUid;
  delete item.itemCategoryUid;
  return item;
};

module.exports.getStoreById = async (id) => {
  let snap = await db.collection("stores").doc(id).get();
  store = snap.data();
  return store;
};
module.exports.getCategoryById = async (id) => {
  let snap = await db.collection("itemCategory").doc(id).get();
  if (snap) return snap.data();
  return "category not found";
};
module.exports.getTagById = async (id) => {
  let snap = await db.collection("tags").doc(id).get();
  if (snap) return snap.data();
  return "tag not found";
};

// adding full data flag to control redundant info we dont need
module.exports.getComplexById = async (id, fullData = true) => {
  let snap = await db.collection("complexes").doc(id).get();
  let complex = await snap.data();

  if (fullData) {
    let storeSnap = await db
      .collection("stores")
      .where("complexUid", "==", id)
      .get();
    let stores = [];
    storeSnap.forEach((store) => stores.push(store.data()));

    complex.stores = stores;
  }

  return complex;
};
