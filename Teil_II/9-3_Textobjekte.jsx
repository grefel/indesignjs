#target InDesign
var _tf = app.activeDocument.pages[0].textFrames.add()
_tf.geometricBounds = [10,10,100,200];
_textAbschnitt = _tf.parentStory;
_textAbschnitt.contents = "Vorsicht bei Textänderungen.";
var _anfang = _textAbschnitt.characters.itemByRange(0,11);
var _ende = _textAbschnitt.characters.itemByRange(12, -1);
_anfang.contents = "Passen Sie auf den ";
_ende.contents = "Index auf.";
alert(_anfang.contents);
alert(_ende.contents); 