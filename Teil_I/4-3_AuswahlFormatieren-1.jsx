#target InDesign
var _auswahl = app.selection[0]
_auswahl.strokeWeight = 4;
_auswahl.strokeType = "Striche";
_auswahl.strokeColor = "Grün";
_auswahl.fillColor = "Grau";
_auswahl.paragraphs.everyItem().appliedParagraphStyle = "infokasten_text";
_auswahl.paragraphs.firstItem().appliedParagraphStyle = "infokasten_u1";
_auswahl.fit (FitOptions.FRAME_TO_CONTENT);

