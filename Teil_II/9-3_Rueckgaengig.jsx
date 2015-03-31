#target InDesign 
if (app.scriptPreferences.version >= 6 ) {
	app.doScript(main, ScriptLanguage.JAVASCRIPT , ["erster","zweiter"], UndoModes.ENTIRE_SCRIPT, "Name für Menu" ); 		
} 
else {
	main(["erster","zweiter"]);
}

function main (_args) {
	var _ersterParameter = _args[0];
	var _zweiterParameter = _args[1];
	$.writeln(_ersterParameter + " " + _zweiterParameter);
	// ...
}