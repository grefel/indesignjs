#targetengine "session2"

main();

function myafterActivate(myEvent){alert ("afterActivate");}
function myafterClose(myEvent){alert ("afterClose");}
function myafterContextChanged(myEvent){alert ("afterContextChanged");}
function myafterDelete(myEvent){alert ("afterDelete");}
function myafterEmbed(myEvent){alert ("afterEmbed");}
function myafterInvoke(myEvent){alert ("afterInvoke");}
function myafterLinksChanged(myEvent){alert ("afterLinksChanged");}
function myafterMove(myEvent){alert ("afterMove");}
function myafterNew(myEvent){alert ("afterNew");}
function myafterOpen(myEvent){alert ("afterOpen");}
function myafterPlace(myEvent){alert ("afterPlace");}
function myafterQuit(myEvent){alert ("afterQuit");}
//~ function myafterSelectionAttributeChanged(myEvent){alert ("afterSelectionAttributeChanged");}
//~ function myafterSelectionChanged(myEvent){alert ("afterSelectionChanged");}
function myafterUnembed(myEvent){alert ("afterUnembed");}
function myafterUpdate(myEvent){alert ("afterUpdate");}
function mybeforeClose(myEvent){alert ("beforeClose");}
function mybeforeDeactivate(myEvent){alert ("beforeDeactivate");}
function mybeforeDelete(myEvent){alert ("beforeDelete");}
function mybeforeDisplay(myEvent){alert ("beforeDisplay");}
function mybeforeEmbed(myEvent){alert ("beforeEmbed");}
function mybeforeInvoke(myEvent){alert ("beforeInvoke");}
function mybeforeMove(myEvent){alert ("beforeMove");}
function mybeforePlace(myEvent){alert ("beforePlace");}
function mybeforeQuit(myEvent){alert ("beforeQuit");}
function mybeforeUnembed(myEvent){alert ("beforeUnembed");}
function mybeforeUpdate(myEvent){alert ("beforeUpdate");}
function myonInvoke(myEvent){alert ("onInvoke");}


function main() {
app.activeDocument.addEventListener("afterActivate", myafterActivate);
app.activeDocument.addEventListener("afterClose", myafterClose);
app.activeDocument.addEventListener("afterContextChanged", myafterContextChanged);
app.activeDocument.addEventListener("afterDelete", myafterDelete);
app.activeDocument.addEventListener("afterEmbed", myafterEmbed);
app.activeDocument.addEventListener("afterInvoke", myafterInvoke);
app.activeDocument.addEventListener("afterLinksChanged", myafterLinksChanged);
app.activeDocument.addEventListener("afterMove", myafterMove);
app.activeDocument.addEventListener("afterNew", myafterNew);
app.activeDocument.addEventListener("afterOpen", myafterOpen);
app.activeDocument.addEventListener("afterPlace", myafterPlace);
app.activeDocument.addEventListener("afterQuit", myafterQuit);
//~ app.activeDocument.addEventListener("afterSelectionAttributeChanged", myafterSelectionAttributeChanged);
//~ app.activeDocument.addEventListener("afterSelectionChanged", myafterSelectionChanged);
app.activeDocument.addEventListener("afterUnembed", myafterUnembed);
app.activeDocument.addEventListener("afterUpdate", myafterUpdate);
app.activeDocument.addEventListener("beforeClose", mybeforeClose);
app.activeDocument.addEventListener("beforeDeactivate", mybeforeDeactivate);
app.activeDocument.addEventListener("beforeDelete", mybeforeDelete);
app.activeDocument.addEventListener("beforeDisplay", mybeforeDisplay);
app.activeDocument.addEventListener("beforeEmbed", mybeforeEmbed);
app.activeDocument.addEventListener("beforeInvoke", mybeforeInvoke);
app.activeDocument.addEventListener("beforeMove", mybeforeMove);
app.activeDocument.addEventListener("beforePlace", mybeforePlace);
app.activeDocument.addEventListener("beforeQuit", mybeforeQuit);
app.activeDocument.addEventListener("beforeUnembed", mybeforeUnembed);
app.activeDocument.addEventListener("beforeUpdate", mybeforeUpdate);
app.activeDocument.addEventListener("onInvoke", myonInvoke);
}