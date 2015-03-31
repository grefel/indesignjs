#target InDesign

elementLoeschen();

function elementLoeschen (_dok) {
	var _dok = app.activeDocument;
	var _root = _dok.xmlElements[0];
	var _xpath = "//zutat";
	var _node = null; 

	// Die eigentliche XML-Rule
	try { 
		var _proc = app.xmlRuleProcessors.add([_xpath]); 
		var _match = _proc.startProcessingRuleSet(_root); 
		while( _match!=undefined ) {
			_node = _match.element; 
			_proc.skipChildren();
			_node.remove();
			_match = _proc.findNextMatch(); 
		}
	}			
	catch(e) {
		alert ("Es ist ein Fehler aufgetreten: " + e);
	} 
	_proc.endProcessingRuleSet();
	_proc.remove(); 
}