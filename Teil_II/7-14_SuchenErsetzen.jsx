with (app.findChangeTextOptions) {
	caseSensitive = false;
	wholeWord = false;
	includeFootnotes = true;
	includeHiddenLayers = false;
	includeLockedLayersForFind = false;
	includeLockedStoriesForFind = false;
	includeMasterPages = false;
}
app.findTextPreferences = NothingEnum.nothing;
app.changeTextPreferences = NothingEnum.nothing;
app.findTextPreferences.findWhat = "Suchausdruck";
app.findTextPreferences.fontStyle = "Bold";
app.changeTextPreferences.changeTo = "Ersetzung";
app.changeTextPreferences.fontStyle = "Italic";
var _suchErgebnis = app.activeDocument.findText();
alert ("Es gibt " + _suchErgebnis.length + " Treffer für die Suche!");
app.activeDocument.changeText();
app.findTextPreferences = NothingEnum.nothing;
app.changeTextPreferences = NothingEnum.nothing;
