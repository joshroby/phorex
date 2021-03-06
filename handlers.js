var handlers = {
  
  expandWorldMap: function() {
    var expandWorldMapButton = document.getElementById('expandWorldMapButton');
    expandWorldMapButton.style.display = 'none';
    var collapseWorldMapButton = document.getElementById('collapseWorldMapButton');
    collapseWorldMapButton.style.display = 'inline';
    var worldMapTable = document.getElementById('worldMapTable');
    worldMapTable.style.display = 'table';
    var worldMapLegendDiv=document.getElementById('worldMapLegendDiv');
    worldMapLegendDiv.style.display = 'inline';
    
  },
  
  collapseWorldMap: function() {
    var expandWorldMapButton = document.getElementById('expandWorldMapButton');
    expandWorldMapButton.style.display = 'inline';
    var collapseWorldMapButton = document.getElementById('collapseWorldMapButton');
    collapseWorldMapButton.style.display = 'none';
    var worldMapTable = document.getElementById('worldMapTable');
    worldMapTable.style.display = 'none';
    var worldMapLegendDiv=document.getElementById('worldMapLegendDiv');
    worldMapLegendDiv.style.display = 'none';
  },
  
  setupCoords: function() {
    var size = Math.floor(document.getElementById('setupCoordsButton').valueAsNumber);
    worldMap.setupCoords(size*2,size);
    
    var expandWorldMapButton = document.getElementById('expandWorldMapButton');
    expandWorldMapButton.style.display = 'none';
    var collapseWorldMapButton = document.getElementById('collapseWorldMapButton');
    collapseWorldMapButton.style.display = 'inline';
    var worldMapTable = document.getElementById('worldMapTable');
    worldMapTable.style.display = 'table';
    view.displaySetUpTable();
  },
  
  setupTectonics: function() {
  	var size = document.getElementById('setupCoordsButton').valueAsNumber;
  	var plates = document.getElementById('setupTectonicsButton').valueAsNumber;
    worldMap.setupVoronoi(plates*Math.pow(size,2)/20);
    view.displaySetUpTable();
  },
  
  setupOceans: function() {
    worldMap.setupOceans(document.getElementById('setupOceanButton').valueAsNumber);
    view.displaySetUpTable();
  },
  
  setupHemisphere: function() {
    
    worldMap.stage = 3;
    
    var worldMapLegendDiv=document.getElementById('worldMapLegendDiv');
    worldMapLegendDiv.style.display = 'inline';
    
    var windPower = document.getElementById('setupPrecipitationButton').valueAsNumber;
    var hemisphere = document.getElementById('setupHemisphereButton').valueAsNumber;
    worldMap.setupPrecipitation(windPower,hemisphere);
    
    var heat = document.getElementById('setupTemperatureButton').valueAsNumber;
    worldMap.setupTemperature(heat+20,heat-10,hemisphere);
    
    view.displaySetUpTable();
  },
  
  setupPrecipitation: function() {
    
    worldMap.stage = 4;
    var windPower = document.getElementById('setupPrecipitationButton').valueAsNumber;
    var hemisphere = document.getElementById('setupHemisphereButton').valueAsNumber;
    worldMap.setupPrecipitation(windPower,hemisphere);
    
    view.displaySetUpTable();
  },
  
  setupTemperature: function() {
    
    worldMap.stage = 4;
    var heat = document.getElementById('setupTemperatureButton').valueAsNumber;
    var hemisphere = document.getElementById('setupHemisphereButton').valueAsNumber;
    worldMap.setupTemperature(heat+20,heat-10,hemisphere);
    
    view.displaySetUpTable();
  },
  
  setupBiomes: function() {
    worldMap.setupBiomes();
    view.displaySetUpTable();
  },
  
  setupPopulations: function() {
    worldMap.setupPopulations();
    view.displaySetUpTable();
  },
  
  selectTile: function() {
    worldMap.setupSelect(view.focusX,view.focusY);
  	view.displayWorldMap();
    view.refreshUi();
  },
  
  selectPop: function(i) {
  	var pop = worldMap.coords[view.focusX][view.focusY].units[i];
  	if (pop.loyalty.player > 0) {
  		view.displayGuidance(pop);
  	}
  },
  
  setLegendToElevation: function() {
    worldMap.prefs.legend = "altitude";
    view.displayWorldMap();
  },
  
  setLegendToPrecipitation: function() {
    worldMap.prefs.legend = "precipitation";
    view.displayWorldMap();
  },
  
  setLegendToTemperature: function() {
    worldMap.prefs.legend = "temperature";
    view.displayWorldMap();
  },
  
  setLegendToPopulation: function() {
    worldMap.prefs.legend = "population";
    view.displayWorldMap();
    
  },
  
  revealMap: function() {
  	for (x = 0;x < worldMap.prefs.size_x;x++) {
  		for (y = 0;y < worldMap.prefs.size_y;y++) {
  			worldMap.coords[x][y].fog = 1;
  		}
  	}
    view.displayWorldMap();
  },
  
  guidanceMapSelect: function(x,y) {
  	view.guidanceMapSelect(x,y);
  },
  
  uiGuidanceAssignButton: function() {
  	var i = document.getElementById('uiGuidanceAssignSelect').value;
  	var newJob = worldMap.coords[view.focusX][view.focusY].sites[i];
  	var cost = uiGuidanceAssignCostButton.innerHTML;
  	gameClock.guidancePoints -= cost;
  	
  	view.focusPop.assign(newJob);
  	
  	view.focusPop.guided = 1;

	view.selectGuidance('uiGuidanceResult') 
	document.getElementById('uiGuidanceResultContent').innerHTML = notification;
  	
  	view.refreshPeoplePanel();
  	view.refreshLandPanel();
  	view.refreshMinimapPanel();
  	view.displayGuidance(view.focusPop);
  },
  
  uiGuidanceProspectButton: function() {
  	var cost = uiGuidanceProspectCostButton.innerHTML;
  	gameClock.guidancePoints -= cost;
  	
  	view.focusPop.prospect();
  	
  	view.focusPop.guided = 1;

	view.selectGuidance('uiGuidanceResult')  
	document.getElementById('uiGuidanceResultContent').innerHTML = notification;	
  	view.refreshPeoplePanel();
  	view.refreshLandPanel();
  	view.refreshMinimapPanel();
  	view.displayGuidance(view.focusPop);
  },
  
  uiGuidanceBuildButton: function() {
  	var building = document.getElementById('uiGuidanceBuildSelect').value;
  	view.focusPop.build(building);
  	
  	view.focusPop.guided = 1;

	view.selectGuidance('uiGuidanceResult')
	document.getElementById('uiGuidanceResultContent').innerHTML = notification;
	view.refreshPeoplePanel();
  	view.refreshLandPanel();
  	view.refreshMinimapPanel();
  	view.displayGuidance(view.focusPop);
  },
  
  uiGuidanceExperimentButton: function() {
  	var cost = uiGuidanceExperimentCostButton.innerHTML;
  	gameClock.guidancePoints -= cost;
  	
  	var uiGuidanceExperimentSelect = document.getElementById('uiGuidanceExperimentSelect');
  	var resource = uiGuidanceExperimentSelect.options[uiGuidanceExperimentSelect.selectedIndex].value;
  	view.focusPop.experiment(resource);
  	
  	view.focusPop.guided = 1;

	view.selectGuidance('uiGuidanceResult') 
	document.getElementById('uiGuidanceResultContent').innerHTML = notification;
	
  	view.refreshPeoplePanel();
  	view.refreshMinimapPanel();
  	view.displayGuidance(view.focusPop);
  },
  
  uiGuidanceEnactButton: function() {
  	var cost = uiGuidanceEnactCostButton.innerHTML;
  	gameClock.guidancePoints -= cost;
  	
  	var uiGuidanceEnactSelect = document.getElementById('uiGuidanceEnactSelect');
  	var rite = uiGuidanceEnactSelect.options[uiGuidanceEnactSelect.selectedIndex].value;
  	view.focusPop.rites[rite].enact(view.focusPop);
  	
  	view.focusPop.guided = 1;

	view.selectGuidance('uiGuidanceResult') 
	document.getElementById('uiGuidanceResultContent').innerHTML = notification;
	
  	view.refreshMinimapPanel();
	view.refreshPeoplePanel();
  },
  
  uiGuidanceDesignButton: function() {
  	var cost = uiGuidanceDesignCostButton.innerHTML;
  	gameClock.guidancePoints -= cost;
  	
  	view.focusPop.design();
  	
  	view.focusPop.guided = 1;

	view.selectGuidance('uiGuidanceResult') 
	document.getElementById('uiGuidanceResultContent').innerHTML = notification;
	
	view.refreshPeoplePanel();
  	view.refreshMinimapPanel();
	view.refreshWorshipPanel();
  },
  
  uiGuidanceSynthesizeButton: function() {
  	var cost = uiGuidanceSynthesizeCostButton.innerHTML;
  	gameClock.guidancePoints -= cost;
  	
  	var uiGuidanceSynthesisSelectA = document.getElementById('uiGuidanceSynthesisSelectA');
  	var uiGuidanceSynthesisSelectB = document.getElementById('uiGuidanceSynthesisSelectB');
  	var riteA = view.focusPop.rites[uiGuidanceSynthesisSelectA.options[uiGuidanceSynthesisSelectA.selectedIndex].value];
  	var riteB = view.focusPop.rites[uiGuidanceSynthesisSelectB.options[uiGuidanceSynthesisSelectB.selectedIndex].value];
  	view.focusPop.synthesize(riteA,riteB);
  	
  	view.focusPop.guided = 1;

	view.selectGuidance('uiGuidanceResult') 
	document.getElementById('uiGuidanceResultContent').innerHTML = notification;
	
	view.refreshPeoplePanel();
  	view.refreshMinimapPanel();
	view.refreshWorshipPanel();
  },
  
  uiGuidanceScoutButton: function() {
  	var cost = uiGuidanceScoutCostButton.innerHTML;
  	gameClock.guidancePoints -= cost;
  	
  	var targetX = view.targetX;
  	var targetY = view.targetY;
  	view.focusPop.scout(targetX,targetY);
  	
  	view.focusPop.guided = 1;

	view.refreshMinimapPanel();
	view.displayWorldMap();
	view.refreshGuidanceMap();

	view.selectGuidance('uiGuidanceResult') 
	document.getElementById('uiGuidanceResultContent').innerHTML = notification;
	
	view.refreshPeoplePanel();
  	view.refreshMinimapPanel();
  },
  
  uiGuidanceRaidButton: function() {
  	var cost = uiGuidanceRaidCostButton.innerHTML;
  	gameClock.guidancePoints -= cost;
  	
  	var targetX = view.targetX;
  	var targetY = view.targetY;
  	view.focusPop.raid(targetX,targetY);
  	
  	view.focusPop.guided = 1;

	view.refreshMinimapPanel();
	view.displayWorldMap();
	view.refreshGuidanceMap();

	view.selectGuidance('uiGuidanceResult') 
	document.getElementById('uiGuidanceResultContent').innerHTML = notification;
	
	view.refreshPeoplePanel();
	view.refreshLandPanel();
  	view.refreshMinimapPanel();
	view.displayGuidance(view.focusPop);
  },
  
  uiGuidanceMigrateButton: function() {
  	var cost = uiGuidanceMigrateCostButton.innerHTML;
  	gameClock.guidancePoints -= cost;
  	
  	var targetX = view.targetX;
  	var targetY = view.targetY;
  	view.focusPop.migrate(targetX,targetY);
  	
  	view.focusPop.guided = 1;
	
	view.focusX = targetX;
	view.focusY = targetY;

	view.selectGuidance('uiGuidanceResult') 
	document.getElementById('uiGuidanceResultContent').innerHTML = notification;
  	
	view.refreshPeoplePanel();
	view.refreshLandPanel();
	view.refreshMinimapPanel();
	view.refreshWorshipPanel();
	view.displayWorldMap();
	view.refreshGuidanceMap();
  },
  
  uiGuidanceRenameButton: function() {
  	var uiGuidanceRenameField=document.getElementById('uiGuidanceRenameField');
  	var newName = uiGuidanceRenameField.value;
  	view.focusPop.rename(newName);
  },
  
  uiGuidanceSplitButton: function() {
  	var input=document.getElementById('uiGuidanceSplitSelect').value;
  	var splitType = input.substr(0,input.indexOf(" "));
  	var splitCost = +input.substr(1+input.indexOf(" "));
  	
  	gameClock.guidancePoints -= splitCost;
  	view.focusPop.splitByType(splitType);
  	
  	view.focusPop.guided = 1;

	view.selectGuidance('uiGuidanceResult') 
	document.getElementById('uiGuidanceResultContent').innerHTML = notification;
	view.refreshPeoplePanel();
  	view.refreshMinimapPanel();
  },
  
  uiGuidanceMergeButton: function() {
  	view.focusPop.mergeByType(0);
  	
  	view.focusPop.guided = 1;

	view.selectGuidance('uiGuidanceResult') 
	document.getElementById('uiGuidanceResultContent').innerHTML = notification;
	view.refreshPeoplePanel();
  	view.refreshMinimapPanel();
  },
  
  uiGuidanceEquipButton: function() {
  	var uiGuidanceEquipSelect = document.getElementById('uiGuidanceEquipSelect');
  	var resource = uiGuidanceEquipSelect.options[uiGuidanceEquipSelect.selectedIndex].value;
  	view.focusPop.equip(resource);
	view.refreshPeoplePanel();
  },
  
  uiGuidanceDivestButton: function() {
  	var cost = uiGuidanceDivestCostButton.innerHTML;
  	gameClock.guidancePoints -= cost;
  	
  	var uiGuidanceDivestSelect = document.getElementById('uiGuidanceDivestSelect');
  	var resource = uiGuidanceDivestSelect.options[uiGuidanceDivestSelect.selectedIndex].value;
  	view.focusPop.divest(resource);
	view.refreshPeoplePanel();
  	view.refreshMinimapPanel();
  },
  
  helpTopics: function() {
  	document.getElementById('uiHelpContent').src="helpfiles/helptopics.html";
  },
  
  processTurn() {
  
  	console.log("=-=-=-=-=-=-=-=- Begin Processing Turn ",gameClock.turn," -=-=-=-=-=-=-=-=-=");
  	
  	var worldPop = 0;
  
  	document.getElementById('uiGuidancePanel').style.display = "none";
    
    var uiNotificationsList = document.getElementById('uiNotificationsList');
    uiNotificationsList.innerHTML = "";
    
    // Sort all populations by prestige so high-prestige pops go first everywhere
    popsByPrestige = [];
    for (i in pops) {
    	if (pops[i].population > 0) {
    		popsByPrestige.push(pops[i]);
    	}
    }
    popsByPrestige.sort(function(a,b){return b.prestige - a.prestige});
    
    // And then populations do things:
    for (i in popsByPrestige) {
      popsByPrestige[i].lastSeason = "";
      popsByPrestige[i].work();
    }
    
    for (i in popsByPrestige) {
      popsByPrestige[i].eat();
    }
    
    for (i in popsByPrestige) {
      popsByPrestige[i].claim();
    }
    
    for (i in popsByPrestige) {
      popsByPrestige[i].share();
    }
    
    for (i in popsByPrestige) {
    	if (popsByPrestige[i].guided === 0) {
    		console.log(popsByPrestige[i]);
    		popsByPrestige[i].impulse();
    	} else {
    		popsByPrestige[i].lastSeason += popsByPrestige[i].name + " accepted guidance instead of taking an action on its own impulses.";
    	}
    }
    
    for (i in pops) {
      pops[i].season(pops[i]);
      pops[i].guided = 0;
      worldPop += pops[i].population;
    }
  
  	console.log("=-=-=-=-=-=-=-=- End Processing Turn ",gameClock.turn," -=-=-=-=-=-=-=-=-=");
  	console.log("Global Population: ",worldPop," in ",pops.length," populations.");
    
    gameClock.turn++;
    
    gameClock.guidancePoints = 300;
    
    view.refreshUi();
  },
  
};