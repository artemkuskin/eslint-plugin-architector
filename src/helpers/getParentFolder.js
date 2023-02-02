function getParentFolder(rootDirectory, absolutePathToTheFile) {
  // const parent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile);
 
  // return parent[1];

  let parent = undefined

  function setParent() {
    try {
      parent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile)[1];
    } catch {
      parent = null;
    }
  }
  setParent()
  console.log(parent);
  return parent
}

module.exports = getParentFolder;
