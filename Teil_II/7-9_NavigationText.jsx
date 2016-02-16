var _textRahmenSeite1 = app.activeDocument.textFrames[0];
var _textAbschnitt = _textRahmenSeite1.parentStory;
var _letztesWort = _textAbschnitt.words[-1];
var _letzterTextRahmen = _letztesWort.parentTextFrames[0];
_letzterTextRahmen.select();