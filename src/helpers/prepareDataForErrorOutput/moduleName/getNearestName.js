module.exports = getNearestName;

function getNearestName(targetLevel, currentLevel, rootDirectory) {
  if (targetLevel && currentLevel) {
    const lengthArchitecturalPathTargetLevel = targetLevel.architectorPath.split("/").length;
    const lengthArchitecturalPathCurrentLevel = currentLevel.architectorPath.split("/").length;
    let nearestGeneralLevelByLengthPath;
    if (lengthArchitecturalPathTargetLevel > lengthArchitecturalPathCurrentLevel) {
      nearestGeneralLevelByLengthPath = currentLevel.name;
    } else if (lengthArchitecturalPathTargetLevel < lengthArchitecturalPathCurrentLevel) {
      nearestGeneralLevelByLengthPath = targetLevel.name;
    } else if (lengthArchitecturalPathTargetLevel === lengthArchitecturalPathCurrentLevel) {
      nearestGeneralLevelByLengthPath =
        currentLevel.architectorPath.split("/")[lengthArchitecturalPathTargetLevel - 2] || rootDirectory;
    }
    return nearestGeneralLevelByLengthPath;
  }
}
