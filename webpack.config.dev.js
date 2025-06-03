/* Copyright (c) 2018 Kamil Mikosz
 * Copyright (c) 2019 Sienori
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT */

import { getHTMLPlugins, getOutput, getCopyPlugins, getFirefoxCopyPlugins, getEntry, getMiniCssExtractPlugin } from "./webpack.utils.js";
import path from "node:path";
import config from "./config.json" with { type: "json" };
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const { chromePath, devDirectory, firefoxPath } = config;

const generalConfig = {
	mode: "development",
	devtool: "source-map",
	resolve: {
		alias: {
			src: path.resolve(import.meta.dirname, "src/"),
			"webextension-polyfill":
				"webextension-polyfill/dist/browser-polyfill.min.js",
		},
	},
	module: {
		rules: [
			{
				loader: "babel-loader",
				exclude: /node_modules/,
				test: /\.(js|jsx)$/,
				resolve: {
					extensions: [".js", ".jsx"],
				},
			},
			{
				test: /\.(scss|css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							esModule: false,
						},
					},
					{
						loader: "sass-loader",
					},
				],
			},
			{
				test: /\.svg$/,
				use: ["@svgr/webpack"],
			},
		],
	},
};
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
export default [
	{
		...generalConfig,
		entry: getEntry(chromePath),
		output: getOutput("chrome", devDirectory),
		plugins: [
			...getMiniCssExtractPlugin(),
			...getHTMLPlugins("chrome", devDirectory, chromePath),
			...getCopyPlugins("chrome", devDirectory, chromePath),
		],
	},
	{
		...generalConfig,
		entry: getEntry(firefoxPath),
		output: getOutput("firefox", devDirectory),
		plugins: [
			...getMiniCssExtractPlugin(),
			...getFirefoxCopyPlugins(
				"firefox",
				devDirectory,
				firefoxPath,
			),
			...getHTMLPlugins("firefox", devDirectory, firefoxPath),
			new BundleAnalyzerPlugin({
				openAnalyzer: false,
				analyzerHost: "127.0.0.1",
				analyzerPort: 8888,
			}),
		],
	},
];
