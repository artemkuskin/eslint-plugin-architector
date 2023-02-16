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
const DEFAULT_POSTFIX = "";
module.exports.rules = {
  "architector-import": {
    meta: {
      schema: [
        {
          type: "string",
        },
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
      const errorPostfix = context.options[1] || DEFAULT_POSTFIX;
      const hierarchy = context.options[1] || DEFAULT_HIERARCHY;
      const componentFolder = context.options[2] || DEFAULT_COMPONENTS_FOLDER;
      const pathToCurrentFile = adaptingTheImportPathForLinux(context.getFilename());
      return {
        ImportDeclaration: (node) =>
          importDeclaration({
            node,
            hierarchy,
            componentFolder,
            context,
            pathToCurrentFile,
            errorPostfix,
          }),
        ImportExpression: (node) =>
          importExpression({
            node,
            hierarchy,
            componentFolder,
            context,
            pathToCurrentFile,
            errorPostfix,
          }),
        CallExpression: (node) =>
          callExpression({
            node,
            hierarchy,
            componentFolder,
            context,
            pathToCurrentFile,
            errorPostfix,
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

// function isRequireExpression(expr) {
//   return (
//     expr != null &&
//     expr.type === "CallExpression" &&
//     expr.callee != null &&
//     expr.callee.name === "require" &&
//     expr.arguments != null &&
//     expr.arguments.length === 1 &&
//     expr.arguments[0].type === "Literal"
//   );
// }
