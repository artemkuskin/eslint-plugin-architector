function getNameFolder(rootDirectory, absolutePathToTheFile) {
  let parent = undefined;

  function setParent() {
    try {
      parent = new RegExp(`${rootDirectory}\\/([a-zA-Z0-9-]+)`, "g").exec(absolutePathToTheFile)[1];
    } catch {
      parent = undefined;
    }
  }
  setParent();
  return parent;
}

module.exports = getNameFolder;
