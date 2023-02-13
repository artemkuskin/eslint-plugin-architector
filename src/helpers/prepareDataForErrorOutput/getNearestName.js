module.exports = getNearestName;

function getNearestName(targetLevel, currentLevel) {
  if (targetLevel && currentLevel) {
    return targetLevel.architectorPath.split("/").length > currentLevel.architectorPath.split("/").length
      ? currentLevel.name
      : targetLevel.name;
  }
}
