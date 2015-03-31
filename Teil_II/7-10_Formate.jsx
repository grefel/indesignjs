var _dok = app.activeDocument;
var _ta = _dok.stories[0];
var _pStyle = _dok.paragraphStyles.itemByName("u1");
_ta.paragraphs[0].appliedParagraphStyle = _pStyle;
_pStyle = _dok.paragraphStyles.itemByName("g");
_ta.paragraphs.itemByRange(1,10).applyParagraphStyle(_pStyle, false);
var _cStyle = _dok.characterStyles.itemByName("spitzmarke");
_ta.paragraphs[1].words[0].appliedCharacterStyle = _cStyle;