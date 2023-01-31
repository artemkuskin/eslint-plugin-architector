const lengthPathToFile = require("./lengthPathToFile");

function comparisonOfLength(currentModule, targetModule) {
  return lengthPathToFile(currentModule) > lengthPathToFile(targetModule);
}

module.exports = comparisonOfLength