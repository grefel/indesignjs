var _importDatei = File.openDialog ("Bitte wählen Sie eine Word-Datei aus", "*.doc", false);
with (app.wordRTFImportPreferences) {
	useTypographersQuotes = true;
	removeFormatting = true;
	importEndnotes = true;
	importFootnotes = true;
	importIndex = false;
	importTOC = false;
}
app.activeDocument.place(_importDatei, false);