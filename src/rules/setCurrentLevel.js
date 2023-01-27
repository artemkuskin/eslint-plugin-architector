function setCurrentLevel(pathToModule) {
  return pathToModule.split("/")[pathToModule.split("/").length - 2];
}

module.exports = setCurrentLevel;
