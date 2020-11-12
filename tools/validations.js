module.exports.user = {
  uid: {
    presence: true,
    type: "string",
  },
  creationDate: {
    presence: true,
    type: "number",
  },
  followedStores: {
    presence: true,
    type: "array",
  },
  likedItems: {
    presence: true,
    type: "array",
  },
  notificationsSubs: {
    presence: true,
    type: "array",
  },
  wishList: {
    presence: true,
    type: "array",
  },
};
