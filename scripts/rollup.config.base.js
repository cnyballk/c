import typescript from "rollup-plugin-typescript2";
import alias from "rollup-plugin-alias";
import json from "rollup-plugin-json";
const path = require("path");

export default {
    input: "src/index.ts",
    plugins: [
        alias({
            resolve: [".ts"], //optional, by default this will just look for .js files or folders
            entries: [
                { find: "@", replacement: path.resolve(__dirname, "../src") }, //the initial example
            ],
        }),
        typescript(),
        json(),
    ],
};
