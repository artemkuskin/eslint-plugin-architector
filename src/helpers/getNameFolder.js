function getNameFolder(rootDirectory, absolutePathToTheFile) {
  // const parent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile);

  // return parent[1];

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
