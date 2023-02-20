function getFolderName(rootDirectory, absolutePathToTheFile) {
  let parent = undefined;

  try {
    parent = new RegExp(`${rootDirectory}\\/([a-zA-Z0-9-_]+)`, "g").exec(absolutePathToTheFile)[1];
  } catch {
    parent = undefined;
  }

  return parent;
}

module.exports = getFolderName;
