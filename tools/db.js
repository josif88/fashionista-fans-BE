const { firebaseApp } = require("../init");

const db = firebaseApp.firestore();

//get items
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

// get all complexes by id
module.exports.getComplexes = async () => {
  let snap = await db.collection("complexes").get();
  let complexes = [];
  snap.forEach((complex) => complexes.push(complex.data()));
  return complexes;
};

//get item by id
module.exports.getItemById = async (id, fullDetails = true) => {
  let snap = await db.collection("items").doc(id).get();
  let item = snap.data();
  if (fullDetails) {
    item.store = await this.getStoreById(item.storeUid);
    item.category = await this.getCategoryById(item.itemCategoryUid);
    delete item.storeUid;
    delete item.itemCategoryUid;
  }

  return item;
};

//get item by id
module.exports.saveItem = async (item) => {
  await db.collection("items").doc(item.uid).set(item);
  return item;
};

//get store by id
module.exports.getStoreById = async (id) => {
  let snap = await db.collection("stores").doc(id).get();
  store = snap.data();
  if (store) return store;
  return "store not found";
};

//get category by id
module.exports.getCategoryById = async (id) => {
  let snap = await db.collection("itemCategory").doc(id).get();
  if (snap) return snap.data();
  return "category not found";
};

//get single tag by id
module.exports.getTagById = async (id) => {
  let snap = await db.collection("tags").doc(id).get();
  if (snap) return snap.data();
  return "tag not found";
};

// adding full data flag to control redundant info we don't need
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

//get stores of single complex
module.exports.getStores = async (complexUid, fullData = false) => {
  let snap = await db
    .collection("stores")
    .where("complexUid", "==", complexUid)
    .get();
  if (snap.empty) return "complex not found";
  let stores = [];
  snap.forEach((store) => stores.push(store.data()));

  if (fullData) {
    //get every store items
    //TODO above
  }

  return stores;
};

// get store by id
module.exports.getStoreById = async (uid, fullData = true) => {
  let snap = await db.collection("stores").doc(uid).get();
  let store = await snap.data();
  if (!store) return "no store found";

  //if fullData true get all information related to the store
  if (fullData) {
    let itemsSnap = await db
      .collection("items")
      .where("storeUid", "==", uid)
      .get();
    let items = [];
    itemsSnap.forEach((item) => items.push(item.data()));
    store.items = items;

    let complex = await this.getComplexById(store.complexUid, false);
    store.complex = complex;
  }

  return store;
};

// get user by id if not document found create one for him
module.exports.getUserById = async (id) => {
  let snap = await db.collection("users").doc(id).get();

  if (!snap.exists) {
    let user = {
      uid: id,
      likedItems: [],
      followedStores: [],
      creationDate: Date.now(),
      wishList: [],
      notificationsSubs: [],
    };
    await db.collection("users").doc(id).set(user);
    return user;
  }

  let user = snap.data();
  return user;
};

module.exports.saveUser = async (user) => {
  let snap = await db.collection("users").doc(user.uid).set(user);
  return snap;
};

//TODO:
module.exports.getUserLikedItems = async (user) => {
  if (!user.likedItems.length) return [];

  let snap = await db
    .collection("items")
    .where("uid", "in", user.likedItems)
    .get();

  if (snap.empty) {
    return "no items found";
  }

  let items = [];
  snap.forEach((item) => items.push(item.data()));
  return items;
};

//TODO:
module.exports.getUserWishList = async (user) => {
  if (!user.wishList.length) return [];

  let snap = await db
    .collection("items")
    .where("uid", "in", user.wishList)
    .get();

  if (snap.empty) {
    return "no items found";
  }

  let items = [];
  snap.forEach((item) => items.push(item.data()));
  return items;
};
//TODO:
module.exports.getUserFollowedStoreItems = async (user) => {
  if (!user.followedStores.length) return [];

  let snap = await db
    .collection("items")
    .where("storeUid", "in", user.followedStores)
    .orderBy("date")
    .get();

  if (snap.empty) {
    return "no items found";
  }

  let items = [];
  snap.forEach((item) => items.push(item.data()));
  return items;
};

module.exports.getStoreRelatedItems = async (
  itemUid,
  itemCategoryUid,
  storeUid
) => {
  let query = db
    .collection("items")
    .where("storeUid", "==", storeUid)
    .where("uid", "!=", itemUid);
  let snap = await query.where("itemCategoryUid", "==", itemCategoryUid).get();

  if (snap.empty) {
    return "no items found";
  }

  let items = [];
  snap.forEach((item) => items.push(item.data()));
  return items;
};

module.exports.getComplexRelatedItems = async (itemCategoryUid, storeUid) => {
  let store = (await db.collection("stores").doc(storeUid).get()).data();

  let complexUid = store.complexUid;

  let complexStores = await db
    .collection("stores")
    .where("complexUid", "==", complexUid)
    .limit(10)
    .get();
  let storesUid = [];
  let stores = [];
  complexStores.forEach((c) => {
    storesUid.push(c.data().uid);
    stores.push(c.data());
  });

  let items = await db
    .collection("items")
    .where("storeUid", "!=", storeUid)
    .where("storeUid", "in", storesUid)
    .where("itemCategoryUid", "==", itemCategoryUid)
    .get();

  let itemsArr = [];
  items.forEach((i) => itemsArr.push(i.data()));

  OUTER_LOOP: for (let i = 0; i < itemsArr.length; i++) {
    for (let j = 0; j < stores.length; j++) {
      if (stores[j].uid === itemsArr[i].storeUid) {
        itemsArr[i].store = stores[j];
        continue OUTER_LOOP;
      }
    }
  }

  return itemsArr;
};
