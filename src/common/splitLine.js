import React from "react";

export const splitLine = (text) => {
	const regex = /(\n)/g;
	return (
		text
			.split(regex)
			// biome-ignore lint/suspicious/noArrayIndexKey: No ordering required
			.map((line, i) => (line.match(regex) ? <br key={i} /> : line))
	);
};
