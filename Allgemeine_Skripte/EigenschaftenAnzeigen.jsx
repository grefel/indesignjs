#target InDesign
// Das Skript zeigt alle Eigenschaften und Methoden eines ausgewählten Objekts an
var _ial = app.scriptPreferences.userInteractionLevel;
app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;

showProps();

app.scriptPreferences.userInteractionLevel = _ial;

/** Function showProps
	Eigenschaften eines Objektes auswählen */
function showProps() {
	// Auszuwertendes Objekt festlegen
	if (app.documents.length > 0 && app.selection.length > 0) {
		_objekt = app.selection[0];
	}
	else if (app.documents.length > 0) {
		alert ("Es wurde nichts ausgewählt!\nEs werden die Eigenschaften und Methoden des Dokuments angezeigt.")
		_objekt = app.documents[0];
	}
	else {
		alert ("Es wurde nichts ausgewählt!\nEs werden die Eigenschaften und Methoden der Applikation angezeigt.")
		_objekt = app;
	}

	var _resultArray = [];
	
	for (var i = 0; i < _objekt.reflect.properties.length; i++) {
		var _property = _objekt.reflect.properties[i];
		if (_property.toString() === "__proto__" || _property.toString() === "reflect" || _property.toString() === "properties") continue;	
		try { _result = _objekt[_property]; } 
		catch (e) { _result = "Nicht auswertbar"; }	
		if (_result != null && _result.constructor.name === "Array") _resultArray.push(_objekt.constructor.name + "." + _property + " = [" + _result + "]"); 
		else _resultArray.push(_objekt.constructor.name + "." + _property + " = " + _result); 
	}
	alert_scroll("Eigenschaften des Objekts", _resultArray.sort());
}

// Scrollable alert function by Peter Kahrel http://forums.adobe.com/message/2869250#2869250
function alert_scroll (title, input){
	if (input instanceof Array) input = input.join ("\r");
	var w = new Window ("dialog", title);
	var list = w.add ("edittext", undefined, input, {multiline: true, scrolling: true});
	list.maximumSize.height = w.maximumSize.height-100;
	list.minimumSize.width = 450;
	w.add ("button", undefined, "Close", {name: "ok"});
	w.show ();
}
