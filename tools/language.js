const { I18n } = require("i18n");
const path = require("path");

module.exports = new I18n({
  locales: ["en", "ar"],
  directory: path.join(__dirname, "/locales"),
  defaultLocale: "en",
});
