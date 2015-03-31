#target InDesign 
var _tf = app.activeDocument.pages[0].textFrames[0];
_tf.words[0].move(LocationOptions.AFTER, _tf.words[2]);
