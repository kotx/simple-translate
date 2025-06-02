module.exports = {
	presets: [
		[
			"@babel/preset-env",
			{
				targets: {
					firefox: 57,
				},
			},
		],
		"@babel/preset-react",
	],
	plugins: [
		"@babel/plugin-transform-nullish-coalescing-operator",
		"@babel/plugin-transform-optional-chaining",
		"@babel/plugin-syntax-optional-chaining",
		"@babel/plugin-transform-object-rest-spread",
		"transform-class-properties",
	],
};
