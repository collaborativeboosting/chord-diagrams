//var margin = {left:80, top:60, right:120, bottom:90},
var margin = {left:80, top:30, right:0, bottom:90},
	width = Math.max( Math.min(window.innerWidth, 1100) - margin.left - margin.right - 20, 400),
    height = Math.max( Math.min(window.innerHeight - 250, 900) - margin.top - margin.bottom - 20, 400),
    innerRadius = Math.min(width * 0.33, height * .45),
    outerRadius = innerRadius * 1.05;
	
//Recalculate the width and height now that we know the radius
width = outerRadius * 2 + margin.right + margin.left;
height = outerRadius * 2 + margin.top + margin.bottom;
	
//Reset the overall font size
var newFontSize = Math.min(70, Math.max(40, innerRadius * 62.5 / 250));
d3.select("html").style("font-size", newFontSize + "%");

////////////////////////////////////////////////////////////
////////////////// Set-up Chord parameters /////////////////
////////////////////////////////////////////////////////////
	
var pullOutSize = 20 + 30/135 * innerRadius;
var numFormat = d3.format(",.2f");
var defaultOpacity = 0.85,
	fadeOpacity = 0.075;
						
/*var loom = loom()
    .padAngle(0.05)
	//.sortSubgroups(sortAlpha)
	//.heightInner(28)
	.emptyPerc(0.2)
	.widthOffsetInner(30)
	//.widthOffsetInner(function(d) { return 6 * d.length; })
	.value(function(d) { return d.words; })
	.inner(function(d) { return d.character; })
	.outer(function(d) { return d.location; });*/
	
var loom = loom()
    .padAngle(0.06)
	//.sortSubgroups(sortAlpha)
	//.heightInner(28)
	.emptyPerc(0.05)
	.widthOffsetInner(45)
	//.widthOffsetInner(function(d) { return 6 * d.length; })
	.value(function(d) { return d.words; })
	.inner(function(d) { return d.character; })
	.outer(function(d) { return d.location; });

var arc = d3.arc()
    .innerRadius(innerRadius*1.01)
    .outerRadius(outerRadius);

var string = string()
    .radius(innerRadius)
	.pullout(pullOutSize);

////////////////////////////////////////////////////////////
//////////////////// Character notes ///////////////////////
////////////////////////////////////////////////////////////
	
var characterNotes = [];
characterNotes["Gandalf"] = "Speaking almost twice as many words as the second most abundant speaker, Gandalf is taking up a large portion of dialogue in almost every location he's in, but stays rather quiet in Mordor";
characterNotes["Sam"] = "An unexpected runner up to having spoken the most words, Sam flourishes after the battle at Amon Hen, taking up a considerable portion of the words said in both Mordor and Gondor";
characterNotes["Aragorn"] = "Although eventually being crowned in Minas Tirith, Gondor, Aragorn is by far most talkative in that other human region, Rohan, fighting a battle at Helm's Deep and convincing an army of dead";
characterNotes["Frodo"] = "Frodo seems most comfortable speaking in the Shire, (mostly) when still an innocent youth, but he feels the burden of the ring increasingly towards the end and leaves the talking to his best friend Sam";
characterNotes["Gimli"] = "Gimli is a quiet character at practically all locations until he reaches Rohan, where he speaks almost half of all his lines";
characterNotes["Pippin"] = "Like Merry, Pippin is also seen saying something at all locations, but his presence is mostly felt when he sings his song in Minas Tirith, serving the steward of Gondor, Denethor";
characterNotes["Merry"] = "Merry manages to say an average sentence worth of words at all locations, but is most active during his time with Treebeard in Fangorn forest and bonding with Eowyn in Rohan";
characterNotes["Boromir"] = "Boromir speaks his finest lines during the march up Caradhras in the Misty Mountains and right before the Uruk-hai battle at Amon Hen, Parth Galen, taking up a large portion of the total number of words spoken at those locations";
characterNotes["Legolas"] = "Although a very memorable presence throughout the movies, Legolas speaks even less in 3 movies than Boromir, who is alive in only the first movie";

////////////////////////////////////////////////////////////
/////////////////// Helper functions ///////////////////////
////////////////////////////////////////////////////////////

var isValueFor398wordsSet = 0;

function convertValue(value, outername) {
	value = parseInt(value.replace(",",""));
	
	if (outername == "SB" && value == 469)
		return "39.13";
	if (outername == "SB " && value == 654)
		return "54.55";
	if (outername == "SB  " && value == 112)
		return "9.38";
	if (outername == "SB   " && value == 400)
		return "33.33";
	if (outername == "SB    " && value == 400)
		return "33.33";
	if (outername == "SB     " && value == 343)
		return "28.57";
	if (outername == "SB      " && value == 899)
		return "75.00";
	if (outername == "SB       " && value == 41)
		return "3.45";
	if (outername == "SB        " && value == 799)
		return "66.67";
	
	if (outername == "GB" && value == 266)
		return "22.22";
	if (outername == "GB " && value == 654)
		return "54.55";
	if (outername == "GB  " && value == 259)
		return "21.62";
	if (outername == "GB   " && value == 480)
		return "40.00";
	if (outername == "GB    " && value == 300)
		return "25.00";
	if (outername == "GB     " && value == 277)
		return "23.08";
	if (outername == "GB      " && value == 1155)
		return "96.30";
	if (outername == "GB       " && value == 150)
		return "12.50";
	if (outername == "GB        " && value == 599)
		return "50.00";
	
	if (outername == "SUCC" && value == 1011)
		return "50";
	if (outername == "SUCC " && value == 600)
		return "25";
	if (outername == "SUCC  " && value == 2022)
		return "100";
	if (outername == "SUCC   " && value == 1011)
		return "50";
	if (outername == "SUCC    " && value == 400)
		return "15";
	if (outername == "SUCC     " && value == 250)
		return "5";
	if (outername == "SUCC      " && value == 80)
		return "2";
	if (outername == "SUCC       " && value == 2426)
		return "120";
	if (outername == "SUCC        " && value == 1678)
		return "83";

	
	return 0;
}

function getFullNameOfDataset(shortName) {
	/*if (shortName == "Australian")
		return "Australian Credit";
	if (shortName == "Breast Cancer")
		return "Breast Cancer Wisconsin (Original) Dataset";
	if (shortName == "Diabetes")
		return "Pima Indians Diabetes";
	if (shortName == "Heart")
		return "Statlog (Heart) Dataset";
	if (shortName == "Ionosphere")
		return "Ionosphere Dataset";
	if (shortName == "Liver Disorders")
		return "Liver Disorders";
	if (shortName == "Lung Cancer")
		return "Lung Cancer";
	if (shortName == "Mammographic")
		return "Mammographic Mass Dataset";
	if (shortName == "Vote")
		return "Congressional Voting Records";*/
	
	if (shortName.length > 0)
		return shortName;
	
	return "";
}

function drawMarkingArc(arcs, indexOfSubArc, markingArcEndAngle, markingArcColor, markingArcIndex, markingArcText) {
	var myPullOutSize = -1;
	var test = arcs.append("path")
		.attr("class", "markingArc")
		.style("fill", function(d, i) { if (i == indexOfSubArc) myPullOutSize = d.pullOutSize; return ""; });
	
	var markingArcInnerRadius = innerRadius*1.07;
    var markingArcOuterRadius = markingArcInnerRadius * 1.1; //1.1
	
	var markingArc = d3.arc()
	.innerRadius(markingArcInnerRadius*1.01)
	.outerRadius(markingArcOuterRadius)
	.endAngle(markingArcEndAngle)
	.cornerRadius(8);
	
	var markingArc = arcs.append("path")
		.attr("id", "markingArc" + markingArcIndex)
		.attr("class", "markingArc")
		.style("fill", function(d) { return markingArcColor; })
		.attr("d", markingArc)
		.attr("transform", function(d, i) { //Pull the two slices apart
			if (i == indexOfSubArc)
				return "translate(" + myPullOutSize + ',' + 0 + ")";
			else
				return "translate(" + 0 + ',' + 1000 + ")";
		 })
		 .style("opacity", 0.5);
		 
	var i = 0;
	$('path[id="markingArc' + markingArcIndex + '"]').each(function() {
		if (i != indexOfSubArc)
			$(this).remove();
		i++;
	});
	
	
	
	arcs.append("text")
	.attr("id", "markingArcText" + markingArcIndex)
	.attr("x", 6)   //Move the text from the start angle of the arc
	.attr("dy", function(d, i) { //Pull the two slices apart
			if (i == 0)
				return 14; //Move the text down
			else
				return -1000;
	})
	.append("textPath") //append a textPath to the text element
	.attr("xlink:href", "#markingArc" + markingArcIndex) //place the ID of the path here
	.style("text-anchor","middle") //place the text halfway on the arc
	.attr("startOffset", "25%")
	.style("font-size", "11pt")
	.text(markingArcText);
	
	i = 0;
	$('path[id="markingArcText' + markingArcIndex + '"]').each(function() {
		if (i != indexOfSubArc)
			$(this).remove();
		i++;
	});
}

function drawMarkingArcs(arcs) {
	drawMarkingArc(arcs, 0, 1.573, "#B7695C", "0", "Subbagging");
	drawMarkingArc(arcs, 9, 3.15, "#FFB85F", "1", "Gentle Boost");
	drawMarkingArc(arcs, 18, 6.17, "#00AAA0", "2", "Number of successful collaborations"); // 00628B
}

////////////////////////////////////////////////////////////
////////////////////// Create SVG //////////////////////////
////////////////////////////////////////////////////////////
			
var svg = d3.select("#lotr-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

////////////////////////////////////////////////////////////
///////////////////// Read in data /////////////////////////
////////////////////////////////////////////////////////////
			
d3.json('chord-wclb/lotr_words_location_wclb.json', function (error, dataAgg) {

	////////////////////////////////////////////////////////////
	///////////////////// Prepare the data /////////////////////
	////////////////////////////////////////////////////////////
	
	//Sort the inner characters based on the total number of words spoken
	
	//Find the total number of words per character
	var dataChar = d3.nest()
		.key(function(d) { return d.character; })
		.rollup(function(leaves) { return d3.sum(leaves, function(d) { return d.words; }); })
		.entries(dataAgg);
		//.sort(function(a, b){ return d3.descending(a.value, b.value); });				
	//Unflatten the result
	var characterOrder = dataChar.map(function(d) { return d.key; });
	//Sort the characters on a specific order
	function sortCharacter(a, b) {
	  	return characterOrder.indexOf(a) - characterOrder.indexOf(b);
	}//sortCharacter
	
	//Set more loom functions
	loom
		.sortSubgroups(sortCharacter)
		.heightInner(innerRadius*0.75/characterOrder.length);
	
	////////////////////////////////////////////////////////////
	///////////////////////// Colors ///////////////////////////
	////////////////////////////////////////////////////////////
					
	//Color for the unique locations
	var locations = ["Bree", "Emyn Muil", "Fangorn", "Gondor",  "Isengard", "Lothlorien", "Misty Mountains", "Mordor",  "Moria",   "Parth Galen", "Rivendell", "Rohan",   "The Shire"];
	var colors = ["#5a3511", "#47635f",   "#223e15", "#C6CAC9", "#0d1e25",  "#53821a",    "#4387AA",         "#770000", "#373F41", "#602317",     "#8D9413",   "#c17924", "#3C7E16"];
	var color = d3.scaleOrdinal()
    	.domain(locations)
    	.range(colors);
	
	//Create a group that already holds the data
	var g = svg.append("g")
	    .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")")
		.datum(loom(dataAgg));	

	////////////////////////////////////////////////////////////
	///////////////////// Set-up title /////////////////////////
	////////////////////////////////////////////////////////////

	var titles = g.append("g")
		.attr("class", "texts")
		.style("opacity", 0);
		
	titles.append("text")
		.attr("class", "name-title")
		.attr("x", 0)
		.attr("y", -innerRadius*5/6);
		
	titles.append("text")
		.attr("class", "value-title")
		.attr("x", 0)
		.attr("y", -innerRadius*5/6 + 25);
	
	//The character pieces	
	titles.append("text")
		.attr("class", "character-note")
		.attr("x", 0)
		.attr("y", innerRadius/2)
		.attr("dy", "0.35em");
					
	////////////////////////////////////////////////////////////
	////////////////////// Draw outer arcs /////////////////////
	////////////////////////////////////////////////////////////

	var arcs = g.append("g")
	    .attr("class", "arcs")
	  .selectAll("g")
	    .data(function(s) { 
			return s.groups; 
		})
	  .enter().append("g")
		.attr("class", "arc-wrapper")
	  	.each(function(d) { 
			d.pullOutSize = (pullOutSize * ( d.startAngle > Math.PI + 1e-2 ? -1 : 1)) 
		})
 	 	.on("mouseover", function(d) {
			
			//Hide all other arcs	
			d3.selectAll(".arc-wrapper")
		      	.transition()
				.style("opacity", function(s) { return s.outername === d.outername ? 1 : 0.5; });
			
			//Hide all other strings
		    d3.selectAll(".string")
		      	.transition()
		        .style("opacity", function(s) { return s.outer.outername === d.outername ? 1 : fadeOpacity; });
				
			//Find the data for the strings of the hovered over location
			var locationData = loom(dataAgg).filter(function(s) { return s.outer.outername === d.outername; });
			//Hide the characters who haven't said a word
			d3.selectAll(".inner-label")
		      	.transition()
		        .style("opacity", function(s) {
					//Find out how many words the character said at the hovered over location
					var char = locationData.filter(function(c) { return c.outer.innername === s.name; });
					return char.length === 0 ? 0.1 : 1;
				});
 	 	})
     	.on("mouseout", function(d) {
			
			//Sjow all arc labels
			d3.selectAll(".arc-wrapper")
		      	.transition()
				.style("opacity", 1);
			
			//Show all strings again
		    d3.selectAll(".string")
		      	.transition()
		        .style("opacity", defaultOpacity);
				
			//Show all characters again
			d3.selectAll(".inner-label")
		      	.transition()
		        .style("opacity", 1);
 	 	});

	var outerArcs = arcs.append("path")
		.attr("class", "arc")
	    .style("fill", function(d) { return color(d.outername); })
	    .attr("d", arc)
		.attr("transform", function(d, i) { //Pull the two slices apart
		  	return "translate(" + d.pullOutSize + ',' + 0 + ")";
		 });
		 					
	////////////////////////////////////////////////////////////
	//////////////////// Draw outer labels /////////////////////
	////////////////////////////////////////////////////////////

	//The text needs to be rotated with the offset in the clockwise direction
	var outerLabels = arcs.append("g")
		.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2); })
		.attr("class", "outer-labels")
		.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
		.attr("transform", function(d,i) { 
			var c = arc.centroid(d);
			return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
			+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
			+ "translate(" + 26 + ",0)"
			+ (d.angle > Math.PI ? "rotate(180)" : "")
		})
		
	//The outer name
	outerLabels.append("text")
		.attr("class", "outer-label")
		.attr("dy", ".35em")
		.text(function(d,i){ return ""; });
		
	//The value below it
	outerLabels.append("text")
		.attr("class", "outer-label-value")
		.attr("dy", ".35em")
		.attr("style","font-size: 12pt")
		.text(function(d,i){
			var currVal = convertValue(numFormat(d.value),d.outername);
			if (i < 18)
				currVal = currVal + " %";
			
			return currVal;
		});

	////////////////////////////////////////////////////////////
	////////////////// Draw inner strings //////////////////////
	////////////////////////////////////////////////////////////
	
	var strings = g.append("g")
	    .attr("class", "stringWrapper")
		.style("isolation", "isolate")
	  .selectAll("path")
	    .data(function(strings) { 
			return strings; 
		})
	  .enter().append("path")
		.attr("class", "string")
		.style("mix-blend-mode", "multiply")
	    .attr("d", string)
	    .style("fill", function(d) { return d3.rgb( color(d.outer.outername) ).brighter(0.2) ; })
		.style("opacity", defaultOpacity);
		
	////////////////////////////////////////////////////////////
	//////////////////// Draw inner labels /////////////////////
	////////////////////////////////////////////////////////////
			
	//The text also needs to be displaced in the horizontal directions
	//And also rotated with the offset in the clockwise direction
	var innerLabels = g.append("g")
		.attr("class","inner-labels")
	  .selectAll("text")
	    .data(function(s) { 
			return s.innergroups; 
		})
	  .enter().append("text")
		.attr("class", "inner-label")
		.attr("x", function(d,i) { return d.x; })
		.attr("y", function(d,i) { return d.y; })
		.style("text-anchor", "middle")
		.attr("dy", ".35em")
	    .text(function(d,i) { return d.name; })
 	 	.on("mouseover", function(d) {
			
			//Show all the strings of the highlighted character and hide all else
		    d3.selectAll(".string")
		      	.transition()
		        .style("opacity", function(s) {
					return s.outer.innername !== d.name ? fadeOpacity : 1;
				});
				
			//Update the word count of the outer labels
			var characterData = loom(dataAgg).filter(function(s) { return s.outer.innername === d.name; });
			d3.selectAll(".outer-label-value")
				.text(function(s,i){
					//Find which characterData is the correct one based on location
					var loc = characterData.filter(function(c) { return c.outer.outername === s.outername; });
					
					//if(loc.length === 0) {
					//	var value = 0;
					//} else {
					//var value = loc[0].outer.value;
					//}
					
					//return convertValue(numFormat(value),s.outername) + (value === 1 ? " %" : " %"); 
					
					var currVal = convertValue(numFormat(s.value),s.outername);
					if (i < 18)
						currVal = currVal + (s.value === 1 ? " %" : " %");
					
					return currVal;					
				});
			
			// Hide the arc where the character hasn't said a thing
			d3.selectAll(".outer-label-value")
		      	.transition()
		        .style("opacity", function(s) {
					//Find which characterData is the correct one based on location
					var loc = characterData.filter(function(c) { return c.outer.outername === s.outername; });
					return loc.length === 0 ? 0.1 : 1;
				});
				
			// Hide arc tops
			d3.selectAll(".arc")
		      	.transition()
				.style("opacity", 0.1);
					
			//Update the title to show the total word count of the character
			d3.selectAll(".texts")
				.transition()
				.style("opacity", 1);
			d3.select(".name-title")
				.text("W-CLB");
			d3.select(".value-title")
				.text(function() {
					var words = dataChar.filter(function(s) { return s.key === d.name; });
					//return numFormat(words[0].value);
					return getFullNameOfDataset(d.name);
				});
				
			//Show the character note
			d3.selectAll(".character-note")
				.text(characterNotes[d.name])
				.call(wrap, 2.25*pullOutSize);

			// Show arc tops again
			var datasetNames = [];
			$('text[class="inner-label"]').each(function() {
				datasetNames.push($(this).html());
			});
			
			d3.selectAll(".arc")
		      	.transition()
				.style("opacity", function(s,i) {
					if (datasetNames.indexOf(d.name) == i || datasetNames.indexOf(d.name) + 9 == i || datasetNames.indexOf(d.name) + 18 == i)
						return 1;
					
					return 0;
				});
				
			// Show the subtitle again
			d3.select(".value-title")
				.transition()
				.style("opacity", 1);
				
		})
     	.on("mouseout", function(d) {
			
			//Put the string opacity back to normal
		    d3.selectAll(".string")
		      	.transition()
				.style("opacity", defaultOpacity);
				
			//Return the word count to what it was
			d3.selectAll(".outer-label-value")	
				.text(function(s,i){
					var currVal = convertValue(numFormat(s.value),s.outername);
					if (i < 18)
						currVal = currVal + " %";
					
					return currVal;
				});
				
			//Show all arcs again
			d3.selectAll(".arc-wrapper")
		      	.transition()
		        .style("opacity", 1);
			
			//Hide the title
			/*d3.selectAll(".texts")
				.transition()
				.style("opacity", 0);*/
				
			// Show the arc where the character hasn't said a thing
			d3.selectAll(".outer-label-value")
		      	.transition()
		        .style("opacity", 1);
				
			// Show arc tops again
			d3.selectAll(".arc")
		      	.transition()
				.style("opacity", 1);
				
			// Hide the subtitle
			d3.select(".value-title")
				.transition()
				.style("opacity", 0);
			
		});
	  		
			
		////////////////////////////////////////////////////////////
		//////////////////// Draw marking arcs /////////////////////
		////////////////////////////////////////////////////////////
		
		drawMarkingArcs(arcs);

		//$('text[class="value-title"]').remove();
		$('text[class="name-title"]').html("W-CLB").css("font-size", "25").css("left", "1000px").parent().css("opacity", 1);
		
		//for (var i = 18; i <= 26; i++)
			//$($('text[class="outer-label-value"]')[i]).html( $($('text[class="outer-label-value"]')[i]).html().replace(" %","") );
		
		// Additional code (by Martin)
		$($('g[class="outer-labels"]')[17]).attr("transform","translate(55.82844737356712,185.35306349959504)rotate(88.289280104012)translate(34,-19)");
		
		$('g[class="outer-labels"]').each(function() {
			var transformTokens = $(this).attr("transform").split("translate(");
			var oldTranslateValue = parseInt(transformTokens[transformTokens.length - 1].split(",")[0]);
			var newTranslateValue = oldTranslateValue + 6;
			$(this).attr("transform", 
				$(this).attr("transform").replace("translate(" + oldTranslateValue + ",0)", "translate(" + newTranslateValue + ",0)")
			);
		});
		
});//d3.csv

////////////////////////////////////////////////////////////
///////////////////// Extra functions //////////////////////
////////////////////////////////////////////////////////////

//Sort alphabetically
function sortAlpha(a, b){
	    if(a < b) return -1;
	    if(a > b) return 1;
	    return 0;
}//sortAlpha

//Sort on the number of words
function sortWords(a, b){
	    if(a.words < b.words) return -1;
	    if(a.words > b.words) return 1;
	    return 0;
}//sortWords

/*Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text*/
function wrap(text, width) {
  text.each(function() {
	var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.2, // ems
		y = parseFloat(text.attr("y")),
		x = parseFloat(text.attr("x")),
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

	while (word = words.pop()) {
	  line.push(word);
	  tspan.text(line.join(" "));
	  if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	  }
	}
  });
}//wrap