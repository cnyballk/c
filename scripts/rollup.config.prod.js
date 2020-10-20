import baseConfig from './rollup.config.base';
import filesize from 'rollup-plugin-filesize';
import { uglify } from 'rollup-plugin-uglify';
import { name, version, author } from '../package.json';

// banner
const banner = `/*
* ${name}.js v${version}
* (c) 2020-${new Date().getFullYear()} ${author}
* Released under the MIT License.
*/`;
export default [
  {
    ...baseConfig,
    output: {
      file: `dist/${name}.js`,
      format: 'umd',
      name,
      banner,
    },
    plugins: [...baseConfig.plugins, filesize()],
  },
  {
    ...baseConfig,
    output: {
      file: `dist/${name}.min.js`,
      format: 'umd',
      name,
      banner,
    },
    plugins: [...baseConfig.plugins, uglify(), filesize()],
  },
];
