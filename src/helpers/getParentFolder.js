function getParentFolder(rootDirectory, absolutePathToTheFile) {
  const parent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile);
  return parent[1];
}

module.exports = getParentFolder;
