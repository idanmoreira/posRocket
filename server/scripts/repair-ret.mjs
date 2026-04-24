import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const retTypesDir = path.resolve("node_modules", "ret", "dist", "types");

const files = {
  "index.d.ts": "export * from './tokens';\nexport * from './types';\nexport * from './set-lookup';\n",
  "index.js": `"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./tokens"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./set-lookup"), exports);
//# sourceMappingURL=index.js.map
`,
  "index.js.map": `{"version":3,"file":"index.js","sourceRoot":"","sources":["../../lib/types/index.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,2CAAyB;AACzB,0CAAwB;AACxB,+CAA6B"}`,
  "set-lookup.d.ts": "/**\n * The number of elements in a set lookup, and a\n * function that returns the lookup.\n */\nexport interface SetLookup {\n    len: number;\n    lookup: () => Record<string | number, boolean>;\n}\n",
  "set-lookup.js": `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=set-lookup.js.map
`,
  "set-lookup.js.map": `{"version":3,"file":"set-lookup.js","sourceRoot":"","sources":["../../lib/types/set-lookup.ts"],"names":[],"mappings":""}`,
  "tokens.d.ts": "import { types } from './types';\ndeclare type Base<T, K> = {\n    type: T;\n} & K;\ndeclare type ValueType<T, K> = Base<T, {\n    value: K;\n}>;\nexport declare type Root = Base<types.ROOT, {\n    stack?: Token[];\n    options?: Token[][];\n    flags?: string[];\n}>;\nexport declare type Group = Base<types.GROUP, {\n    stack?: Token[];\n    options?: Token[][];\n    remember: boolean;\n    followedBy?: boolean;\n    notFollowedBy?: boolean;\n    lookBehind?: boolean;\n    name?: string;\n}>;\nexport declare type Set = Base<types.SET, {\n    set: SetTokens;\n    not: boolean;\n}>;\nexport declare type Range = Base<types.RANGE, {\n    from: number;\n    to: number;\n}>;\nexport declare type Repetition = Base<types.REPETITION, {\n    min: number;\n    max: number;\n    value: Token;\n}>;\nexport declare type Position = ValueType<types.POSITION, '$' | '^' | 'b' | 'B'>;\nexport declare type Reference = ValueType<types.REFERENCE, number>;\nexport declare type Char = ValueType<types.CHAR, number>;\nexport declare type Token = Group | Position | Set | Range | Repetition | Reference | Char;\nexport declare type Tokens = Root | Token;\nexport declare type SetTokens = (Range | Char | Set)[];\nexport {};\n",
  "tokens.js": `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=tokens.js.map
`,
  "tokens.js.map": `{"version":3,"file":"tokens.js","sourceRoot":"","sources":["../../lib/types/tokens.ts"],"names":[],"mappings":""}`,
  "types.d.ts": "export declare enum types {\n    ROOT = 0,\n    GROUP = 1,\n    POSITION = 2,\n    SET = 3,\n    RANGE = 4,\n    REPETITION = 5,\n    REFERENCE = 6,\n    CHAR = 7\n}\n",
  "types.js": `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
var types;
(function (types) {
    types[types["ROOT"] = 0] = "ROOT";
    types[types["GROUP"] = 1] = "GROUP";
    types[types["POSITION"] = 2] = "POSITION";
    types[types["SET"] = 3] = "SET";
    types[types["RANGE"] = 4] = "RANGE";
    types[types["REPETITION"] = 5] = "REPETITION";
    types[types["REFERENCE"] = 6] = "REFERENCE";
    types[types["CHAR"] = 7] = "CHAR";
})(types = exports.types || (exports.types = {}));
//# sourceMappingURL=types.js.map
`,
  "types.js.map": `{"version":3,"file":"types.js","sourceRoot":"","sources":["../../lib/types/types.ts"],"names":[],"mappings":";;;AAAA,IAAY,KASX;AATD,WAAY,KAAK;IACf,iCAAI,CAAA;IACJ,mCAAK,CAAA;IACL,yCAAQ,CAAA;IACR,+BAAG,CAAA;IACH,mCAAK,CAAA;IACL,6CAAU,CAAA;IACV,2CAAS,CAAA;IACT,iCAAI,CAAA;AACN,CAAC,EATW,KAAK,GAAL,aAAK,KAAL,aAAK,QAShB"}`,
};

const requiredFiles = ["index.js", "types.js"];

const needsRepair = async () => {
  for (const file of requiredFiles) {
    try {
      await readFile(path.join(retTypesDir, file), "utf8");
    } catch {
      return true;
    }
  }

  return false;
};

if (await needsRepair()) {
  await mkdir(retTypesDir, { recursive: true });

  await Promise.all(
    Object.entries(files).map(([filename, content]) =>
      writeFile(path.join(retTypesDir, filename), content, "utf8"),
    ),
  );

  console.log("Repaired missing ret dist/types files");
}
