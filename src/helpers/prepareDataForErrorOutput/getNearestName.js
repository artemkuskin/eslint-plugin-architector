module.exports = getNearestName;

function getNearestName(targetLevel, currentLevel) {
  if (targetLevel && currentLevel) {
    const lengthArchitecturalPathTargetLevel = targetLevel.architectorPath.split("/").length;
    const lengthArchitecturalPathCurrentLevel = currentLevel.architectorPath.split("/").length;
    const lengthArchitecturalPathTargetLevelMoreThenLengthArchitecturalPathCurrentLevel = Boolean(
      lengthArchitecturalPathTargetLevel > lengthArchitecturalPathCurrentLevel
    );
    const nearestGeneralLevelByLengthPath =
      lengthArchitecturalPathTargetLevelMoreThenLengthArchitecturalPathCurrentLevel
        ? currentLevel.name
        : targetLevel.name;
    return nearestGeneralLevelByLengthPath;
  }
}
