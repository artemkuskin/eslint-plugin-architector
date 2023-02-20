const validateHierarchy = require("./src");

const DEFAULT_HIERARCHY = {
  levels: [
    {
      level: "D",
      children: [],
    },
    {
      level: "A",
      children: [],
    },
    {
      level: "B",
      children: [],
    },
    {
      level: "C",
      children: [],
    },
  ],
};

const DEFAULT_COMPONENTS_FOLDER = "components";
module.exports.rules = {
  "architector-import": {
    meta: {
      schema: [
        {
          type: "object",
          additionalProperties: true,
        },
        {
          type: "string",
        },
      ],
    },
    create: (context) => {
      const hierarchy = context.options[0] || DEFAULT_HIERARCHY;
      const componentFolder = context.options[1] || DEFAULT_COMPONENTS_FOLDER;
      const pathToCurrentFile = adaptingTheImportPathForLinux(context.getFilename());
      return {
        ImportDeclaration: (node) =>
          importDeclaration({
            node,
            hierarchy,
            componentFolder,
            context,
            pathToCurrentFile,
          }),
        ImportExpression: (node) =>
          importExpression({
            node,
            hierarchy,
            componentFolder,
            context,
            pathToCurrentFile,
          }),
        CallExpression: (node) =>
          callExpression({
            node,
            hierarchy,
            componentFolder,
            context,
            pathToCurrentFile,
          }),
      };
    },
  },
};

/**
 *  works with regular imports
 */

function importDeclaration({ node, hierarchy, componentFolder, context, pathToCurrentFile, errorPostfix }) {
  const importDefinitionPath = adaptingTheImportPathForLinux(node.source.value);
  const params = {
    pathToCurrentModule: pathToCurrentFile,
    importDefinitionPath: importDefinitionPath,
    levelsConfiguration: hierarchy,
    rootDirectory: componentFolder,
    errorPostfix: errorPostfix,
  };
  const error = validateHierarchy(params);
  if (error) {
    context.report(node, error);
  }
}

/**
 *
 * function works with async imports
 * node.source.value = import string value
 */
function importExpression({ node, hierarchy, componentFolder, context, pathToCurrentFile, errorPostfix }) {
  let importDefinition = undefined;
  try {
    importDefinition = node.source.value;
  } catch {
    importDefinition = null;
  }

  if (importDefinition) {
    const importDefinitionPath = adaptingTheImportPathForLinux(importDefinition);
    const params = {
      pathToCurrentModule: pathToCurrentFile,
      importDefinitionPath: importDefinitionPath,
      levelsConfiguration: hierarchy,
      rootDirectory: componentFolder,
      errorPostfix: errorPostfix,
    };
    const error = validateHierarchy(params);
    if (error) {
      context.report(node, error);
    }
  }
}

/**
 * function works with require without assigning to a variable
 * node.callee.name = transaction name
 */
function callExpression({ node, hierarchy, componentFolder, context, pathToCurrentFile, errorPostfix }) {
  const nameOperationIsRequire = node?.callee?.name === "require";

  if (nameOperationIsRequire && node.arguments.length > 0) {
    const importDefinition = node.arguments[0].value.toString();

    if (importDefinition) {
      const importDefinitionPath = adaptingTheImportPathForLinux(importDefinition);
      const params = {
        pathToCurrentModule: pathToCurrentFile,
        importDefinitionPath: importDefinitionPath,
        levelsConfiguration: hierarchy,
        rootDirectory: componentFolder,
        errorPostfix: errorPostfix,
      };
      const error = validateHierarchy(params);
      if (error) {
        context.report(node, error);
      }
    }
  }
}

function adaptingTheImportPathForLinux(path) {
  return path.split("\\").join("/");
}
