import { Component, useEffect, useRef } from "react";
import { useLocation } from "react-router";

const ScrollToTop = ({ children }) => {
	const location = useLocation();
	const prevLocationRef = useRef();

	useEffect(() => {
		if (prevLocationRef.current !== location) {
			window.scrollTo(0, 0);
		}
		prevLocationRef.current = location;
	}, [location]);

	return children;
};

export default ScrollToTop;
