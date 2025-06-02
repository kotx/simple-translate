import React from "react";
import { Route, Routes } from "react-router-dom";
import browserInfo from "browser-info";
import SettingsPage from "./SettingsPage";
import KeyboardShortcutsPage from "./KeyboardShortcutsPage";
import InformationPage from "./InformationPage";
import "../styles/ContentsArea.scss";

const isValidShortcuts = browserInfo().name === "Firefox" && browserInfo().version >= 60;

export default () => (
  <div className="contentsArea">
    <Routes>
      <Route path="/settings" element={<SettingsPage />} />
      {isValidShortcuts && <Route path="/shortcuts" element={<KeyboardShortcutsPage />} />}
      <Route path="/information" element={<InformationPage />} />
      <Route element={<SettingsPage />} />
    </Routes>
  </div>
);
