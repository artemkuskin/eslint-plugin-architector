# eslint-plugin-architector

The Dependency Rule states that the source code dependencies can only point inwards.

![Image alt](https://github.com/artemkuskin/eslint-plugin-architector/blob/main/image/image.webp)

This means nothing in an inner circle can know anything at all about something in an outer circle. i.e. the inner circle shouldn’t depend on anything in the outer circle. The Black arrows represented in the diagram show the dependency rule. This plugin helps to avoid dependency rule errors

The plugin supports aliases that you specify in the "jsconfig.json" file and also works with require and asinc import.

![Image alt](<https://github.com/artemkuskin/eslint-plugin-architector/blob/main/image/Untitled%20Workspace%20-%20Copy%20(2).png>)

## installation

```
npm install artemkuskin/eslint-plagin-architector
```

## Usage

Add the plugin to your eslint config file

```
"plugins": [
    "eslint-plugin-architector-import"
],
```

Next, enable the rule

```
     "architector-import/architector-import": [
      "error",

      {
        "errorPostfix": "see www.wiki for details.",
        "levels": [
            {
            "level": "UILib",
            "independentChildren": true,
            "children": [
              {
                "level": "UiLibA",
                "children": [
                  {
                    "level": "UiLibD",
                    "children": []
                  },
                  {
                    "level": "UiLibE",
                    "children": []
                  }
                ]
              },
              {
                "level": "UiLibB",
                "children": []
              }
            ]
          },
          {
            "level": "Global",
            "children": [
              {
                "level": "GlobalA",
                "children": []
              },
              {
                "level": "GlobalB",
                "children": []
              }
            ]
          },
          {
            "level": "Services",
            "children": [
              {
                "level": "ServicesA",
                "children": []
              },
              {
                "level": "ServicesB",
                "children": []
              },
              {
                "level": "ServicesC",
                "children": []
              }
            ]
          }

        ]
      },

      "components"
    ]
```

You can change the hierarchy, both levels and child levels are configurable. The plugin will only check imports in these folders, located in the components folder.

You can also change the name of the root component folder. The plugin will only check files and import in this folder.

`"level"` - Folder name(Required field).

`"children"` - Array with child folders (Required if there are no child levels- "children": []).

`"errorPostfix"` - The message that will be shown with an error if the import is not correct (Optional field).

`"independentChildren"`: true,- This setting will allow you to import all child levels into each other, regardless of the hierarchy, but not deeper than one level of nesting (Optional field).

## Case 1

`**/components/**/UILib/UILib.js`
Level "UILib" is the highest in the tree, so only its children can be imported into it

```
// valid, UILiB can import childrens  Level A
import { UILibA } from "./UILibA/UILibA.js";
import { UILibB } from "./UILibB/UILibB.js";

// invalid, UILib can import Global, C
import {Global} from "../Global/Global.js";
import {Services} from "Services/Services.js"; - Aliase

// invalid, UILib can't import "children" Level B
import { GlobalB } from "GlobalB/GlobalB.js"; - Aliase

```

## Case 2

`**/components/**/Global/GlobalB/GlobalB.js`
Level "GlobalB" is a child of level "Global", level "Global" is above "Services", but below "UILib", so it can import "UILib" and its children

```
// valid, Global can import childrens Level UILib and Level UILib
import { UILib } from "../../UILib/UILib.js";
import { UILibA } from "../../UILib/UILibA/UILibA.js";


// invalid, GlobalB can't import  Level Global and Level Services
import { GlobalB } from "../Global.js";
import { Services } from "Services/Services.js";

```

## Case 3

`**/components/**/Services/Services.js`
Level "Services" is below all levels in the rules tree, so you can import all levels into it

```
// valid
import { GlobalB } from "GlobalB/GlobalB.js";
import { UILib } from "../UILib/UILib.js";
import { UILibA } from "../UILib/UILibA/UILibA.js";
import { Global } from "../Global/Global.js";

```
