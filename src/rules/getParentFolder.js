function getParentFolder(rootDirectory, absolutePathToTheFile) {
    let parent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile);
    return parent[1];
  }

  module.exports = getParentFolder