main();

function main() {
	var _infoFile = File (getScriptFolderPath() + "/11-6_info.idms");
	if (!_infoFile.exists) {
		alert ("Die Datei " + _infoFile + " liegt nicht am erwarteten Ort!");
		return;
	}
	if (app.selection.length != 1 || !(app.selection.length == 1 && app.selection[0].constructor.name == "Group" && app.selection[0].pageItems.length == 2 && app.selection[0].allGraphics.length == 1 && app.selection[0].textFrames.length == 1) ) {		
		alert ("Bitte wählen Sie eine Gruppe mit Bild und Bildunterschrift aus!");
		return; 
	}
	var _bildgruppe = app.selection[0];
	createButton(_bildgruppe, _infoFile);
}

function createButton(_bildgruppe, _infoFile) {
	var _bu = _bildgruppe.textFrames[0];
	var _page = _bildgruppe.parentPage;	
	var _placeResult = _page.place(_infoFile);
	var _infoItem = _placeResult[0];
	var x = _bu.geometricBounds[3] - 30;
	var y = _bu.geometricBounds[2] - 30;
	_infoItem.move([x,y]);		
	var _mso = _page.multiStateObjects.add();
	_mso.name = "InfoBildMSO";
	_mso.addItemsAsState(_infoItem);
	_mso.states[-1].name = "InfoSymbol";
	_stae = _mso.addItemsAsState(_bu);
	_mso.states[-1].name = "Bildunterschrift";
	_mso.states.itemByRange(0,1).remove();
	var _btn = _page.buttons.add();
	_btn.name = "ButtonBU";
	_btn.geometricBounds = _bu.geometricBounds;
	var _behavior = _btn.gotoNextStateBehaviors.add();
	_behavior.behaviorEvent = BehaviorEvents.MOUSE_UP;
	_behavior.associatedMultiStateObject = _mso;
	_behavior.loopsToNextOrPrevious = true;
	var _bild = _bildgruppe.pageItems[0].getElements()[0];
	_bildgruppe.ungroup();
	_page.groups.add([_bild, _mso, _btn]);
}

/** Get Filepath from current script */
/*Folder*/ function getScriptFolderPath() {
	try {
		scriptPath = app.activeScript.parent;
	} 
	catch (e) { 
		/* We're running from the ESTK*/
		scriptPath = File(e.fileName).parent;
	}
	return scriptPath;
}
