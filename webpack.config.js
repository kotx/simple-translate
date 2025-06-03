/* Copyright (c) 2018 Kamil Mikosz
 * Copyright (c) 2019 Sienori
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT */

import path from "node:path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import config from "./config.json" with { type: "json" };
import {
	getCopyPlugin,
	getEntry,
	getFirefoxCopyPlugin,
	getGeneralConfig,
	getHTMLPlugins,
	getMiniCssExtractPlugin,
	getOutput,
	getZipPlugin,
} from "./webpack.utils.js";

const {
	chromePath,
	devDirectory,
	firefoxPath,
	tempDirectory,
	extName,
	distDirectory,
} = config;

import chromeConfig from "./src/manifest-chrome.json" with { type: "json" };
import firefoxConfig from "./src/manifest-firefox.json" with { type: "json" };

const extVersion = chromeConfig.version;
const ffExtVersion = firefoxConfig.version;

export default (env, argv) => {
	const isProduction =
		argv.mode === "production" || process.env.NODE_ENV === "production";
	const outputDir = isProduction ? tempDirectory : devDirectory;

	const generalConfig = getGeneralConfig();
	const chromeConfig = {
		...generalConfig,
		entry: getEntry(chromePath),
		output: getOutput("chrome", outputDir),
		plugins: [
			...(isProduction ? [new CleanWebpackPlugin()] : []),
			getMiniCssExtractPlugin(),
			...getHTMLPlugins("chrome", outputDir, chromePath),
			getCopyPlugin("chrome", outputDir, chromePath),
			...(isProduction
				? [getZipPlugin(`${extName}-for-chrome-${extVersion}`, distDirectory)]
				: []),
		],
	};

	const firefoxConfig = {
		...generalConfig,
		entry: getEntry(firefoxPath),
		output: getOutput("firefox", outputDir),
		plugins: [
			...(isProduction ? [new CleanWebpackPlugin()] : []),
			getMiniCssExtractPlugin(),
			getFirefoxCopyPlugin("firefox", outputDir, firefoxPath),
			...getHTMLPlugins("firefox", outputDir, firefoxPath),
			...(isProduction
				? [
						getZipPlugin(
							`${extName}-for-firefox-${ffExtVersion}`,
							distDirectory,
						),
					]
				: [
						new BundleAnalyzerPlugin({
							openAnalyzer: false,
							analyzerHost: "127.0.0.1",
							analyzerPort: 8888,
						}),
					]),
		],
	};

	const configs = [chromeConfig, firefoxConfig];

	if (isProduction) {
		configs.push({
			mode: "production",
			resolve: {
				alias: {
					src: path.resolve(import.meta.dirname, "src/"),
				},
			},
			entry: {
				other: path.resolve(
					import.meta.dirname,
					"src/background/background.js",
				),
			},
			output: getOutput("copiedSource", tempDirectory),
			plugins: [
				new CopyWebpackPlugin({
					patterns: [
						{
							from: "src",
							to: path.resolve(
								import.meta.dirname,
								`${tempDirectory}/copiedSource/src/`,
							),
							info: { minimized: true },
						},
						{
							from: "*",
							to: path.resolve(
								import.meta.dirname,
								`${tempDirectory}/copiedSource/`,
							),
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
		});
	}

	return configs;
};
