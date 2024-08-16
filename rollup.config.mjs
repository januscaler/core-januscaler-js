// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import externals from 'rollup-plugin-node-externals';

const usePreferConst = true; // Use "const" instead of "var"
const useStrict = true; // Use "strict"
const useThrowOnError = true; // On error throw and exception
const useSourceMap = true; // Generate source map files
const useEsbuild = true; // `true` -> use esbuild, `false` use tsc
const external=[]

export default [
	{
		// .d.ts build
		input: 'src/index.ts',
		output: {
			file: 'dist/index.d.ts',
			format: 'es',
		},
		external,
		plugins: [
			externals(),
			json({
				preferConst: usePreferConst
			}),
			typescriptPaths({
				preserveExtensions: true
			}),
			dts()
		]
	},
	{
		// esm build
		input: 'src/index.ts',
		output: {
			file: `dist/esm/index.mjs`,
			format: 'es',
			generatedCode: {
				constBindings: usePreferConst
			},
			strict: useStrict,
			entryFileNames: '[name].mjs',
			sourcemap: useSourceMap,
		},
		external,
		plugins: [
			externals(),
			json({
				preferConst: usePreferConst
			}),
			useEsbuild
				? typescriptPaths({
						preserveExtensions: true
				  })
				: undefined,
			useEsbuild
				? esbuild()
				: typescript({
						noEmitOnError: useThrowOnError,
						removeComments: true
				  })
		]
	},
	{
		// CJS build
		input: 'src/index.ts',
		output: {
			file: `dist/cjs/index.cjs`,
			format: 'cjs',
			generatedCode: {
				constBindings: usePreferConst
			},
			strict: useStrict,
			entryFileNames: '[name].cjs',
			sourcemap: useSourceMap,
		},
		external,
		plugins: [
			externals(),
			json({
				preferConst: usePreferConst
			}),
			useEsbuild
				? typescriptPaths({
						preserveExtensions: true
				  })
				: undefined,
			useEsbuild
				? esbuild()
				: typescript({
						noEmitOnError: useThrowOnError,
						removeComments: true
				  })
		]
	},
];
