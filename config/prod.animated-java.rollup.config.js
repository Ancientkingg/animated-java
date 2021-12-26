import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import React from 'react'
import ReactDOM from 'react-dom'
import ReactIs from 'react-is'
import url from '@rollup/plugin-url'
import yaml from '@rollup/plugin-yaml'
import typescript from 'rollup-plugin-typescript2'
export default {
	input: 'src/animatedJava.ts',
	output: {
		file: 'dist/animated-java.js',
		format: 'cjs',
		compact: true,
	},
	plugins: [
		typescript(),
		yaml(),
		url({
			include: [
				'**/*.svg',
				'**/*.png',
				'**/*.jpg',
				'**/*.gif',
				'**/*.obj',
				'**/*.css',
				'**/*.wjs',
			],
			limit: Infinity,
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
		commonjs({
			include: ['node_modules/**'],
			ignoreGlobal: false,
			sourceMap: false,
			namedExports: {
				'react-is': Object.keys(ReactIs),
				react: Object.keys(React),
				'react-dom': Object.keys(ReactDOM),
			},
		}),
		resolve({
			jsnext: true,
		}),
		babel({
			extensions: ['.js', '.ts', '.tsx'],
		}),
		terser(),
	],
}
