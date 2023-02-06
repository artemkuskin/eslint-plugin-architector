function getNameFolder(rootDirectory, absolutePathToTheFile) {
  let parent = undefined;

  function setParent() {
    try {
      parent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile)[1];
    } catch {
      parent = undefined;
    }
  }
  setParent();
  return parent;
}

module.exports = getNameFolder;
