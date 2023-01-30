function getParentFolder(rootDirectory, absolutePathToTheFile) {
  let parent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile);
  return parent[1];
}

module.exports = getParentFolder;
// function getParentFolder(rootDirectory, absolutePathToTheFile) {
//   let parent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile);
//   if (!parent) {
//     absolutePathToTheFile = absolutePathToTheFile.split("\\").join("/")
//   }
//   parent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile)
//   console.log(absolutePathToTheFile);
//   return parent[1];
// }

// module.exports = getParentFolder;

