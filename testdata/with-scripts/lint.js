const semver = require("semver");
if (!semver.valid("1.2.3")) {
  throw new Error("semver is broken");
}
console.log("lint passed");
