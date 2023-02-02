function getParentFolder(rootDirectory, absolutePathToTheFile) {
  let pagent = undefined;

  if (parent === undefined) {
    parent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile)[0];
    return parent;
  } else {
    return (parent = undefined);
  }
}

module.exports = getParentFolder;
