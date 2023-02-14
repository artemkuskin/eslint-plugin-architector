module.exports = getNearestName;

function getNearestName(targetLevel, currentLevel) {
  if (targetLevel && currentLevel) {
    const lengthArchitecturalPathTargetLevel = targetLevel.architectorPath.split("/").length;
    const lengthArchitecturalPathCurrentLevel = currentLevel.architectorPath.split("/").length;
    const lengthArchitecturalPathTargetLevelMoreThenLengthArchitecturalPathCurrentLevel = Boolean(
      lengthArchitecturalPathTargetLevel > lengthArchitecturalPathCurrentLevel
    );
    let nearestGeneralLevelByLengthPath;
    // lengthArchitecturalPathTargetLevelMoreThenLengthArchitecturalPathCurrentLevel
    //   ? currentLevel.name
    //   : targetLevel.name;
    if (lengthArchitecturalPathTargetLevel > lengthArchitecturalPathCurrentLevel) {
      nearestGeneralLevelByLengthPath = currentLevel.name;
    } else if (lengthArchitecturalPathTargetLevel < lengthArchitecturalPathCurrentLevel) {
      nearestGeneralLevelByLengthPath = targetLevel.name;
    } else if (lengthArchitecturalPathTargetLevel === lengthArchitecturalPathCurrentLevel) {
      nearestGeneralLevelByLengthPath = currentLevel.architectorPath.split("/")[lengthArchitecturalPathTargetLevel - 2];
    }
    return nearestGeneralLevelByLengthPath;
  }
}
