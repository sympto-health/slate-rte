import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";
import postcss from 'rollup-plugin-postcss'
import { uglify } from "rollup-plugin-uglify";

import pkg from "./package.json";

export default {
  input: "src/index.tsx",
  external: ["styled-components"],
  output: [
    {
      file: pkg.main,
      format: "umd",
      exports: "named",
      compact: true,
      name: "slate-rte",
      sourcemap: false
    },
    {
      file: pkg.module,
      format: "esm",
      exports: "named",
      sourcemap: false,
      compact: true
    }
  ],
  plugins: [
    external(),
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      exclude: "**/__tests__/**",
      clean: true
    }),
    postcss({
      plugins: []
    }),
    commonjs({
      include: ["node_modules/**"],
      namedExports: {
        "node_modules/react/react.js": [
          "Children",
          "Component",
          "PropTypes",
          "createElement"
        ],
        "node_modules/esrever/esrever.js": [
          "reverse",
        ],
        "node_modules/react-dom/index.js": ["render"]
      }
    }),
    uglify()
  ]
};
