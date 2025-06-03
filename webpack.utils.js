/* Copyright (c) 2018 Kamil Mikosz
 * Copyright (c) 2019 Sienori
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT */

import path from "node:path";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ZipPlugin from "zip-webpack-plugin";

export const getHTMLPlugins = (
	browserDir,
	outputDir = "dev",
	sourceDir = "src",
) => [
	new HtmlWebpackPlugin({
		title: "Popup",
		filename: path.resolve(
			import.meta.dirname,
			`${outputDir}/${browserDir}/popup/index.html`,
		),
		template: `${sourceDir}/popup/index.html`,
		chunks: ["popup"],
	}),
	new HtmlWebpackPlugin({
		title: "Options",
		filename: path.resolve(
			import.meta.dirname,
			`${outputDir}/${browserDir}/options/index.html`,
		),
		template: `${sourceDir}/options/index.html`,
		chunks: ["options"],
	}),
];

export const getOutput = (browserDir, outputDir = "dev") => {
	return {
		path: path.resolve(import.meta.dirname, `${outputDir}/${browserDir}`),
		filename: "[name]/[name].js",
	};
};

export const getEntry = (sourceDir = "src") => {
	return {
		popup: path.resolve(import.meta.dirname, `${sourceDir}/popup/index.js`),
		options: path.resolve(import.meta.dirname, `${sourceDir}/options/index.js`),
		content: path.resolve(import.meta.dirname, `${sourceDir}/content/index.js`),
		background: path.resolve(
			import.meta.dirname,
			`${sourceDir}/background/background.js`,
		),
	};
};

export const getCopyPlugin = (
	browserDir,
	outputDir = "dev",
	sourceDir = "src",
) =>
	new CopyWebpackPlugin({
		patterns: [
			{
				from: `${sourceDir}/icons`,
				to: path.resolve(
					import.meta.dirname,
					`${outputDir}/${browserDir}/icons`,
				),
			},
			{
				from: `${sourceDir}/_locales`,
				to: path.resolve(
					import.meta.dirname,
					`${outputDir}/${browserDir}/_locales`,
				),
			},
			{
				from: `${sourceDir}/manifest-chrome.json`,
				to: path.resolve(
					import.meta.dirname,
					`${outputDir}/${browserDir}/manifest.json`,
				),
			},
		],
	});

export const getFirefoxCopyPlugin = (
	browserDir,
	outputDir = "dev",
	sourceDir = "src",
) =>
	new CopyWebpackPlugin({
		patterns: [
			{
				from: `${sourceDir}/icons`,
				to: path.resolve(
					import.meta.dirname,
					`${outputDir}/${browserDir}/icons`,
				),
			},
			{
				from: `${sourceDir}/_locales`,
				to: path.resolve(
					import.meta.dirname,
					`${outputDir}/${browserDir}/_locales`,
				),
			},
			{
				from: `${sourceDir}/manifest-firefox.json`,
				to: path.resolve(
					import.meta.dirname,
					`${outputDir}/${browserDir}/manifest.json`,
				),
			},
		],
	});

export const getMiniCssExtractPlugin = () =>
	new MiniCssExtractPlugin({
		filename: "[name]/[name].css",
	});

export const getZipPlugin = (browserDir, outputDir = "dist", exclude = "") =>
	new ZipPlugin({
		path: path.resolve(import.meta.dirname, `${outputDir}`),
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

export const getGeneralConfig = (isProduction = false) => ({
	mode: isProduction ? "production" : "development",
	...(isProduction ? {} : { devtool: "source-map" }),
	resolve: {
		alias: {
			src: path.resolve(import.meta.dirname, "src/"),
			"webextension-polyfill":
				"webextension-polyfill/dist/browser-polyfill.min.js",
		},
		extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
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
	...(isProduction
		? {
				optimization: {
					minimize: true,
				},
			}
		: {}),
});
