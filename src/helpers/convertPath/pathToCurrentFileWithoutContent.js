function getPathToFileWithoutExtension(relativePath) {
  return relativePath
    .split("/")
    .slice(0, relativePath.split("/").length - 1)
    .join("/");
}

module.exports = getPathToFileWithoutExtension;
