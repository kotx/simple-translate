import React, { StrictMode } from "react";
import { HashRouter } from "react-router";
import browser from "webextension-polyfill";
import { getSettings, initSettings } from "../../settings/settings";
import ContentsArea from "./ContentsArea";
import ScrollToTop from "./ScrollToTop";
import SideBar from "./SideBar";
import "../styles/OptionsPage.scss";

const setupTheme = async () => {
	await initSettings();
	document.body.classList.add(`${getSettings("theme")}-theme`);

	browser.storage.local.onChanged.addListener((changes) => {
		if (changes.Settings.newValue.theme === changes.Settings.oldValue.theme)
			return;

		document.body.classList.replace(
			`${changes.Settings.oldValue.theme}-theme`,
			`${changes.Settings.newValue.theme}-theme`,
		);
	});
};

const UILanguage = browser.i18n.getUILanguage();
const rtlLanguage = ["he", "ar"].includes(UILanguage);
const optionsPageClassName = `optionsPage${rtlLanguage ? " rtl-language" : ""}`;

export default () => {
	setupTheme();
	return (
		<StrictMode>
			<HashRouter
				future={{
					v7_relativeSplatPath: true,
					v7_startTransition: true,
				}}
			>
				<ScrollToTop>
					<div className={optionsPageClassName}>
						<SideBar />
						<ContentsArea />
					</div>
				</ScrollToTop>
			</HashRouter>
		</StrictMode>
	);
};
