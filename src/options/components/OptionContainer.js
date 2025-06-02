import React from "react";
import { setSettings } from "src/settings/settings";
import browser from "webextension-polyfill";
import KeyboardShortcutForm from "./KeyboardShortcutForm";
import "../styles/OptionContainer.scss";

export default (props) => {
	const { title, captions, type, id, children, currentValue } = props;

	const handleValueChange = (e) => {
		let value = e.target.value;

		if (type === "number") {
			const validity = e.target.validity;
			if (validity.rangeOverflow) value = props.max;
			else if (validity.rangeUnderflow) value = props.min;
			else if (validity.badInput || value === "" || !validity.valid)
				value = props.default;
		}

		setSettings(id, value);

		if (props.handleChange) props.handleChange();
	};

	const handleCheckedChange = (e) => {
		setSettings(id, e.target.checked);
	};

	let formId;
	let optionForm;
	switch (type) {
		case "checkbox":
			formId = id;
			optionForm = (
				<label>
					<input
						type="checkbox"
						id={formId}
						onChange={handleCheckedChange}
						defaultChecked={currentValue}
					/>
					<span className="checkbox" />
				</label>
			);
			break;
		case "number":
			formId = id;
			optionForm = (
				<input
					type="number"
					id={formId}
					min={props.min}
					max={props.max}
					step={props.step}
					placeholder={props.placeholder}
					onChange={handleValueChange}
					defaultValue={currentValue}
				/>
			);
			break;
		case "text":
			formId = id;
			optionForm = (
				<input
					type="text"
					id={formId}
					placeholder={props.placeholder}
					onChange={handleValueChange}
					defaultValue={currentValue}
				/>
			);
			break;
		case "textarea":
			formId = id;
			optionForm = (
				<textarea
					id={formId}
					spellCheck={false}
					placeholder={props.placeholder}
					onChange={handleValueChange}
					defaultValue={currentValue}
				/>
			);
			break;
		case "radio":
			formId = `${id}_${props.value}`;
			optionForm = (
				<label>
					<input
						type="radio"
						id={formId}
						name={id}
						value={props.value}
						onChange={handleValueChange}
						defaultChecked={props.value === currentValue ? "checked" : ""}
					/>
					<span className="radio" />
				</label>
			);
			break;
		case "color":
			formId = id;
			optionForm = (
				<label>
					<input
						type="color"
						id={formId}
						onChange={handleValueChange}
						defaultValue={currentValue}
					/>
				</label>
			);
			break;
		case "select":
			formId = id;
			optionForm = (
				<div className="selectWrap">
					<select id={formId} onChange={handleValueChange} value={currentValue}>
						{(typeof props.options === "function"
							? props.options()
							: props.options
						).map((option, index) => (
							<option value={option.value} key={option.name}>
								{props.useRawOptionName
									? option.name
									: browser.i18n.getMessage(option.name)}
							</option>
						))}
					</select>
				</div>
			);
			break;
		case "button":
			formId = "";
			optionForm = (
				<input
					type="button"
					value={browser.i18n.getMessage(props.value)}
					onClick={props.onClick}
				/>
			);
			break;
		case "file":
			formId = "";
			optionForm = (
				<label className="button includeSpan" htmlFor={id}>
					<span>{browser.i18n.getMessage(props.value)}</span>
					<input
						type="file"
						id={id}
						accept={props.accept}
						multiple={props.multiple}
						onChange={props.onChange}
					/>
				</label>
			);
			break;
		case "keyboard-shortcut":
			formId = id;
			optionForm = (
				<KeyboardShortcutForm
					id={id}
					shortcut={props.shortcut}
					defaultValue={props.defaultValue}
				/>
			);
			break;
		case "none":
			formId = "";
			optionForm = "";
			break;
	}

	const shouldShow =
		props.shouldShow === undefined ||
		(typeof props.shouldShow === "function"
			? props.shouldShow()
			: props.shouldShow);

	return (
		shouldShow && (
			<li
				className={`optionContainer ${props.updated ? "updated" : ""} ${props.new ? "new" : ""}`}
			>
				{props.hr && <hr />}
				<div
					className={`optionElement ${type === "textarea" ? "showColumn" : ""}`}
				>
					<div className="optionText">
						<label className="noHover" htmlFor={formId ? formId : null}>
							<p>
								{title
									? props.useRawTitle
										? title
										: browser.i18n.getMessage(title)
									: ""}
							</p>
						</label>
						{captions.map((caption) => (
							<p className="caption" key={caption}>
								{caption
									? props.useRawCaptions
										? caption
										: browser.i18n.getMessage(caption).replace(/<br>/g, "\n")
									: ""}
							</p>
						))}
						{props.extraCaption ? props.extraCaption : ""}
					</div>
					<div className="optionForm">{optionForm}</div>
				</div>
				{children && (
					<fieldset>
						<legend className="noDisplayLegend">
							{title
								? props.useRawTitle
									? title
									: browser.i18n.getMessage(title)
								: ""}
						</legend>
						{children}
					</fieldset>
				)}
			</li>
		)
	);
};
