//DESCRIPTION: Reinigt die Dateinamen von Verknüpfungen von für den EPUB-Export
/*  
@Version: 1.1
@Date: 2015-01-30
@Author: Gregor Fellenz
http://www.publishingx.de
*/

startProcessing();

/* Version und Dokument prüfen, Skript starten */
function startProcessing () {
	try {
		// InDesign Version prüfen
		if (app.scriptPreferences.version >= 5 ) {
			var scriptV = app.scriptPreferences.version;
			app.scriptPreferences.version = 5;
			var userLevel = app.scriptPreferences.userInteractionLevel;
			app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
				
			// Dokument vorhanden?
			if (app.layoutWindows.length == 0) {
				alert ("Es ist kein Dokument ge\u00F6ffnet.");
				return;
			}
			var dok = app.activeDocument;
			// Dokument gespeichert? 
			if (!dok.saved || dok.modified) {
				if ( confirm ("Das Dokument muss zuerst gespeichert werden!\rSpeichern und fortfahren?", undefined, "Dokument ist nicht gespeichert")) {
					try {
						dok = dok.save();
					} catch (e) { 
						alert ("Die Datei konnte nicht gespeichert werden.\n" + e);
						return;
					}
				}
				else { // User does not want to save -> exit;
					return; 
				}
			}
			app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
			// Bilder neu verknüpfen 
			relinkImages(dok);
		} 		
		else {
			alert ("Es wird mindestens InDesign CS3 ben\u00F6tigt ...");
		}
	} catch (e) {
		var msg = "Fehler: " + e + "\rZeile: " + e.line;
		alert(msg);
	} finally {
		app.scriptPreferences.version = scriptV;
		app.scriptPreferences.userInteractionLevel = userLevel;
	}						

}

/* Bilder erneut verküpfen */
function relinkImages(dok) {
	var config = getConfig();
	if (!config) return;
	// Verknüpfungen einsammeln
	var linkArray = [];
	var knownFilesArray = [];
	var relinkObject = {};

	for (var i = 0; i < dok.links.length; i++) {
		var idLink = dok.links[i];	
		if (isRelevantLink(idLink)) {
			var fileName = idLink.name;
			var fullName = idLink.filePath + "/" + fileName;
			var newFileName = getNewName(fileName, config, false);
			if (knownFilesArray[newFileName] != undefined) {
				newFileName = getNewName(fileName, config, true);
			}
			
			// Datei ist unbekannt 
			if (knownFilesArray[fullName] == undefined) {
				relinkObject = {
					link:idLink,
					newName:newFileName
				}
				var length = linkArray.push([relinkObject]);
				knownFilesArray[fullName] = length -1;
				knownFilesArray[newFileName] = length -1;
			} 
			// Datei ist bekannt Bildname entsprechend dem ersten Vorkommen
			else {
				relinkObject = {
					link:idLink,
					newFileName:linkArray[knownFilesArray[fullName]][0].newFileName
				}
				// Link anhaengen 				
				linkArray[knownFilesArray[fullName]].push(relinkObject);
			}
		}
	}

	// In _linkArray befinden sich jetzt alle Verknüpfungen die verarbeitet werden koennen. 
	if (linkArray.length == 0) {
		alert ("Es wurden keine Bilder f\u00fcr die Verarbeitung gefunden!");
		return;
	}

	if (config.copyFiles) {
		// Ordner für die umbenannten Verknüpfungen anlegen
		var newLinkFolderName = "newLinksFolder"
		var newLinksFolder = new Folder (dok.filePath + "/" + newLinkFolderName);
		i = 0;
		while (newLinksFolder.exists) {
			newLinksFolder = new Folder (dok.filePath + "/" + newLinkFolderName + "_" + i++);
		}
		if (!newLinksFolder.create()) {
			alert ("Der Ordner f\u00fcr die neuen Bilder konnte nicht erstellt werden.");
			return;
		}
	}

	// Verknüpfungen durchgehen und ggf. neu verknüpfen
	var relinkCounter = 0;
	for (i = 0; i  < linkArray.length; i++) {
		var relinkObjects = linkArray[i];
		var newFile = null;		
		
		if (config.numberLinks) {
			var ziffernLaenge = config.newName.lastIndexOf ("#") - config.newName.indexOf ("#") + 1;
			var prefix = config.newName.substr(0, config.newName.indexOf ("#"));
			var suffix = config.newName.substr(config.newName.lastIndexOf ("#")+1);
			var ending = getFileNameObject (relinkObjects[0].newName).fileEnding;
			newFileName = prefix + pad(config.startNumber,ziffernLaenge) + suffix + ending;
			relinkObjects[0].newName = newFileName;
			config.startNumber++;
		}

		var newFile = undefined;
		if (config.copyFiles) {
			newFile = getNewFile(relinkObjects[0], newLinksFolder);
		}
		else {
			if (relinkObjects[0].newName == relinkObjects[0].link.name) continue; // die Datei muss nicht verändert werden!
			var newFile = new File(relinkObjects[0].link.filePath);
			if (!newFile.rename(relinkObjects[0].newName)) {
				alert ("Die Datei [" + newFile + "] konnte nicht umbenannt werden.\nVielleicht existiert schon eine Datei gleichen Namens?")
				continue;
			}
		}
		if (newFile /*&& newFile.name != relinkObjects[0].link.name -- Wir kopieren alles in den newLinks Folder*/) {
			for (var k = 0; k < relinkObjects.length; k++) {
				relinkObjects[k].link.relink (newFile);
				relinkCounter++;
			}				
		}
	}
	if (relinkCounter  > 0) {
		alert ("Es wurden [" + relinkCounter  + "] Verkn\u00fcpfungen bearbeitet!");
	} 
	else {
		alert ("Es wurde keine Verkn\u00fcpfungen umbenannt!");		
	}
}
/* Die Datei kopieren  */
function getNewFile(relinkObject, destFolder) {
	var file = new File(relinkObject.link.filePath);
	var newFile = new File(destFolder + "/" + relinkObject.newName); 
	var result = file.copy (newFile);
	if (result) {
		// System needs some time to copy large Files
		while (newFile.length != file.length) {
			$.sleep(10);
		}
		return newFile;
	} 
	else {
		return null;
	}	
}

/* Generiert den neuen Dateinamen */
function getNewName(fileName, config, rename) {
	var fileNameObject = getFileNameObject (fileName);
	if (rename) return fileNameObject.fileName.replace(/[^a-z\d.]/gi, config.replaeChar) + (((1+Math.random())*0x10000)|0).toString(16).substring(1) + fileNameObject.fileEnding;
	else return fileNameObject.fileName.replace(/[^a-z\d.]/gi, config.replaeChar) + fileNameObject.fileEnding;
}

/* Resolves Name and Ending */
function getFileNameObject (fileName) {
	var fileSplit = fileName.match(/^(.*?)(\.[a-z]{2,5})$/i);
	var name = "";
	var ending = "";
	if (fileSplit) {
		name = fileSplit[1];
		ending = fileSplit[2];
	}
	else {
		name = fileName;
	}
	return {fileName:name, fileEnding:ending}
}


/* Prüft ob der Link ein ausgetauscht werden kann*/ 
function isRelevantLink (_link) {
	// Copy&Paste "eingebette" Bilder haben keinen Link, Bei Modus Auswahl kann das vorkommen
	if (_link  == null ) return false;
//~ 	// Objekt gesperrt? 
//~ 	var frame = _link.parent.parent;
//~ 	if (frame.hasOwnProperty("locked") && ( frame.locked || frame.itemLayer.locked)) {
//~ 		return false;
//~ 	}
	// Embedded Grafiken 
	if (_link.status == LinkStatus.LINK_EMBEDDED || _link.status == LinkStatus.LINK_MISSING) {
		return false;
	}	
	return true;
}

/* Führende '0' hinzufügen */
function pad(number, length) {  
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }   
    return str;
}

/* Aufgaben ermitteln */
function getConfig() {
	// Default Config 
	var config = {
		copyFiles:true,
		numberLinks:false,
		startNumber:1,
		newName:"###",
		replaeChar:"_"
	}	
	// GUI 
	var win = new Window("dialog", 'Verkn\u00fcpfungen neu benennen...', [0,0,405,350]);
	with (win) {
		win.renameGroup = add( "panel", [10,10,400,108], "Dateien umbenennen oder kopieren");
		with (win.renameGroup) {
			win.renameGroup.rButChange = add("radiobutton", [8,17,377,32], 'Originaldateien umbenennen' );
			win.renameGroup.rButCopy = add("radiobutton", [8,39,377,54], 'Dateien in neuen Ordner kopieren' );						
			win.renameGroup.sTextHelp =  add( "statictext", [25,54,390,85], 'Es wird ein Ordner mit dem Namen [newLinksFolder] neben der InDesign-Datei erstellt.', {multiline: 'true', } );
		}		
		win.group = add( "panel", [10,114,400,315], "Namensbildung");
		with (win.group) {			
			win.group.rButRename = add("radiobutton", [8,17,377,37], 'Dateien umbenennen' );
			win.group.rButNumbering = add("radiobutton", [8,87,377,107], 'Dateien neu nummerieren' );			
			win.group.eTextErsatz = add( "edittext", [28,42,58,62], config.replaeChar );
			win.group.sTextErsatz = add( "statictext", [98,43,393,63+17], 'Alle Zeichen bis auf A-Z und 0-9 werden ersetzt. Tragen Sie hier ein Ersatzzeichen an.', {multiline: 'true', } );
			win.group.eTextNumberStart = add( "edittext", [28,92+17,58,112+17], config.startNumber );
			win.group.sTextumberStart = add( "statictext", [98,93+17,408,118+17], 'Nummerierung ab Zahl beginnen' );
			win.group.eTextSyntax = add( "edittext", [28,125+17,88,145+17], config.newName );
			win.group.sTextSyntax = add( "statictext", [98,126+17,393,217+17], 'Aufbau des neuen Dateinamens # steht f\u00fcr eine Zahl. Die Eingabe a##z f\u00fchrt zu den folgenden Dateinamen a01z.jpg, a02z.jpg, ...', {multiline: 'true', } );
		}
		win.butOk = add( "button", [190,320,295,345], config.copyFiles ? 'Kopieren' : 'Umbenennen', {name: 'ok', } );
		win.butCancel = add( "button", [300,320,400,345], 'Abbrechen', {name: 'cancel', } );
		// Init
		with (win.renameGroup) {
			rButChange.value = !config.copyFiles
			rButCopy.value = config.copyFiles;
		}
		
		with (win.group) {
			rButRename.value = !config.numberLinks;
			rButNumbering.value = config.numberLinks;
			eTextErsatz.enabled = !config.numberLinks;
			sTextErsatz.enabled = !config.numberLinks;
			eTextNumberStart.enabled = config.numberLinks;
			sTextumberStart.enabled = config.numberLinks;
			eTextSyntax.enabled = config.numberLinks;
			sTextSyntax .enabled = config.numberLinks;
		}
	}
	win.renameGroup.rButChange.onClick = function() {
		win.butOk.text = "Umbenennen";
		config.copyFiles = win.renameGroup.rButCopy.value;
	}
	win.renameGroup.rButCopy.onClick = function() {
		win.butOk.text = "Kopieren";
		config.copyFiles = win.renameGroup.rButCopy.value;
	}


	// Sonderzeichen aus Links entfernen
	win.group.rButRename.onClick = function() {
		with (win.group) {
			eTextErsatz.enabled = true;
			sTextErsatz.enabled = true;
			eTextNumberStart.enabled = false;
			sTextumberStart.enabled = false;
			eTextSyntax.enabled = false;
			sTextSyntax .enabled = false;
		}
		config.numberLinks = win.group.rButNumbering.value;
	}
	// Links neu nummerieren
	win.group.rButNumbering.onClick = function() {
		with (win.group) {
			eTextErsatz.enabled = false;
			sTextErsatz.enabled = false;
			eTextNumberStart.enabled = true;
			sTextumberStart.enabled = true;
			eTextSyntax.enabled = true;
			sTextSyntax .enabled = true;
		}
		config.numberLinks = win.group.rButNumbering.value;
	}
	win.group.eTextErsatz.onChange = function() {
		config.replaeChar = win.group.eTextErsatz.text;
	}
	win.group.eTextNumberStart.onChange = function() {
		if (isNaN ( win.group.eTextNumberStart.text)) {
			alert ("Bitte geben Sie eine Zahl ein");
			config.startNumber = 1;
			win.group.eTextNumberStart.active = true;
			win.butOk.enabled = false;
		}
		else {
			config.startNumber = win.group.eTextNumberStart.text *1;
			win.butOk.enabled = true;
		}
	}
	win.group.eTextSyntax.onChange = function() {
		config.newName = win.group.eTextSyntax.text;
	}
	win.butOk.onClick = function() {
		win.close(1);
	}
	win.butCancel.onClick = function() {
		win.close(2);
	}
	win.center();
	if (win.show() == 1) {
		return config;
	}
	else {
		return null;
	}
}