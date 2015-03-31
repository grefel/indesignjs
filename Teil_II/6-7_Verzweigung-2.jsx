var _auswahl = app.selection[0];
if (_auswahl.itemLayer.name == "Ebene1") {
	alert ("Auswahl ist auf Ebene1");
} else if (_auswahl.itemLayer.name == "Ebene2") {
	alert ("Auswahl ist auf Ebene2");
} else if (_auswahl.itemLayer.name == "Ebene3") {
	alert ("Auswahl ist auf Ebene3");
} else { 
	alert ("Auswahl ist nicht auf Ebene1, Ebene2 oder Ebene3");
}