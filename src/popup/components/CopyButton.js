import React, { Component } from "react";
import browser from "webextension-polyfill";
import CopyIcon from "../icons/copy.svg";
import "../styles/CopyButton.scss";

export default class CopyButton extends Component {
	constructor(props) {
		super(props);
		this.state = { isCopied: false };
	}

	handleCopy = (copiedText) => {
		navigator.clipboard.writeText(copiedText).then(() => {
			this.setState({ isCopied: true });
		});
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.text !== nextProps.text) this.setState({ isCopied: false });
	}

	render() {
		const { text } = this.props;
		if (!text) return null;

		return (
			<div className="copy">
				{this.state.isCopied && (
					<span className="copiedText">
						{browser.i18n.getMessage("copiedLabel")}
					</span>
				)}
				<button
					className="copyButton"
					title={browser.i18n.getMessage("copyLabel")}
					onClick={() => this.handleCopy(text)}
				>
					<CopyIcon />
				</button>
			</div>
		);
	}
}
