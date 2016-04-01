//DESSCRIPTION Nach kritischen Stellen für den digitalen Export suchen
/*  
@Version: 2.1
@Date: 2016-02-16
@Author: Gregor Fellenz 
http://www.publishingx.de
*/
#targetengine engine_px

var globalObject = this;

/* List of find/Change Functions *********************************************************/
var fcList = {
	iaGREP : [
		{findGREP:"(?<!–)\\t", changeString:" " , errorText:"Tabulatorzeichen", solutionText:"Tabulatorzeichen wird durch Leeraum ersetzt"},
		{findGREP:"-[\\n\\r]", changeString:"" , errorText:"Trennung + Umbruch?", solutionText:"Trennstrich und Umbruch werden entfernt"},
		{findGREP:"(?<=[\\l\\u\\d])[\\-](?=[\\l\\d])", changeString:"" , errorText:"Unklare Trennung?", solutionText:"Trennstrich wird entfernt"},
	],
	defaultGREP : [
		{findGREP:"^\\h+", changeGREP:""}, // Leerraum zu Beginn eines Absatzes entfernen
	],
	iaFunctions : [
		{findFunction:"harterZeilenumbruchAusserTitel", changeFunction:"fix_harterZeilenumbruchAusserTitel", errorText:"Harter Zeilenumbruch (Ohne AF die \"titel\" enthalten)", solutionText:"Zu Leerraum ersetzen"},
	],
	defaultFunctions : [
		{findChangeFunction:"echteGrossbuchstabenErstellen"},
	]
}

/* Interactive Functions *********************************************************/
// findFunction are called with the context:; Document or Textrange, they must return an Array of Texts (the found errors)
function harterZeilenumbruchAusserTitel (context) {
	if (app.findChangeGrepOptions.hasOwnProperty ("searchBackwards")) {
		app.findChangeGrepOptions.searchBackwards = false;
	}
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.findWhat = "\\n";
	var results = context.findGrep(true);
	for (var i = results.length - 1; i >= 0; i--) {
		result = results[i];
		if (result.appliedParagraphStyle.name.toLowerCase().indexOf("titel") > -1) {
			results.splice (i, 1);
		}
	}
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	return results;
}
// fixFunction are called with the currentError Textobject within an Array
function fix_harterZeilenumbruchAusserTitel (args) {
	var currentError = args[0];
	currentError.contents = " ";
}


/* Default Functions *********************************************************/
// findChangeFunction are called with the context:; Document or Textrange and should fix everything needed within the function
function echteGrossbuchstabenErstellen (context) {
	if (app.findChangeGrepOptions.hasOwnProperty ("searchBackwards")) {
		app.findChangeGrepOptions.searchBackwards = false;
	}	
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.capitalization = Capitalization.ALL_CAPS; 
	var results = context.findGrep(true);
	for (var i = 0; i < results.length; i++) {
		results[i].changecase(ChangecaseMode.UPPERCASE); 
		results[i].capitalization = Capitalization.NORMAL; 		
	}
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
}
function leereTextRahmenEntfernen (context) {
	if (app.findChangeGrepOptions.hasOwnProperty ("searchBackwards")) {
		app.findChangeGrepOptions.searchBackwards = false;
	}
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.findWhat = "\\A\\Z";
	var results = context.findGrep();
	for (var i = results.length - 1; i >= 0; i--) {
		results[i].parentTextFrames[0].remove();
	}
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
}


// main Script 
main();

function main() {
	var errorContext = {
		errorArray:[],
		ec:0, // error Counter
		findFunction:"",
		changeFuntion:"",
		errorText: "",
		solutionText: "",
		fcfc:0, // findChangeFunctionCounter
		startSpread:undefined,	
		startZoom:undefined,
		currentError:undefined,
		alreadyFixed:false,
	}
	var fcContext = init();

	if (fcContext) {
		try {
			// First Fix Defaults GREP
			for  (var i = 0; i <  fcList.defaultGREP.length; i++) {
				app.findGrepPreferences = NothingEnum.NOTHING;
				app.changeGrepPreferences = NothingEnum.NOTHING;
				app.findGrepPreferences.findWhat = fcList.defaultGREP[i].findGREP;
				app.changeGrepPreferences.changeTo = fcList.defaultGREP[i].changeGREP; 
				fcContext.changeGrep();
			}			
			// Fix Defaults Functions
			for  (var i = 0; i <  fcList.defaultFunctions.length; i++) {
				globalObject[fcList.defaultFunctions[i].findChangeFunction].apply(globalObject, [fcContext]);
			}

			// Add GREP Queries to Function List
			for  (var i = 0; i <  fcList.iaGREP.length; i++) {
				var grepObject = fcList.iaGREP[i];
				var findFunctionName = "find_px_customFunction" + i; 
				globalObject[findFunctionName] = new Function(["fcContext"], "if (app.findChangeGrepOptions.hasOwnProperty ('searchBackwards')) {\rapp.findChangeGrepOptions.searchBackwards = false;\r}\rapp.findGrepPreferences = NothingEnum.NOTHING;\napp.findGrepPreferences.findWhat = '" + grepObject.findGREP.replace(/\\/g, '\\\\') + "';\nreturn fcContext.findGrep(true);");
				grepObject.findFunction = findFunctionName				
				var replaceFunctionName = "replace_px_customFunction" + i; 
				globalObject[replaceFunctionName] = new Function("args", "var text = args[0];\ntext.contents = '" + grepObject.changeString.replace(/\\/g, '\\\\')  + "';");
				grepObject.changeFunction = replaceFunctionName
				fcList.iaFunctions.push(grepObject);
			}
			// Check for Interactive Queries ... 
			while (errorContext.fcfc <  fcList.iaFunctions.length) {
				if (findErrors(fcList.iaFunctions[errorContext.fcfc])) {
					// Seite/Zoomefaktor und Einstellungen speichern 
					errorContext.startSpread = app.activeWindow.activeSpread;
					errorContext.startZoom = app.activeWindow.zoomPercentage;	
					errorContext.tpsI = app.documents[0].textPreferences.showInvisibles;
					app.documents[0].textPreferences.showInvisibles = true;
					errorContext.redraw = app.scriptPreferences.enableRedraw;
					app.scriptPreferences.enableRedraw = true;
					// GUI 
					var win = Window.find ("palette", "Problemstellen finden ...");
					if (win == null) {
						win = new Window("palette", "Problemstellen finden ...");
						win.alignChildren = ["fill","fill"];
						win.preferredSize.width = 460;
						with (win) {
							win.infoPanel = add( "panel");
							win.infoPanel.preferredSize.width = 460;
							with (win.infoPanel) {
								win.infoPanel.errorCountGroup = add( "group");
								win.infoPanel.errorCountGroup.preferredSize.width = 430;
								with (win.infoPanel.errorCountGroup) {
									win.infoPanel.errorCountGroup.countCurrent = add( "statictext", undefined, "0/0");
									win.infoPanel.errorCountGroup.countCurrent.preferredSize.width = 40;
									win.infoPanel.errorCountGroup.problemDesc = add( "statictext", undefined, "Problem:");
									win.infoPanel.errorCountGroup.problemDesc.graphics.font = ScriptUI.newFont(win.infoPanel.errorCountGroup.problemDesc.graphics.font.name, 'Bold', win.infoPanel.errorCountGroup.problemDesc.graphics.font.size);
									win.infoPanel.errorCountGroup.problemDesc.preferredSize.width = 360;
								}
								win.infoPanel.errorGroup = add( "group");
								win.infoPanel.errorGroup.preferredSize.width = 430;
								win.infoPanel.errorGroup.orientation = "column";
								win.infoPanel.errorGroup.alignChildren= "left";
								with (win.infoPanel.errorGroup) {
									win.infoPanel.errorGroup.textZeile = add( "statictext", undefined, "-");
									win.infoPanel.errorGroup.textZeile.preferredSize.width = 400;
								}
							}

							win.controlGroup = add( "group");
							win.controlGroup.preferredSize.width = 460;
							win.controlGroup.alignChildren = ["fill","fill"];
							win.controlGroup.orientation = "column";
							with (win.controlGroup) {
								win.controlGroup.g1 = add("group");
								with (win.controlGroup.g1) {
									win.controlGroup.g1.previeButton = add( "button", undefined, "&Vorschau");
									win.controlGroup.g1.previeButton.alignment = "left";
									win.controlGroup.g1.previeButton.shortcutKey = "v";			
								}
								win.controlGroup.g2  = add("group");
								win.controlGroup.g2.alignChildren = ["fill","fill"];
								with (win.controlGroup.g2) {
									win.controlGroup.g2.rightGroup = add("group");
									win.controlGroup.g2.rightGroup.correctButton = win.controlGroup.g2.rightGroup.add("button", undefined, "&Korrektur");
									win.controlGroup.g2.rightGroup.correctButton.shortcutKey = "k";
									win.controlGroup.g2.rightGroup.ignoreButton = win.controlGroup.g2.rightGroup.add("button", undefined, "&Ignorieren");
									win.controlGroup.g2.rightGroup.ignoreButton.shortcutKey = "i";
									win.controlGroup.g2.rightGroup.ignoreAllButton = win.controlGroup.g2.rightGroup.add("button", undefined, "Alle ignorieren");

									win.controlGroup.g2.leftGroup = add("group");
									win.controlGroup.g2.leftGroup.orientation = "column";
									win.controlGroup.g2.leftGroup.cancelButton = win.controlGroup.g2.leftGroup.add( "button", undefined , "Abbrechen", {name: "cancel"} );
									win.controlGroup.g2.leftGroup.cancelButton.alignment = "right";
								}
							}
						}
					}
					delete win.controlGroup.g1.previeButton.onClick;
					win.controlGroup.g1.previeButton.onClick =  function() {
						if (!errorContext.alreadyFixed) {
							app.doScript (globalObject[errorContext.changeFuntion], ScriptLanguage.JAVASCRIPT, [errorContext.currentError], UndoModes.ENTIRE_SCRIPT, "fixCrititcalStep");
							errorContext.alreadyFixed = true;
						}
					}
					delete win.controlGroup.g2.rightGroup.correctButton.onClick;
					win.controlGroup.g2.rightGroup.correctButton.onClick =  function() {
						if (errorContext.alreadyFixed == false) {
							app.doScript (globalObject[errorContext.changeFuntion], ScriptLanguage.JAVASCRIPT, [errorContext.currentError], UndoModes.ENTIRE_SCRIPT, "fixCrititcalStep");
						} else {
							errorContext.alreadyFixed = false;
						}
						checkNextStep();
					}
					delete win.controlGroup.g2.rightGroup.ignoreButton.onClick;
					win.controlGroup.g2.rightGroup.ignoreButton.onClick =  function() {
						if (errorContext.alreadyFixed && app.activeDocument.undoName == "fixCrititcalStep") {
							app.activeDocument.undo();
							errorContext.alreadyFixed = false;
						}
						checkNextStep();
					}
					delete win.controlGroup.g2.rightGroup.ignoreAllButton.onClick;
					win.controlGroup.g2.rightGroup.ignoreAllButton.onClick =  function() {
						if (errorContext.alreadyFixed && app.activeDocument.undoName == "fixCrititcalStep") {
							app.activeDocument.undo();
							errorContext.alreadyFixed = false;
						}
						cancelStep();
					}

					delete win.controlGroup.g2.leftGroup.cancelButton.onClick;
					win.controlGroup.g2.leftGroup.cancelButton.onClick =  function() {
						if (errorContext.alreadyFixed && app.activeDocument.undoName == "fixCrititcalStep") {
							app.activeDocument.undo();
							errorContext.alreadyFixed = false;
						}
						win.close();
					}
					delete win.onClose;
					win.onClose = function() {
						app.activeWindow.activeSpread = errorContext.startSpread;
						app.activeWindow.zoom(ZoomOptions.FIT_SPREAD);
						app.select(NothingEnum.NOTHING);	
						app.activeDocument.textPreferences.showInvisibles = errorContext.tpsI;
						app.scriptPreferences.enableRedraw = errorContext.redraw;
						app.findGrepPreferences = NothingEnum.NOTHING;
						app.changeGrepPreferences = NothingEnum.NOTHING;
					}					
					
					showNextError();
					errorContext.fcfc++;
					win.show();
					break;
				}
				errorContext.fcfc++;
			}			
		} catch (e) {
			alert (e + " Line: " + e.line);
		}
	}

	// Check if there is another Error or another Error Function
	function checkNextStep() {
		if (errorContext.ec < errorContext.errorArray.length) {
			showNextError();
			return;
		}
		else {
			while (errorContext.fcfc <  fcList.iaFunctions.length) {
				if (findErrors(fcList.iaFunctions[errorContext.fcfc])) {
					showNextError();
					win.show();
					errorContext.fcfc++;
					return;
				}
				errorContext.fcfc++;
			}
		}

		if (errorContext.fcfc == fcList.iaFunctions.length) {
			win.close();
		}
	}
	function cancelStep() {
		while (errorContext.fcfc <  fcList.iaFunctions.length) {
			if (findErrors(fcList.iaFunctions[errorContext.fcfc])) {
				showNextError();
				win.show();
				errorContext.fcfc++;
				return;
			}
			errorContext.fcfc++;
		}

		if (errorContext.fcfc == fcList.iaFunctions.length) {
			win.close();
		}
	}	
	

	function findErrors (functionObject) {
		errorContext.changeFuntion = functionObject.changeFunction;
		errorContext.errorText =  functionObject.errorText;
		errorContext.solutionText =  functionObject.solutionText;
		errorContext.errorArray = globalObject[functionObject.findFunction].apply(globalObject, [fcContext]);
		errorContext.ec = 0;
		if (errorContext.errorArray.length > 0) return true;
		else return false;
	}
	function showNextError () {
		win.infoPanel.errorCountGroup.problemDesc.text = "Problem: " + errorContext.errorText; 
		win.controlGroup.g2.rightGroup.correctButton.helpTip = "Korrektur: " + errorContext.solutionText;
		win.infoPanel.errorCountGroup.countCurrent.text = (errorContext.ec+1) + "/" + errorContext.errorArray.length;
		errorContext.currentError = errorContext.errorArray[errorContext.ec]
		win.infoPanel.errorGroup.textZeile.text = getLineContents(errorContext.currentError);
		showIt (errorContext.currentError);
		errorContext.alreadyFixed = false;
		errorContext.ec++;
	}
}

// Can we run?
function init() {
	if (parseInt(app.version) < 8)  {
		alert ("Diese Skript benötigt InDesign CS6!");
		return false;
	}

	if (app.layoutWindows.length == 0)  {
		return false;
	}

	var dok = app.documents[0];
	if (dok.stories.length == 0) {
		alert("Es ist kein Text im Dokument enthalten");
		return false;
	}

	// Dokument gespeichert? 
	if ((!dok.saved || dok.modified) ) {
		if ( confirm ("Das Dokument muss zuerst gespeichert werden!\rSpeichern und fortfahren?", undefined, "Dokument ist nicht gespeichert")) {
			try {
				dok = dok.save();
			} catch (e) { 
				alert ("Die Datei konnte nicht gespeichert werden.\n" + e);
				return false;
			}
		}
		else { // User does not want to save -> exit;
			return false; 
		}
	}

	if (app.selection.length > 0 && app.selection[0].hasOwnProperty ("baseline") ) {
		if (app.selection[0].characters.length == 0) {
			return app.selection[0].parentStory;
		}
		else {
			return app.selection[0];
		}
	} 
	else {
		return dok;
	}
}

// Get surrounding text from error
function getLineContents(currentError) {
	if (currentError instanceof Hyperlink) {
		currentError = currentError.source.sourceText;
	}
	var story = currentError.parentStory;
	if (currentError.parent.constructor.name == "Cell") {
		story = currentError.parent.texts[0]
	} 
	var startIndex = currentError.insertionPoints[0].index;
	var endIndex = currentError.insertionPoints[-1].index;
	var vor = story.characters.itemByRange((startIndex >= 10) ? startIndex - 10:startIndex,(startIndex >= 1) ? startIndex - 1:startIndex);
	var nach = story.characters.itemByRange((endIndex < story.characters.length-1) ? endIndex + 1:endIndex , (endIndex < story.characters.length-10) ? endIndex + 10:endIndex );
	var stelle = story.characters.itemByRange(startIndex, endIndex);
	var res = vor.contents + "[" +  stelle.contents.toString() + "]" + nach.contents;	
	res = res.replace(/\n/g, '');
	res = res.replace(/\r/g, '');
	res = res.replace(/\[FORCED_LINE_BREAK\]/g, '[HARTER ZEILENUMBRUCH]');
	res = res.replace(/\[DISCRETIONARY_HYPHEN\]/g, '[BEDINGTE TRENNUNG]');
	res = res.replace(/\￼/g, '[VERANKERTES OBJEKT]');
	res = res.replace(/\/g, '[EINZUG HIER]');
	res = res.replace(/\t/g, '[TABULATOR]');
	return res;
}
function showIt (_object) {
    if (_object != null) {
        if (_object.hasOwnProperty ("source")) _object = _object.source;
        if (_object.hasOwnProperty ("sourcePageItem")) _object = _object.sourcePageItem;
        if (_object.hasOwnProperty ("sourceText")) _object = _object.sourceText;
        var _spread = getSpreadByObject (_object);
        if (_spread != null) {
            var _dok = _spread.parent;
            if (_dok.layoutWindows.length > 0 && (app.activeWindow.parent != _dok || app.activeWindow.constructor.name == "StoryWindow" )) {
                app.activeWindow = _dok.layoutWindows[0];
            }
            app.activeWindow.activeSpread = _spread;
        }
        app.select(_object);
        var myZoom = app.activeWindow.zoomPercentage; 
        app.activeWindow.zoom(ZoomOptions.showPasteboard); 
        app.activeWindow.zoomPercentage = 200;
        return true;
    }
    else {
        return false;
    }
}

function getSpreadByObject  (_object) {
	if (_object != null) {
		_object = _object.getElements ()[0]; // Problems with Baseclass Objects like PageItem in CS5!
		if (_object.hasOwnProperty("baseline")) {
			_object = _object.parentTextFrames[0];
		}
		while (_object != null) {
			var whatIsIt = _object.constructor;
			switch (whatIsIt) {
				case Spread : return _object;
				case MasterSpread : return _object;
				case Character : _object = _object.parentTextFrames[0]; break;
				case Footnote :; // drop through
				case Cell : _object = _object.insertionPoints[0].parentTextFrames[0]; break;
				case Note : _object = _object.storyOffset.parentTextFrames[0]; break;
				case XMLElement : if (_object.insertionPoints[0].isValid) { _object = _object.insertionPoints[0].parentTextFrames[0]; break; }
				case Application : return null;
				default: _object = _object.parent;
			}
			if (_object == null) return null;
		}
		return _object;
	} 
	else {
		return null;
	}
}
