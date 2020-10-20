import baseConfig from "./rollup.config.base";
import server from "rollup-plugin-serve";
import { name } from "../package.json";
export default {
    ...baseConfig,
    output: {
        file: `test/${name}.js`,
        format: "umd",
        name,
    },
    plugins: [
        ...baseConfig.plugins,
        server({
            open: true,
            contentBase: ["./test"],
        }),
    ],
};
