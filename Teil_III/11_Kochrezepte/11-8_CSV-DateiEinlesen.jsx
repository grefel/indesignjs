if (app.documents.length == 0) this.document= false;
#include lib/es5-array.js
#include lib/papaparse.js

main();
function main() {
	var _ial = app.scriptPreferences.userInteractionLevel;
	if (app.documents.length > 0 && app.activeDocument.layoutWindows.length > 0) {
		app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
		var _csvArray = csvEinlesen();
		if (_csvArray != null) {
			erstelleTabelle(_csvArray);
		}
		app.scriptPreferences.userInteractionLevel = _ial;
	}
	else {
		alert("Kein Dokument geöffnet","Hinweis"); 
	}
}

function csvEinlesen() {
	var _datei = File("~/Desktop/11-8-Test.csv");
	if (!_datei.exists) {
		_datei = File.openDialog("Bitte wählen Sie die CSV-Datei aus!");
		if (_datei == null) {
			alert ("Sie haben keine gültige Datei ausgewählt!");
			return null;
		}
		if (!_datei.exists) {
			alert ("Sie haben keine gültige Datei ausgewählt!");
			return null;					
		}
	}
	if (_datei.open("r")) {
		try {
			var _stringDaten = _datei.read();
		}
		catch (e) {
			alert ("Es ist ein Fehler aufgetreten:" + e);
			return null;
		}
		finally {
			_datei.close();
		}
	} else {
		alert ("Bitte kopieren Sie die Datei '11-8-Test.csv' auf Ihren Desktop.");
		return null;
	}
	var _ergebnisObjekt = Papa.parse(_stringDaten, {delimiter: ";"});
	if (_ergebnisObjekt.errors.length == 0 )  {
		return _ergebnisObjekt.data;
	}
	else {
		alert("Es ist ein Fehler aufgetreten: " + _ergebnisObjekt.errors[0].message);
		return null;
	}
}

function erstelleTabelle(_csvArray) {
		// CSV in InDesign Tabelle schreiben
	var dok = app.activeDocument; 
	var tf = dok.textFrames.add();
	var table = tf.tables.add(undefined, undefined, {columnCount:_csvArray[0].length, bodyRowCount:_csvArray.length});
	for (var i = 0; i < _csvArray.length; i++) {
		for (var j = 0; j < _csvArray[i].length; j++) {
			table.rows[i].cells[j].contents = _csvArray[i][j] +"";
		}
	}
	table.columns[1].width = 70;
	tf.fit(FitOptions.FRAME_TO_CONTENT);
}