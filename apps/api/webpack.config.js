const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      // libs in this workspace are source-linked (package.json "main" points at
      // src/index.ts, not a prebuilt dist), so apps/api's webpack build bundles
      // raw .ts source straight from libs/db and libs/shared/types. The 'tsc'
      // compiler (ts-loader) builds one whole-program compile per its tsConfig
      // and rejects those files with TS6059 ("not under rootDir"), since they
      // sit outside apps/api/src. 'swc' transpiles file-by-file with no such
      // whole-program/rootDir constraint, and already configures
      // legacyDecorator/decoratorMetadata for NestJS DI.
      compiler: 'swc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
      // Type checking is already covered by the `typecheck` target (tsc --build,
      // which correctly handles the cross-lib project references via per-project
      // rootDirs). Leave it enabled here too would hit the same TS6059 issue.
      typeCheckOptions: false,
    }),
  ],
};
