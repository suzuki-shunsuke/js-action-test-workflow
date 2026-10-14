const semver = require("semver");
if (semver.gt("1.0.0", "2.0.0")) {
  throw new Error("semver is broken");
}
console.log("test passed");
