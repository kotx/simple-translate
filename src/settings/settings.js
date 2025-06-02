import browser from "webextension-polyfill";
import log from "loglevel";
import defaultSettings from "./defaultSettings";

const logDir = "settings/settings";
let currentSettings = {};

export const initSettings = async () => {
  const response = await browser.storage.local.get("Settings");
  currentSettings = response.Settings || {};
  let shouldSave = false;

  const pushSettings = element => {
    if (element.id === undefined || element.default === undefined) return;
    if (currentSettings[element.id] === undefined) {
      currentSettings[element.id] = element.default;
      shouldSave = true;
    }
  };

  const fetchDefaultSettings = () => {
    for (const category of defaultSettings) {
      for (const optionElement of category.elements) {
        pushSettings(optionElement);
        if (optionElement.childElements) {
          for (const childElement of optionElement.childElements) {
            pushSettings(childElement);
          }
        }
      }
    }
  };

  fetchDefaultSettings();
  if (shouldSave) await browser.storage.local.set({ Settings: currentSettings });
};

export const setSettings = async (id, value) => {
  log.info(logDir, "setSettings()", id, value);
  currentSettings[id] = value;
  await browser.storage.local.set({ Settings: currentSettings });
};

export const getSettings = id => {
  return currentSettings[id];
};

export const getAllSettings = () => {
  return currentSettings;
};

export const resetAllSettings = async () => {
  log.info(logDir, "resetAllSettings()");
  currentSettings = {};
  await browser.storage.local.set({ Settings: currentSettings });
  await initSettings();
};

export const handleSettingsChange = (changes) => {
  if (Object.keys(changes).includes("Settings")) {
    currentSettings = changes.Settings.newValue;
    return currentSettings;
  }
  return null;
};

export const exportSettings = async () => {
  const settingsIds = getSettingsIds();

  const settingsObj = {};
  for (const id of settingsIds) {
    settingsObj[id] = getSettings(id);
  }

  const downloadUrl = URL.createObjectURL(
    new Blob([JSON.stringify(settingsObj, null, "  ")], {
      type: "aplication/json"
    })
  );

  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = "SimpleTranslate_Settings.json";
  a.href = downloadUrl;
  a.click();
  a.remove();
  URL.revokeObjectURL(downloadUrl);
};

export const importSettings = async e => {
  const reader = new FileReader();

  reader.onload = async () => {
    const importedSettings = JSON.parse(reader.result);
    const settingsIds = getSettingsIds();

    for (const id of settingsIds) {
      if (importedSettings[id] !== undefined) await setSettings(id, importedSettings[id]);
    }

    location.reload(true);
  };

  const file = e.target.files[0];
  reader.readAsText(file);
};

const getSettingsIds = () => {
  const settingsIds = [];
  for (const category of defaultSettings) {
    for (const optionElement of category.elements) {
      if (optionElement.id && optionElement.default !== undefined) settingsIds.push(optionElement.id);
      if (optionElement.childElements) {
        for (const childElement of optionElement.childElements) {
          if (childElement.id && childElement.default !== undefined) settingsIds.push(childElement.id);
        }
      }
    }
  }
  return settingsIds;
};
