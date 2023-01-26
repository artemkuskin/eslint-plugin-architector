const path = require("path");

function absolutePathToFile(pathToCurrentModule, importDefinitionPath) {
    return path.resolve(pathToCurrentModule, importDefinitionPath);
  }

  module.exports = absolutePathToFile