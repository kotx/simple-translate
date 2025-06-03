/* Copyright (c) 2018 Kamil Mikosz
 * Copyright (c) 2019 Sienori
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT */

import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ZipPlugin from "zip-webpack-plugin";
import { resolve } from "node:path";

export const getHTMLPlugins = (browserDir, outputDir = "dev", sourceDir = "src") => [
	new HtmlWebpackPlugin({
		title: "Popup",
		filename: resolve(
			import.meta.dirname,
			`${outputDir}/${browserDir}/popup/index.html`,
		),
		template: `${sourceDir}/popup/index.html`,
		chunks: ["popup"],
	}),
	new HtmlWebpackPlugin({
		title: "Options",
		filename: resolve(
			import.meta.dirname,
			`${outputDir}/${browserDir}/options/index.html`,
		),
		template: `${sourceDir}/options/index.html`,
		chunks: ["options"],
	}),
];

export const getOutput = (browserDir, outputDir = "dev") => {
	return {
		path: resolve(import.meta.dirname, `${outputDir}/${browserDir}`),
		filename: "[name]/[name].js",
	};
};

export const getEntry = (sourceDir = "src") => {
	return {
		popup: resolve(import.meta.dirname, `${sourceDir}/popup/index.js`),
		options: resolve(import.meta.dirname, `${sourceDir}/options/index.js`),
		content: resolve(import.meta.dirname, `${sourceDir}/content/index.js`),
		background: resolve(
			import.meta.dirname,
			`${sourceDir}/background/background.js`,
		),
	};
};

export const getCopyPlugins = (browserDir, outputDir = "dev", sourceDir = "src") => [
	new CopyWebpackPlugin({
		patterns: [
			{
				from: `${sourceDir}/icons`,
				to: resolve(import.meta.dirname, `${outputDir}/${browserDir}/icons`),
			},
			{
				from: `${sourceDir}/_locales`,
				to: resolve(import.meta.dirname, `${outputDir}/${browserDir}/_locales`),
			},
			{
				from: `${sourceDir}/manifest-chrome.json`,
				to: resolve(import.meta.dirname, `${outputDir}/${browserDir}/manifest.json`),
			},
		],
	}),
];

export const getFirefoxCopyPlugins = (
	browserDir,
	outputDir = "dev",
	sourceDir = "src",
) => [
	new CopyWebpackPlugin({
		patterns: [
			{
				from: `${sourceDir}/icons`,
				to: resolve(import.meta.dirname, `${outputDir}/${browserDir}/icons`),
			},
			{
				from: `${sourceDir}/_locales`,
				to: resolve(import.meta.dirname, `${outputDir}/${browserDir}/_locales`),
			},
			{
				from: `${sourceDir}/manifest-firefox.json`,
				to: resolve(import.meta.dirname, `${outputDir}/${browserDir}/manifest.json`),
			},
		],
	}),
];

export const getMiniCssExtractPlugin = () => [
	new MiniCssExtractPlugin({
		filename: "[name]/[name].css",
	}),
];

export const getZipPlugin = (browserDir, outputDir = "dist", exclude = "") =>
	new ZipPlugin({
		path: resolve(import.meta.dirname, `${outputDir}`),
		filename: browserDir,
		extension: "zip",
		fileOptions: {
			mtime: new Date(),
			mode: 0o100664,
			compress: true,
			forceZip64Format: false,
		},
		zipOptions: {
			forceZip64Format: false,
		},
		exclude: exclude,
	});
