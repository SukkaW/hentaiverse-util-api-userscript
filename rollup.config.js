/* eslint-disable node/no-unsupported-features/es-syntax */
import typescript from '@rollup/plugin-typescript';
import metablock from 'rollup-plugin-userscript-metablock';
import pkgJson from './package.json';

const userScriptMetaBlockConfig = {
  file: './userscript.meta.json',
  override: {
    version: pkgJson.version,
    author: pkgJson.author,
    include: [
      'http*://hentaiverse.org/*',
      'http://alt.hentaiverse.org/*'
    ],
    exclude: [
      'http*://hentaiverse.org/pages/showequip.php?*',
      'http://alt.hentaiverse.org/pages/showequip.php?*'
    ]
  }
};

export default [{
  input: 'src/index.ts',
  output: [{
    format: 'iife',
    file: 'dist/userscript/hv-userland-api.user.js',
    name: 'unsafeWindow.HVUserLandApi',
    plugins: [
      metablock(userScriptMetaBlockConfig)
    ],
    sourcemap: false
  }, {
    file: 'dist/mjs/index.mjs',
    format: 'esm',
    sourcemap: false
  }, {
    file: 'dist/cjs/index.js',
    format: 'cjs',
    name: 'HVUserLandApi',
    sourcemap: false
  }],
  plugins: [
    typescript({
      module: 'ES2015',
      tsconfig: './tsconfig.json'
    })
  ]
}];
