import React from "react";
import browser from "webextension-polyfill";
import OptionContainer from "./OptionContainer";
import "../styles/CategoryContainer.scss";

export default (props) => {
	const { category, elements, currentValues = {} } = props;
	return (
		<li className="categoryContainer">
			<fieldset>
				<legend>
					<p className="categoryTitle">
						{category !== "" ? browser.i18n.getMessage(category) : ""}
					</p>
				</legend>
				<ul className="categoryElements">
					{elements.map((option, index) => (
						<div key={option.id}>
							<OptionContainer
								{...option}
								currentValue={currentValues[option.id]}
							>
								{Object.hasOwn(option, "childElements") && (
									<ul className="childElements">
										{option.childElements.map((option) => (
											<OptionContainer
												{...option}
												currentValue={currentValues[option.id]}
												key={`${option.id}-${option.title}`}
											/>
										))}
									</ul>
								)}
							</OptionContainer>
							<hr />
						</div>
					))}
				</ul>
			</fieldset>
		</li>
	);
};
