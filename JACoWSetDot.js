/* JACoW SetDot v20140612
   by Ivan Andrian (C) ivan.andrian@elettra.eu 2013-14
   Sets the file(paperID) name, editor's name, timestamp 
   and a red/yellow/green dot on the top right corner of the
   first page of the document (in JACoW page size)
   See http://www.JACoW.org for more information
   
   History:
   v20140612   - Added some additional stripping to the filename to be used as PaperCode
   v20130522.1 - First production release, used in IPAC13
 */

var Version = "v20140612";
 
// see http://partners.adobe.com/public/developer/en/acrobat/sdk/AcroJS.pdf for JS Reference
// and http://acrobatusers.com/tutorials/how-save-pdf-acrobat-javascript for save as etc.

app.addMenuItem({ cName: "----------  " + Version + "  ---------", cParent: "File", nPos: 1, cExec: "{}"});
app.addMenuItem({ cName: "Save as PS", cUser: "Save as PS", cParent: "File", nPos: 1, cExec: "PrintPS()"});
app.addMenuItem({ cName: "RED dot", cUser: "RED dot", cParent: "File", nPos: 1, cExec: "SetDot('red')"});
app.addMenuItem({ cName: "YELLOW dot", cUser: "YELLOW dot", cParent: "File", nPos: 1, cExec: "SetDot('yellow')"});
app.addMenuItem({ cName: "GREEN dot", cUser: "GREEN dot", cParent: "File", nPos: 1, cExec: "SetDot('green')"});
app.addMenuItem({ cName: "----------JACoW utils ---------", cParent: "File", nPos: 1, cExec: "{}"});


function SetDot(_arg) {
	var author = identity.name;
	var re = /.*\/|\.pdf$/ig;
	var FileNM = this.path.replace(re,"");
	var Path = this.path;
	var AcDate = new Date();
	var AcDateFormat = "yyyy-mmm-dd HH:MM";
	var aRect = this.getPageBox("Crop",0);
	var TotWidth = aRect[2] - aRect[0];
	var dotSize =30;
	var x =545; 
	var y =750;
	var dcoords =[x, y, x +dotSize, y +dotSize];
	var qcoords =[x +dotSize/4-2, y-dotSize/2 -16, x +(3/4)*dotSize+3, y -11];
	var dtype;
	var QAarea = false;
	
	// create the dot
	var dot = this.addAnnot(
		{
		page: 0,
		author: author,
		name: "JACoWdot",
		popupOpen: false,
		rect: dcoords,
		});
		
	switch (_arg) {
		case 'red':
			dot.type = "Square";
			dot.strokeColor =color.red;
			dot.fillColor =color.red;
			break;
		case 'yellow':
			dot.type = "Circle";
			dcolor =color.yellow;
			dot.strokeColor =['RGB',1,.88,0];
			dot.fillColor =['RGB',1,.88,0];
			QAarea= true;
			break;
		case 'green':
			dot.type = "Polygon";
			dot.vertices = [[x, y], [x, y +dotSize], [x +dotSize, y +dotSize/2]];
			dot.strokeColor =color.green;
			dot.fillColor =color.green;
			QAarea= true;
			break;
	}
	
	if (QAarea) {
		// create the QA square for future checkmark
		// also for yellow since they can become green w/o printing
		var qdot = this.addAnnot(
			{
			page: 0,
			author: author,
			name: "JACoWdot",
			popupOpen: false,
			type: "Square",
			rect: qcoords,
			strokeColor: color.black,
			fillColor: color.transparent
			});
		var fd3 =this.addField("QAd", "text", 0, 
			[ x +dotSize/4 -7, y-3/2*dotSize-4, x + dotSize, y-dotSize+6]);
		fd3.value="QA";
		fd3.textSize =8; 
		fd3.readonly =true;
		fd3.alignment ="center";
	}
		
	// file name
	x =60; 
	y =780;
	var fd =this.addField("PaperCode", "text", 0, [ x, y, TotWidth -x, y -15 ]);
	fd.value =FileNM ;
	fd.textSize =14; 
	fd.readonly =true;
	fd.alignment ="right";
	
	// date
	x =60; 
	y =765;
	var fd2 =this.addField("AuthorDate", "text", 0, [ x, y, TotWidth -x, y -15 ]);
	fd2.value =author + "  " + util.printd(AcDateFormat, AcDate);
	fd2.textSize =8; 
	fd2.readonly =true;
	fd2.alignment ="right";
		
	app.execMenuItem("Print");
	
	this.removeField("PaperCode");
	this.removeField("AuthorDate");
	if (QAarea) {
		qdot.destroy();
		this.removeField("QAd");
	}
	dot.destroy();

		
		
		/*
		var fdd = this.addAnnot(
			{
				type: "FreeText",
				page: 0,
				rect: [60,740,535,780],
				author: author,
				contents: author + "\n" + util.printd(AcDateFormat, AcDate),
				name: "JACoWauthDate",
				textSize: 8,
				readonly : true,
				popupOpen: false,
				alignment: "right", // right
				borderEffectStyle: "",
				strokeColor: color.transparent, 
				fillColor: color.transparent,
				color: color.black
			}
		);
		fdd.alignment="right";
		*/
		

}



function PrintPS(_arg) {
	var re1 = /.*\/|\_AUTHOR.*\.pdf|\.pdf$/ig;
	var re2 = /\.PDF\.AUTODISTILL/ig;
	var PathArr = this.path.split("/");
	PathArr.pop();
	PathArr.push(this.path.replace(re1,"").replace(re2,"") +".ps");
	this.saveAs(PathArr.join("/"), "com.adobe.acrobat.ps");
}