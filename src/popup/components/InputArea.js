import React, { Component } from "react";
import ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import ListenButton from "./ListenButton";
import "../styles/InputArea.scss";

export default class InputArea extends Component {
	constructor(props) {
		super(props);
		this.textareaRef = React.createRef();
	}

	resizeTextArea = () => {
		const textarea = this.textareaRef.current;
		textarea.style.height = "1px";
		textarea.style.height = `${textarea.scrollHeight + 2}px`;
	};

	handleInputText = (e) => {
		const inputText = e.target.value;
		this.props.handleInputText(inputText);
	};

	shouldComponentUpdate(nextProps) {
		const shouldUpdate =
			this.props.inputText !== nextProps.inputText ||
			this.props.sourceLang !== nextProps.sourceLang;
		return shouldUpdate;
	}

	componentDidUpdate = () => {
		this.resizeTextArea();
	};

	render() {
		const { inputText, sourceLang } = this.props;
		return (
			<div id="inputArea">
				<textarea
					value={inputText}
					ref={this.textareaRef}
					placeholder={browser.i18n.getMessage("initialTextArea")}
					onChange={this.handleInputText}
					spellCheck={false}
					dir="auto"
				/>
				<div className="listen">
					{sourceLang && <ListenButton text={inputText} lang={sourceLang} />}
				</div>
			</div>
		);
	}
}
