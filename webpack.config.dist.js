/* Copyright (c) 2018 Kamil Mikosz
 * Copyright (c) 2019 Sienori
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT */

import CopyWebpackPlugin from "copy-webpack-plugin";
import {
	getHTMLPlugins,
	getOutput,
	getCopyPlugins,
	getZipPlugin,
	getFirefoxCopyPlugins,
	getMiniCssExtractPlugin,
	getEntry,
} from "./webpack.utils.js";
import path from "node:path";
import config from "./config.json" with { type: "json" };
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const { tempDirectory, chromePath, extName, distDirectory, firefoxPath } =
	config;

import chromeConfig from "./src/manifest-chrome.json" with { type: "json" };
import firefoxConfig from "./src/manifest-firefox.json" with { type: "json" };

const extVersion = chromeConfig.version;
const ffExtVersion = firefoxConfig.version;

const generalConfig = {
	mode: "production",
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

export default [
	{
		...generalConfig,
		output: getOutput("chrome", tempDirectory),
		entry: getEntry(chromePath),
		optimization: {
			minimize: true,
		},
		plugins: [
			new CleanWebpackPlugin(),
			...getMiniCssExtractPlugin(),
			...getHTMLPlugins("chrome", tempDirectory, chromePath),
			...getCopyPlugins("chrome", tempDirectory, chromePath),
			getZipPlugin(`${extName}-for-chrome-${extVersion}`, distDirectory),
		],
	},
	{
		...generalConfig,
		entry: getEntry(firefoxPath),
		output: getOutput("firefox", tempDirectory),
		optimization: {
			minimize: true,
		},
		plugins: [
			new CleanWebpackPlugin(),
			...getMiniCssExtractPlugin(),
			...getHTMLPlugins("firefox", tempDirectory, firefoxPath),
			...getFirefoxCopyPlugins("firefox", tempDirectory, firefoxPath),
			getZipPlugin(`${extName}-for-firefox-${ffExtVersion}`, distDirectory),
		],
	},
	{
		mode: "production",
		resolve: {
			alias: {
				src: path.resolve(import.meta.dirname, "src/"),
			},
		},
		entry: { other: path.resolve(import.meta.dirname, "src/background/background.js") },
		output: getOutput("copiedSource", tempDirectory),
		plugins: [
			new CopyWebpackPlugin({
				patterns: [
					{
						from: "src",
						to: path.resolve(import.meta.dirname, `${tempDirectory}/copiedSource/src/`),
						info: { minimized: true },
					},
					{
						from: "*",
						to: path.resolve(import.meta.dirname, `${tempDirectory}/copiedSource/`),
						globOptions: {
							ignore: ["**/BACKERS.md", "**/crowdin.yml"],
						},
					},
				],
			}),
			getZipPlugin(
				`copiedSource-${extName}-${ffExtVersion}`,
				distDirectory,
				"other/",
			),
		],
	},
];
