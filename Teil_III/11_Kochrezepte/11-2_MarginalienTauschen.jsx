if (app.documents.length > 0) {
	app.doScript(verankerteObjekteTauschen, ScriptLanguage.JAVASCRIPT , [], UndoModes.ENTIRE_SCRIPT, "Marginalien tauschen"); 		
} else {
		alert ("Es ist kein Dokument geöffnet!");
}

/** Verankerte Objekte je nach Lage der Spalte austauschen */
function verankerteObjekteTauschen() {
	// Alle verankerten Textrahmen alle Story in den Array _allTF packen 
	// Nach verankerten Textrahmen suchen (textFrames ungleich textContainers!)
	_allTF = app.activeDocument.stories.everyItem().textFrames.everyItem().getElements()
	for (var k = 0; k < _allTF.length; k++) {
		var _anchoredTF = _allTF[k];
		/** Voraussetzung: Objektstil "marginalie" muss angewendet sein.
			Wir gehen von zwei Spalten pro TextFrame aus.. */
		if (_anchoredTF.appliedObjectStyle.name === "marginalie") {
			var _textCol = _anchoredTF.parent.textColumns[0];
			var _textFrames = _textCol.parentTextFrames[0];
			// Erste Spalte des TextFrames ist die linke Seite 
			if (_textFrames.textColumns[0] === _textCol) {
				_anchoredTF.anchoredObjectSettings.anchorPoint = AnchorPoint.TOP_LEFT_ANCHOR;
				_anchoredTF.anchoredObjectSettings.horizontalAlignment = HorizontalAlignment.LEFT_ALIGN;
		//		_anchoredTF.parent.paragraphs[0].justification = Justification.LEFT_ALIGN;
			} 
			// Zweite Spalte des TextFrames ist die rechte Seite 
			if (_textFrames.textColumns[1] === _textCol) {
				_anchoredTF.anchoredObjectSettings.anchorPoint = AnchorPoint.TOP_RIGHT_ANCHOR;
				_anchoredTF.anchoredObjectSettings.horizontalAlignment = HorizontalAlignment.RIGHT_ALIGN;
			//	_anchoredTF.parent.paragraphs[0].justification = Justification.RIGHT_ALIGN;
			} 
		}
	}
}