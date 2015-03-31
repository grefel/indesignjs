#target InDesign
var _auswahl = app.selection[0];
var _datei = File.openDialog ("Bitte eine Bilddatei auswählen");
if (_auswahl.constructor.name =="Rectangle" && _datei != null) {
	_auswahl.place(_datei);
	_auswahl.fit(FitOptions.FILL_PROPORTIONALLY);
	_auswahl.fit(FitOptions.CENTER_CONTENT);
} else {
	alert("Bitte wählen Sie einen Rechteckrahmen und eine Datei aus!");
}
