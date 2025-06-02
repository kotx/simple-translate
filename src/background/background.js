import log from "loglevel";
import { overWriteLogLevel, updateLogLevel } from "src/common/log";
import { handleSettingsChange, initSettings } from "src/settings/settings";
import browser from "webextension-polyfill";
import { onCommandListener } from "./keyboardShortcuts";
import {
	onMenusClickedListener,
	onMenusShownListener,
	showMenus,
} from "./menus";
import onInstalledListener from "./onInstalledListener";
import onMessageListener from "./onMessageListener";

const logDir = "background/background";

browser.runtime.onInstalled.addListener(onInstalledListener);
browser.commands.onCommand.addListener(onCommandListener);
browser.runtime.onMessage.addListener(onMessageListener);
browser.storage.local.onChanged.addListener((changes) => {
	handleSettingsChange(changes);
	updateLogLevel();
	showMenus();
});

if (browser.contextMenus?.onShown)
	browser.contextMenus.onShown.addListener(onMenusShownListener);
browser.contextMenus.onClicked.addListener(onMenusClickedListener);

const init = async () => {
	await initSettings();
	overWriteLogLevel();
	updateLogLevel();
	log.info(logDir, "init()");
	showMenus();
};
init();
