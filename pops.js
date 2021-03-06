
var pops = [];

function Pop(name,people,population,x,y,prestige,values,demographics,dispositions,equipment,rites,advances,health,movement,job) {
  
  this.name = name;
  this.people = people;
  this.population = population;
  this.x = x;
  this.y = y;
  this.lastSeason = this.name + " rallies behind a new vision of the future.";
  this.history = [];
  this.loyalty = {player:0};
  this.guided = 0;
  this.familiarTiles = [worldMap.coords[x][y]];
  
  if (prestige === undefined) {
    this.prestige = 20 + Math.floor(Math.random()*60);
  } else {
    this.prestige = prestige;
  }
  
  if (values === undefined) {
    this.values = {aggression:Math.floor(Math.random()*100)};
    if (Math.random()>0.7) {
      this.values.matriarchy = Math.floor(Math.random()*100);
      this.values.patriarchy = Math.floor(Math.random()*100);
    } else if (Math.random()>0.7) {
      this.values.matriarchy = Math.floor(Math.random()*100);
      this.values.patriarchy = Math.floor(Math.random()*100);
      this.values.neutrarchy = Math.floor(Math.random()*100);
//     } else if (Math.random()>0.7) {
//       this.values.matriarchy = Math.floor(Math.random()*100);
//       this.values.patriarchy = Math.floor(Math.random()*100);
//       this.values.tertiarchy = Math.floor(Math.random()*100);
//       this.values.quartarchy = Math.floor(Math.random()*100);
    }
    
    if (Math.random()>0.6) {
      this.values.piety = Math.floor(Math.random()*100);
    }
    
    if (Math.random()>0.6) {
      this.values.inquiry = Math.floor(Math.random()*100);
    } else {
    	this.values.inquiry = 0;
    }
    
    if (Math.random()>0.6) {
      this.values.authority = Math.floor(Math.random()*100);
      
    }
  } else {
    this.values = values;
  }
  
  if (demographics === undefined) {
    this.demographics = {age:"mixed", fertility: "mixed", gender: "mixed"};
  } else {
    this.demographics = demographics;
  }
  
  if (dispositions === undefined) {
  	this.dispositions = {};
    this.dispositions.positive = Array(20);
    this.dispositions.negative = Array(20);;
  } else {
    this.dispositions = dispositions; // does this need to be with a .slice()?
  }
  
  if (advances === undefined) {
    this.advances = {failures: 0};
  } else {
    this.advances = advances;
  }
  
  if (equipment === undefined) {
    this.inv = {food:population,simpleTool:population/2};
  } else {
    this.inv = equipment;
  }
  
  if (rites === undefined) {
    this.rites = [];
  } else {
    this.rites = rites;
  }
  
  if (health === undefined) {
    this.health = 100;
  } else {
    this.health = health;
  }
  
  if (movement === undefined) {
    this.movement = 100;
  } else {
    this.movement = movement;
  }
  
  if (job === undefined) {
    this.job = worldMap.coords[x][y].sites[0];
  } else {
    this.job = job;
  }
  
  this.popUp = function() {
  
  	var popUpText;
    
    popUpText = "<h2>"+this.name+"</h2>";
    
    if (this.health < 100) {
      popUpText += " ("+Math.floor(this.health)+"% health)";
    }
    
    popUpText += "<table>";
    
    var force = this.force();
    force = Math.floor(force*100)/100;
    loyalty = this.loyalty.player;
    popUpText += "<tr><td class='popupbox'><div class='bigstat'>"+Math.floor(this.prestige*10)/10+"</div> Prestige</td><td class='popupbox'><div class='bigstat'>"+loyalty+"</div> Loyalty</td><td class='popupbox'><div class='bigstat'>"+force+"</div> Force</td></tr>";
    popUpText += "<tr><td colspan='3'><hr /></td></tr>";
  
    var demographicsText = '';
    
    for (var i in this.demographics) {
      if (this.demographics[i] !== "mixed") {
        demographicsText += this.demographics[i] + " ";
      }
    }
    
    popUpText += "<tr><td class='popupheader'>Members:</td><td class='popupdata' colspan='2'>" + this.population + " " + this.people.name + " "  + demographicsText + "</td></tr>";

    
    var valuesText = '';
    
    var values = this.values;
    var valuesRanked = [];
    
    for (i in this.values) {
      valuesRanked.push(i);
    }
    
    valuesRanked.sort(function(a,b){return values[b] - values[a] });
    
    for (i in valuesRanked) {
      valuesText += valuesRanked[i] + " " + Math.floor(this.values[valuesRanked[i]])+ "<br />";
    }
    
    popUpText += "<tr><td class='popupheader'>Values:</td><td class='popupdata' colspan='2'>"+valuesText+"</td></tr>";
    
    var advancesArray = [];
    var advancesText = '';
    
    for (i in this.advances) {
      advancesArray.push(i);
    }
    
    advancesArray.splice(0,1);
    advancesArray.sort();
    
    for (i in advancesArray) {
      advancesText += dataAdvances[advancesArray[i]].name + " " + this.advances[advancesArray[i]];
      if (i < advancesArray.length - 1) {
        advancesText += ", ";
      }
    }
    
    if (advancesText !== '') {
      popUpText += "<tr><td class='popupheader'>Advances:</td><td class='popupdata' colspan='2'>"+advancesText+"</td></tr>";
    }
    
    var invText = '';
    
    for (i in this.inv ) {
    	if (this.inv[i] > 0) {
    		invText += Math.floor(this.inv[i]) + " " + dataResources[i].name + "<br />";
    	}
    }
    
    popUpText += "<tr><td class='popupheader'>Stocks:</td><td class='popupdata' colspan='2'>"+invText+"</td></tr>";
    popUpText += "<tr><td colspan='3'><hr /></td></tr>";
    popUpText += "<tr><td class='popupheader'>Task:</td><td class='popupdata' colspan='2'>"+this.job.site.job+"</td></tr>";
    
    var secondaryProduceText = '';
    
    for (i in this.job.secondaryProduce) {
      secondaryProduceText += this.job.secondaryProduce[i].name;
      if (i < this.job.secondaryProduce.length - 1) {
        secondaryProduceText += ", ";
      }
    }
    
    popUpText += "<tr><td class='popupheader'>Producing:</td><td class='popupdata' colspan='2'>"+Math.floor(this.job.site.primaryEfficiency*this.population)+" "+this.job.site.primaryProduce.plural+" and a chance of "+secondaryProduceText+"</td></tr>";
    
    
  
  	if (this.loyalty.player > 0) {
  		popUpText += "<tr><td colspan='3'><hr /><br />Click to give guidance</td></tr></table>" 
  	}
    
    popUpText += "</table>";
    
    return popUpText;
  };
  
  this.notify = function(notification,witnesses,locations) {
    this.lastSeason = this.lastSeason + notification + "  ";
    this.history.push(notification);
//     notificationLog.push([this,worldMap.coords[this.x][this.y],witnesses,locations,notification]);
    console.log([this,worldMap.coords[this.x][this.y]],notification);
    
  };
  
  this.force = function() {
    var force = this.population;
    
    force *= Math.min(100,this.health+50)/100;
    force *= (this.values.aggression+50)/100;
    
    // for loops checking dataForceResources and dataForceAdvances for multipliers
    
    for (var i in dataForceItems) {
      if (this.inv[i] !== undefined) {
        force *= 1 + dataForceItems[i]*Math.min(1,dataForceItems[i]/this.population);
      }
    }
    
    for (i in dataForceAdvances) {
      if (this.advances[i] !== undefined) {
        force *= 1 + dataForceAdvances[i];
      }
    }
    
    return force;
  };
  
  this.defense = function() {
  	return this.force();
  };
  
  this.withinRange = function() {
  
  	var openPaths = [{x:this.x, y:this.y, movementRemaining: this.movement, path:[]}];
  	var visited = [worldMap.coords[this.x][this.y]];
  	var destinations = [];
  	
  	checkPath = function(x,y,movementRemaining,path) {
  		if (visited.indexOf(worldMap.coords[x][y]) === -1) {
  		
  			if (worldMap.coords[x][y].altitude > 0) { // Overland Movement

				// Reduce movement
				movementRemaining -= worldMap.coords[x][y].biome.moveCost;
			
				var newPath = path.slice(0,path.length);
				newPath.push({tile:worldMap.coords[x][y],x:x,y:y});
				openPaths.push({x:x,y:y,movementRemaining:movementRemaining,path:newPath});
				visited.push(worldMap.coords[x][y])
				destinations.push({tile:worldMap.coords[x][y],x:x,y:y,path})
  			
  			} else {
  				// Ocean Movement
				visited.push(worldMap.coords[x][y])
  			}
  		
  		}
  	}
  	
  	while (openPaths.length > 0) {
  		var thisPath = openPaths.shift();
  		if (thisPath.x-1 > 0 && thisPath.movementRemaining > 0) {
  			checkPath(thisPath.x-1,thisPath.y,thisPath.movementRemaining,thisPath.path);
  			}
  		if (thisPath.x+1 < worldMap.prefs.size_x && thisPath.movementRemaining > 0) {
  			checkPath(thisPath.x+1,thisPath.y,thisPath.movementRemaining,thisPath.path);
  			}
  		if (thisPath.y-1 > 0 && thisPath.movementRemaining > 0) {
  			checkPath(thisPath.x,thisPath.y-1,thisPath.movementRemaining,thisPath.path);
  			}
  		if (thisPath.y+1 < worldMap.prefs.size_y && thisPath.movementRemaining > 0) {
  			checkPath(thisPath.x,thisPath.y+1,thisPath.movementRemaining,thisPath.path);
  			}
  	};
  	
  	return destinations;
  
  };
  
  this.withinSight = function() {
  	
  	var visible = [];
  	var sight = 3;
  	var dist;
  	
  	for (var x=this.x-sight; x<this.x+sight+1; x++) {
  		for (var y=this.y-sight; y<this.y+sight+1; y++) {
  			dist = Math.pow((this.x-x)*(this.x-x)+(this.y-y)*(this.y-y),.5);
  			if (x >= 0 && y >= 0 && x < worldMap.prefs.size_x && y < worldMap.prefs.size_y && dist <= sight) {
  				visible.push({x,y});
  			}
  		}
  	}
  	
  	return visible;
  	
  };
  
  this.split = function(name) {
    
    var newPop = new Pop(undefined,undefined,0,this.x,this.y);
    var split = Math.random()*0.2 + 0.4;
    
    if (name === undefined) {
      name = this.name + " Schismatics";
    }
    

    newPop.name = name;
    newPop.people = this.people;
    newPop.population = Math.floor(this.population*split);
    newPop.x = this.x;
    newPop.y = this.y;
    newPop.prestige = this.prestige;
    
    newPop.values = {};
    for (var i in this.values) {
      newPop.values[i] = this.values[i]; 
    }
    
    newPop.demographics = {};
    for (i in this.demographics) {
      newPop.demographics[i] = this.demographics[i]; 
    }
    
    newPop.dispositions = {};
    for (i in this.dispositions) { // This will probably need to be more elaborate.
      newPop.dispositions[i] = this.dispositions[i]; 
    }
    
    newPop.inv = {};
    for (i in this.inv) {
      newPop.inv[i] = Math.floor(this.inv[i]/2);
      this.inv[i] = Math.ceil(this.inv[i]/2);
    }
    
    newPop.advances = this.advances;
    newPop.advances.failures = this.advances.failures/2;
    this.advances.failures /= 2;
    
    newPop.rites = this.rites;
    
    newPop.health = this.health;
    newPop.movement = this.movement;
    newPop.job = this.job;
    
    newPop.loyalty.player = this.loyalty.player;
    
    this.population = Math.ceil(this.population*(1-split));
    this.prestige /= 0.8;
    
    newPop.familiarTiles = [];
    for (i in this.familiarTiles) {
    	newPop.familiarTiles.push(this.familiarTiles[i]);
    }
    
    pops.push(newPop);
    worldMap.coords[this.x][this.y].units.push(newPop);
    
    return newPop;
    
  };
  
  this.merge = function(pop) {
  	newPop = new Pop(this.name,this.people,this.population + pop.population,this.x,this.y)
  	newPop.prestige = (this.prestige + pop.prestige + Math.min(this.prestige,pop.prestige) ) / 3;
  	
  	if (this.loyalty.player !== 0 || pop.loyalty.player !== 0) {
  		newPop.loyalty.player = (this.loyalty.player*this.population + pop.loyalty.player*pop.population)/newPop.population;
  	}
  	
  	var sharedValues = Object.keys(this.values);
  	for (i in pop.values) {
  		if (sharedValues.indexOf(pop.values[i]) === -1) {
  			sharedValues.push(i);
  		}
  	}
  	for (i in sharedValues) {
  		if (this.values[sharedValues[i]] === undefined) {
  			newPop.values[sharedValues[i]] = (pop.population * pop.values[sharedValues[i]]) / newPop.population ;
  		} else if (pop.values[sharedValues[i]] === undefined) {
  			newPop.values[sharedValues[i]] = (this.population * this.values[sharedValues[i]]) / newPop.population ;
  		} else {
  			newPop.values[sharedValues[i]] = (this.population * this.values[sharedValues[i]] + pop.population * pop.values[sharedValues[i]]) / newPop.population ;
  		}
  	}
  	
  	var sharedDemographics = Object.keys(this.demographics);
  	for (i in pop.demographics) {
  		if (sharedDemographics.indexOf(pop.demographics[i]) === -1) {
  			sharedDemographics.push(i);
  		}
  	}
  	for (i in sharedDemographics) {
  		if (this.demographics[sharedDemographics[i]] === pop.demographics[sharedDemographics[i]]) {
  			newPop.demographics[sharedDemographics[i]] = this.demographics[sharedDemographics[i]];
  		} else if (this.demographics[sharedDemographics[i]] === "Queers") {
  			newPop.demographics[sharedDemographics[i]] = pop.demographics[sharedDemographics[i]];
  		} else if (pop.demographics[sharedDemographics[i]] === "Queers") {
  			newPop.demographics[sharedDemographics[i]] = this.demographics[sharedDemographics[i]];
  		} else if (this.demographics[sharedDemographics[i]] === undefined) {
  			newPop.demographics[sharedDemographics[i]] = "mixed";
  		}
  	}
  	
  	newPop.dispositions = [];
  	for (i=this.dispositions.length/2; i < this.dispositions.length; i++) {
  	newPop.dispositions.push(this.dispositions[i]);
  	newPop.dispositions.push(pop.dispositions[i]);
  	}
  	
  	var sharedInv = Object.keys(this.inv);
  	for (i in pop.inv) {
  		if (this.inv[pop.inv[i]] === undefined) {
  			sharedInv.push(pop.inv[i]);
  		}
  	}
  	for (i in sharedInv) {
  		if (this.inv[pop.inv[i]] === undefined) {
  			newPop.inv[pop.inv[i]] = pop.inv[pop.inv[i]];
  		} else if (pop.inv[pop.inv[i]] === undefined) {
  			newPop.inv[pop.inv[i]] = this.inv[pop.inv[i]];
  		} else {
  			newPop.inv[pop.inv[i]] = this.inv[pop.inv[i]] + pop.inv[pop.inv[i]];
  		}
  	}
  	
  	for (i in this.rites) {
  		newPop.rites.push(this.rites[i]);
  	}
  	for (i in pop.rites) {
  		if (newPop.rites.indexOf(pop.rites[i]) === -1) {
  			newPop.rites.push(pop.rites[i]);
  		}
  	}
  	
  	var sharedAdvances = Object.keys(this.advances);
  	for (i in pop.advances) {
  		if (this.advances[i] === undefined) {
  			sharedAdvances.push(i);
  		}
  	}
  	for (i in sharedAdvances) {
  		if (sharedAdvances[i] === "failures") {
  			newPop.advances.failures = this.advances.failures + pop.advances.failures;
  		} else if (this.advances[sharedAdvances[i]] === undefined) {
  			newPop.advances[sharedAdvances[i]] = pop.advances[sharedAdvances[i]];
  		} else if (pop.advances[sharedAdvances[i]] === undefined) {
  			newPop.advances[sharedAdvances[i]] = this.advances[sharedAdvances[i]];
  		} else {
  			newPop.advances[sharedAdvances[i]] = this.advances[i] + pop.advances[sharedAdvances[i]];
  		}
  	}
  	
  	newPop.health = (this.health * this.population + pop.health * pop.population) / newPop.population;
  	newPop.movement = 100;
  	newPop.job = this.job;
    
    pops.slice(pops.indexOf(this),1);
    pops.slice(pops.indexOf(pop),1);
    pops.push(newPop);
        
    worldMap.coords[this.x][this.y].units.splice(worldMap.coords[this.x][this.y].units.indexOf(this),1);
    worldMap.coords[pop.x][pop.y].units.splice(worldMap.coords[pop.x][pop.y].units.indexOf(pop),1);
    worldMap.coords[this.x][this.y].units.push(newPop);
  	
  	return newPop;
  	
  };
  
  this.assign = function(newJob) {
  	this.job = newJob;
  	
  	notification = this.name + " decides to start working as " + this.job.site.job + "s at the " + this.job.site.name + ".";
	
	this.notify(notification);
// 	this.guided = 1;
  };
  
  this.prospect = function() {
 	var site;
  	var naturalSites = worldMap.coords[this.x][this.y].biome.naturalSites;
  	var currentSites = [];
  	var potentialSites = [];
  	for (i in worldMap.coords[this.x][this.y].sites) {
  		currentSites.push(worldMap.coords[this.x][this.y].sites[i].site);
  	}
  	if (Math.random() < 1 / ( currentSites.length + 4 ) ) {
  		for (i in naturalSites) {
  			if (currentSites.indexOf(naturalSites[i]) === -1) {
  				potentialSites.push(naturalSites[i]);
  			}
  		}
  		site = potentialSites[Math.floor(Math.random()*potentialSites.length)];
  	}
  	
  	if (site === undefined)  {
  		notification = this.name + " prospects for another work site but finds nothing, wasting " + currentSites.length*10 + " Food and " + currentSites.length*5 + " Simple Tools in the process.";
  	} else {
  		notification = this.name + " prospects for a new work site and discovers a " + site.name + ".  " + currentSites.length*10 + " Food and " + currentSites.length*5 + " Simple Tools are consumed in the process.";
  		worldMap.coords[this.x][this.y].sites.push({site:site,capacity:site.baseCapacity});
  	}
  	this.inv.food -= currentSites.length*10;
  	this.inv.simpleTool -= currentSites.length*5;
  	if (this.values.inquiry == undefined) {
  		gameClock.guidancePoints -= 100;
  	} else {
	  	gameClock.guidancePoints -= 100 - this.values.inquiry;
	}
	
	this.notify(notification);
// 	this.guided = 1;
  };
  
  this.build = function(site) {
  	site = dataSites[site];
  	for (i in site.buildCost) {
  		if (this.inv[i] > site.buildCost[i]) {
  			this.inv[i] -= site.buildCost[i];
  		} else {
  			worldMap.coords[this.x][this.y].stocks[i] -= site.buildCost[i] - this.inv[i];
  			this.inv[i] = 0;
  		}
  	}
  	
  	this.prestige += 20;
  	
  	worldMap.coords[this.x][this.y].sites.push({site:site,capacity:site.baseCapacity});
  	notification = this.name + " builds a "+ site.name + ".";
  	
  	if (this.inv.food >= this.population) {
  		var sitesHere = worldMap.coords[this.x][this.y].sites;
  		this.job = sitesHere[sitesHere.length-1];
  		notification += " They start to work at the new site.";
  	}
  	
  	
  	
  	this.notify(notification);
// 	this.guided = 1;
  	};
  
  this.link = function(destination,type) {
  	worldMap.coords[this.x][this.y].links.push({destination:destination,type:type});
  	if (type.reflexive === true) {
  		destination.links.push({destination:worldMap.coords[this.x][this.y],type:type});
  	}
  	notification = this.name + " establishes a trade route to " + destination.name + " (" + destination.x + "," + destination.y + ").";
  	this.notify(notification);
  };
  	
  	
  
  this.experiment = function(sacrifice) {

	// The only to-do here is that pops can learn advances well beyond the range of useful advances (Forestry 47).
  	
  	var potentialAdvances = [];
  	var advance;
  	var sacrificeNum = Math.ceil(this.inv[sacrifice]/5);
	this.inv[sacrifice] -= sacrificeNum;
  	
  	for (i in dataResources[sacrifice].advances) {
  		advance = dataResources[sacrifice].advances[i].key;
    	var terrainCheck = dataAdvances[advance].biomes.indexOf(worldMap.coords[this.x][this.y].biome.name) !== -1;
    	var levelCheck = this.advances[advance] === undefined || this.advances[advance] < dataAdvances[advance].unlocks.length-1;
    	if (terrainCheck === true && levelCheck === true) {
        	potentialAdvances.push(dataResources[sacrifice].advances[i]);
      	}
    }
    advance = potentialAdvances[Math.floor(Math.random()*potentialAdvances.length)];

    if (Math.random()*100 < sacrificeNum + this.advances.failures && advance !== undefined) {     
      if (this.advances[advance.key] === undefined) {
        this.advances[advance.key] = 1;
      } else {
        this.advances[advance.key]++;
      }
      this.advances.failures = 0;
      var advanceLevel = dataAdvances[advance.key].unlocks[this.advances[advance.key]];
      
      if (advanceLevel === undefined) {
      	console.log("Reached End of the Advance ",advance.key);
      } else if(advanceLevel.type === "value") {
      	// Learned new value
      	if (this.values[advanceLevel.key] === undefined) {
      		this.values[advanceLevel.key] = Math.floor(100*Math.random());
      	} else {
      		this.values[advanceLevel.key] += 10;
      	}
      }
      
      notification = this.name + " destroys " + sacrificeNum + " " + dataResources[sacrifice].plural + " in an experiment.  They discover "+advance.name+".";      
    } else {
      this.advances.failures++;
      notification = this.name + " destroys " + sacrificeNum + " " + dataResources[sacrifice].plural + " in an experiment.  It yields only negative data.";
    }
    
    this.notify(notification);
// 	this.guided = 1;
  	
  	};
  	
  	
  	
  this.enact = function(rite) {
  	console.log("Enact ",rite);
// 	this.guided = 1;
  	};
  
  this.design = function() {
  	
  	var resources = [];
  	for (i in Object.keys(this.inv)) {
  		if (this.inv[Object.keys(this.inv)[i]] > 1)
  			 resources.push(Object.keys(this.inv)[i]);
  	}
  	var sacrifice = resources[Math.floor(Math.random()*resources.length)];
  	
  	if (sacrifice === undefined) {
  		this.values.piety -= 20;
  		notification = this.name + " has nothing to sacrifice in its religious rites.";
		this.notify(notification);
  	} else {  	
		var sacrificeNum = Math.ceil(this.inv[sacrifice] / 5 )
		this.inv[sacrifice] -= sacrificeNum;
	
		if (Math.random() < 0.2) {
			var newRite = new Rite(this,sacrifice);
			this.rites.push(newRite);
			worldMap.rites.push(newRite);
			notification = this.name + " sacrifices " + sacrificeNum + " " + sacrifice + " and develop a new major rite, " + newRite.name + ".";
		} else {
			notification = this.name + " sacrifices " + sacrificeNum + " " + sacrifice + " in minor religious rites.";
		}
		this.notify(notification);

  	}
// 	this.guided = 1;
  	};
  	
  	
  	
  this.synthesize = function(riteA,riteB) {
    	
  	var newRite = new Rite(this,dataResources.caribou);
  	this.rites.push(newRite);
  	this.rites.splice(this.rites.indexOf(riteA),1);
  	this.rites.splice(this.rites.indexOf(riteB),1);
  	
  	if (Math.random() > 0.5) {
  		newRite.form = riteA.form;
  	} else {
  		newRite.form = riteB.form;
  	}
  	
  	newRite.icon = riteA.icon.concat(riteB.icon);
  	newRite.icon = newRite.icon.filter(function(item,pos) {return newRite.icon.indexOf(item) == pos});
  	newRite.icon.sort(function() {return Math.floor(Math.random()*2)});
  	if (newRite.icon.length > 4) {
  		newRite.icon.pop();
  	}
  	newRite.adjective = riteA.adjective.concat(riteB.adjective);
  	newRite.adjective.sort(function() {return Math.floor(Math.random()*2)});
  	if (newRite.adjective.length > 2) {
  		newRite.adjective.pop();
  	}
  	var disposableAdjectives = newRite.adjective.slice();
  	var icons = '';
  	for (i in newRite.icon) {
  		if (Math.random()*2 < disposableAdjectives.length) {icons += disposableAdjectives.pop() + " "}
  		icons += newRite.icon[i]
  		if (i < newRite.icon.length-2) {
  			icons += ", the ";
  		} else if (i == newRite.icon.length-2) {
  			icons += " and the ";
  		}
  	}
  	
  	if (newRite.icon.length === 2 && Math.random() < 0.33) {
  		disposableAdjectives = newRite.adjective.slice();
  		icons = '';
  		if (Math.random()*2 < disposableAdjectives.length) {icons += disposableAdjectives.pop() + " "}
  		icons += newRite.icon[0] + " against the ";
  		if (Math.random()*2 < disposableAdjectives.length) {icons += disposableAdjectives.pop() + " "}
  		icons += newRite.icon[1];
  	}
  	
  	newRite.name = newRite.form + " of the " + icons;
  	
  	newRite.power = Math.ceil(0.66 * (riteA.power + riteB.power));  	
  	newRite.moral = riteA.moral.concat(riteB.moral);
  	
  	newRite.items = riteA.items.concat(riteB.items);
  	newRite.items = newRite.items.filter(function(item,pos) {return newRite.items.indexOf(item) == pos});
  	
  	notification = this.name + " synthesized " + riteA.name + " and " + riteB.name + " to create " + newRite.name + ".";
	this.notify(notification);

// 	this.guided = 1;
  	};
  	
  	
  	
  	
  this.scout = function(destination) {
  	var old = {x:0,y:0};
  	old.x = this.x;
  	old.y = this.y
  	this.x = destination.x;
  	this.y = destination.y;
	
	if (this.loyalty.player > 0) {
		var withinSight = this.withinSight();
		for (t in withinSight) {
			if (worldMap.coords[withinSight[t].x][withinSight[t].y].fog === 0) {
				worldMap.coords[withinSight[t].x][withinSight[t].y].fog = 1;
			}
		}
	}
	this.familiarTiles.push(destination);
	
	this.x = old.x;
	this.y = old.y;
	
	notification = this.name + " mounts a scouting expedition to " + destination.name + " (" +destination.x+ "," +destination.y+ ") and comes home with tall tales.";
  	this.notify(notification);
// 	this.guided = 1;
  	};
  	
  	
  	
  
  this.raid = function(x,y) {
  	notification = this.name + " mounts a raid to " + worldMap.coords[x][y].name + " (" +x+ "," +y+ ").  ";
  	
  	var targetTile = worldMap.coords[x][y];
  	var pileLoot = 0;
  	var targetPop;
  	var raidForce = this.force();
  	var potentialTargets = [];
  	var hatedTargets = [];
  	var stocks;
  	var pileLoot = [];
  	var popLoot;
	var spoilsPile;
	var spoilsPop;
  	var spoilsPileNum = 0;
  	var spoilsPopNum = 0;
  	
  	this.familiarTiles.push(worldMap.coords[x][y]);
  	
//   	for (i in targetTile.stocks) {
//   		pileLoot += targetTile.stocks[i] ;
//   	}
  	
  	for (i in targetTile.units) {
  		if (raidForce * 1.2 > targetTile.units[i].defense() && targetTile.units[i] !== this) {
  			potentialTargets.push(targetTile.units[i]);
  		}
  	} 
  	
  	// Add additional entries to potentialTargets if they appear on the raiders' shit-list
  	for (i in potentialTargets) {
  		hatedTargets = hatedTargets.concat(pop.dispositions.negative.filter(function(pop) {return pop === potentialTargets[i]}));
  	}
  	potentialTargets = potentialTargets.concat(hatedTargets);
  	
  	targetPop = potentialTargets[Math.floor(Math.random()*potentialTargets.length)];
  	
  	raidForce *= Math.random() + 0.5;
  	
  	if (targetTile.units.length === 0 && pileLoot < 1) {
  		notification += this.name + " finds the place deserted and looted."
  	} else if (targetTile.units.length === 0) {
  		notification += this.name + " finds an undefended stockpile!"
  		spoilsPileNum = 2;
	} else if (targetPop === undefined) {
		notification += this.name + " cannot find a vulnerable target.";
  	} else if (raidForce > 2 * targetPop.defense() ) {
  		spoilsPopNum = 1.5;
  		spoilsPileNum = 1.5;
  		targetPop.health -= 30;
  		notification += "They trounce the defenders and return at "+Math.floor(pop.health)+"% health.";
  		targetPop.lastSeason += "The "+pop.name+" trounce them in a raid, reducing their health to "+targetPop.health+"%.";
  	} else if (raidForce > targetPop.defense() ) {
  		spoilsPopNum = 1;
  		spoilsPileNum = 1;
  		targetPop.health -= 20;
  		this.health -= 10
  		notification += "They defeat the defenders and return at "+Math.floor(pop.health)+"% health.";
  		targetPop.lastSeason += "The "+pop.name+" defeat them in a raid, reducing their health to "+targetPop.health+"%.";
  	} else if (raidForce > 0.5 * targetPop.defense() ) {
  		spoilsPopNum = 0;
  		spoilsPileNum = 1;
  		targetPop.health -= 10;
  		this.health -= 20
  		notification += "They struggle against the defenders and return at "+Math.floor(pop.health)+"% health.";
  		targetPop.lastSeason += "The "+pop.name+" struggle against them in a raid, reducing their health to "+targetPop.health+"%.";
  	} else {
  		spoilsPopNum = 0;
  		spoilsPileNum = 0;
  		this.health -= 30
  		notification += "They are routed by the defenders and return at "+Math.floor(pop.health)+"% health.";
  		targetPop.lastSeason += "The " + pop.name + " are routed after attempting a raid.";
  	}
  	
	if (spoilsPileNum !== 0 ) {
	
		stocks = Object.keys(targetTile.stocks);
		for (i in stocks) {
			if (targetTile.stocks[stocks[i]] > 0) {
				pileLoot.push(stocks[i]);
			}
		};
		
		if (targetPop === undefined) {
			popLoot = [];
		} else {
			popLoot = Object.keys(targetPop.inv);
		}
	
		spoilsPile = pileLoot[Math.floor(Math.random()*pileLoot.length)]
		spoilsPop = popLoot[Math.floor(Math.random()*popLoot.length)]
	
		spoilsPileNum *= targetTile.stocks[spoilsPile] / 2;
		if (targetPop === undefined) {
			spoilsPopNum = 0;
		} else {
			spoilsPopNum *= targetPop.inv[spoilsPop] / 2;
		}

		spoilsPopNum = Math.floor(spoilsPopNum*100)/100;
		spoilsPileNum = Math.floor(spoilsPileNum*100)/100;

		if (spoilsPop === undefined && spoilsPile === undefined) {
			spoilsText = " Their targets, however, had nothing to take as spoils.";
		} else if (spoilsPile === undefined) {
			spoilsText = " They keep " + spoilsPopNum + " of the " +targetPop.name+ "'s " + dataResources[spoilsPop].plural + " as spoils.";
			targetPop.lastSeason += " The raiders carry off " + spoilsPopNum + " " + dataResources[spoilsPop].plural + " from the "+targetPop.name+".  ";
			if (this.inv[spoilsPop] === undefined) {
				this.inv[spoilsPop] = spoilsPopNum;
			} else {
				this.inv[spoilsPop] += spoilsPopNum;
			}
			targetPop.inv[spoilsPop] -= spoilsPopNum;
		} else if (spoilsPop === undefined) {
			spoilsText = " They add their spoils, " + spoilsPileNum + " " + dataResources[spoilsPile].plural + ", to the stockpile.";
			pop.prestige += 10;
			if (worldMap.coords[this.x][this.y].stocks[spoilsPile] === undefined) {
				worldMap.coords[this.x][this.y].stocks[spoilsPile] = spoilsPileNum;
			} else {
				worldMap.coords[this.x][this.y].stocks[spoilsPile] += spoilsPileNum;
			}
			targetTile.stocks[spoilsPile] -= spoilsPileNum;
		} else {
			spoilsText = " They add a portion of their spoils, " + spoilsPileNum + " " + dataResources[spoilsPile].plural + ", to the stockpile and keep " + spoilsPopNum + " of the " +targetPop.name+ "'s " + dataResources[spoilsPop].plural + " for themselves.";
			targetPop.lastSeason += " The raiders carry off " + spoilsPileNum + " " + dataResources[spoilsPile].plural + " from the stockpile and " + spoilsPopNum + " " + dataResources[spoilsPop].plural + " from the "+targetTile.name+".  ";
			this.prestige += 10;
			if (this.inv[spoilsPop] === undefined) {
				this.inv[spoilsPop] = spoilsPopNum;
			} else {
				this.inv[spoilsPop] += spoilsPopNum;
			}
			if (worldMap.coords[this.x][this.y].stocks[spoilsPile] === undefined) {
				worldMap.coords[this.x][this.y].stocks[spoilsPile] = spoilsPileNum;
			} else {
				worldMap.coords[this.x][this.y].stocks[spoilsPile] += spoilsPileNum;
			}
			targetPop.inv[spoilsPop] -= spoilsPopNum;
			targetTile.stocks[spoilsPile] -= spoilsPileNum;
		}

		if (targetPop !== undefined) {
			targetPop.prestige -= 5;
			targetPop.values.aggression += 2;

			// Add raiders to raidTarget's dispositions shit-list
			targetPop.dispositions.negative.shift();
			targetPop.dispositions.negative.push(this);
		}
	
		notification += spoilsText;
	}
	
	// Fog
	
	if (this.loyalty.player > 0) {	
		var old = {x:0,y:0};
		old.x = this.x;
		old.y = this.y
		this.x = x;
		this.y = y;
		var withinSight = this.withinSight();
		for (t in withinSight) {
			worldMap.coords[withinSight[t].x][withinSight[t].y].fog = 1;
		}
	
		this.x = old.x;
		this.y = old.y;
		
		view.displayWorldMap();
	}
  	
	this.notify(notification);
  	
// 	this.guided = 1;
  	};
  
  
  
  
  
  
  this.migrate = function(x,y) {
  	var targetTile = worldMap.coords[x][y];
  	var oldTile = worldMap.coords[this.x][this.y];
	oldTile.units.splice(oldTile.units.indexOf(this),1);
	this.x = x;
	this.y = y;
	this.prestige = Math.floor((this.prestige + 50)/2);
	this.job = worldMap.coords[this.x][this.y].sites[0];
	this.familiarTiles.push(worldMap.coords[x][y]);
	targetTile.units.push(this);
	notification = this.name + " migrates to " + worldMap.coords[x][y].name + " (" +x+ "," +y+ ")."
	
	if (this.loyalty.player > 0) {
		var withinSight = this.withinSight();
		for (t in withinSight) {
			worldMap.coords[withinSight[t].x][withinSight[t].y].fog = 1;
		}
	}
	this.notify(notification);
// 	this.guided = 1;
  		
  	};
  
  this.rename = function(newName) {
  	this.name = newName;
  	view.refreshPeoplePanel();
  	view.closeGuidancePanel();
  	};
  
  this.splitByType = function(splitType) {
  	
  	if (splitType === "matriarchy") {
  		notification = this.name + " expels their men into a separate population.";
		var newPop = this.split(this.name+" Men");
		this.demographics.gender = "Women";
		this.values.matriarchy = Math.min(100,this.values.matriarchy+10);
		newPop.values.matriarchy = Math.max(0,newPop.values.matriarchy-10);
		if (newPop.population < 3 && Math.random() > 0.2) {
			newPop.demographics.gender = "Men";
		} else if (newPop.population < 3) {
			newPop.demographics.gender = "Genderqueers";
			newPop.name = pop.name + " Queers" ;
		} else {
			newPop.demographics.gender = "Men";
		}
		if (Math.random() < 1/newPop.population) {
			newPop.demographics.age = ["Young","Middle-aged","Elderly"][Math.floor(Math.random()*3)];
		}
  		
  	} else if (splitType === "patriarchy") {
		notification = this.name + " expels their women into a seperate population.";
		var newPop = this.split(this.name+" Women");
		this.demographics.gender = "Men";
		this.values.patriarchy = Math.min(100,this.values.patriarchy+10);
		newPop.values.patriarchy = Math.max(0,newPop.values.patriarchy-10);
		if (newPop.population < 3 && Math.random() > 0.2) {
			newPop.demographics.gender = "Women";
		} else if (newPop.population < 3) {
			newPop.demographics.gender = "Genderqueers";
			newPop.name = this.name + " Queers" ;
		} else {
			newPop.demographics.gender = "Women";
		}
		if (Math.random() < 1/newPop.population) {
			newPop.demographics.age = ["Young","Middle-aged","Elderly"][Math.floor(Math.random()*3)];
		}
  		
  	} else if (splitType === "neutrarchy") {
		notification = this.name + " expels their breeders into a seperate population.";
		var newPop = this.split(this.name+" Breeders");
		this.values.neutrarchy = Math.min(100,this.values.neutrarchy+10);
		newPop.values.neutrarchy = Math.max(0,newPop.values.neutrarchy-10);
		if (this.demographics.gender === "Women" || this.demographics.gender === "Men" || this.demographics.gender === "Genderqueers") {
			newPop.demographics.gender = this.demographics.gender;
		} else if (newPop.population < 3 && Math.random() > 0.2) {
			newPop.demographics.gender = "mixed";
		} else if (newPop.population < 3 && Math.random < .1) {
			newPop.demographics.gender = "Genderqueers";
			newPop.name = this.name + " Queers" ;
		} else if (newPop.population < 3 && Math.random < .5) {
			newPop.demographics.gender = "Men";
			newPop.name = this.name + " Men" ;
		} else if (newPop.population < 3 ) {
			newPop.demographics.gender = "Women";
			newPop.name = this.name + " Women" ;
		} else {
			newPop.demographics.gender = "mixed";
		}
		this.demographics.gender = "Neuters";
		newPop.demographics.fertility = "Breeder";
		this.demographics.fertility = "Celibate";
		if (Math.random() < 1/newPop.population && newPop.demographics.age === "mixed") {
			newPop.demographics.age = ["Young","Middle-aged","Elderly"][Math.floor(Math.random()*3)];
		}
		newPop.population += Math.floor(this.population/2);
		this.population -= Math.floor(this.population/2);
  		
  	} else if (splitType === "piety") {
  		notification = this.name + " expels its heretics into a separate population.";
  		
		var lowClassName = ["Apostate ","Heretical ","Confused ","Antinomian ","Deluded "][Math.floor(Math.random()*5)] ;
		var newPop = this.split();
		newPop.name = lowClassName + this.name;
		this.values.piety += 20;
		newPop.values.piety += 20;
		if (Math.random() > 1/newPop.population && newPop.demographics.gender === "mixed") {
			newPop.demographics.gender = ["Men","Women","Genderqueer","Neuter"][Math.floor(Math.random()*4)];
		}
		if (Math.random() > 1/newPop.population && newPop.demographics.age === "mixed") {
			newPop.demographics.age = ["Young","Middle-aged","Elderly"][Math.floor(Math.random()*3)];
		}
		for (i in this.loyalty) {
			this.loyalty[i] *= 0.8;
		}
		
  	} else if (splitType === "authority") {
  		notification = this.name + " expels its less prestigious members into a new population.";
  		
		var lowClassName = ["Low-caste ","Abject ","Poor ","Lesser ","Debased "][Math.floor(Math.random()*5)] ;
		var newPop = this.split();
		newPop.name = lowClassName + this.name;
		newPop.prestige -= 20;
		this.prestige += 20;
		this.values.authority += 20;
		newPop.values.authority += 10;
		if (Math.random() > 1/newPop.population && newPop.demographics.gender === "mixed") {
			newPop.demographics.gender = ["Men","Women","Genderqueer","Neuter"][Math.floor(Math.random()*4)];
		}
		if (Math.random() > 1/newPop.population && newPop.demographics.age === "mixed") {
			newPop.demographics.age = ["Young","Middle-aged","Elderly"][Math.floor(Math.random()*3)];
		}
		for (i in this.loyalty) {
			this.loyalty[i] *= 0.8;
		}
  		
  	} else if (splitType === "aggression") {
  		notification = this.name + " expels its weakest members into a new population.";
  		
		var lowClassName = ["Honorless ","Weak ","Defenseless ","Pacifist ","Civilian "][Math.floor(Math.random()*5)] ;
		var newPop = this.split();
		newPop.name = lowClassName + this.name;
		this.values.aggression += 20;
		newPop.values.aggression -= 20;
		if (Math.random() > 1/newPop.population && newPop.demographics.gender === "mixed") {
			newPop.demographics.gender = ["Men","Women","Genderqueer","Neuter"][Math.floor(Math.random()*4)];
		}
		if (Math.random() > 1/newPop.population && newPop.demographics.age === "mixed") {
			newPop.demographics.age = ["Young","Middle-aged","Elderly"][Math.floor(Math.random()*3)];
		}
		for (i in this.loyalty) {
			this.loyalty[i] *= 0.8;
		}
  	}
  	
// 	this.guided = 1;
// 	newPop.guided = 1;
  	};
  
  this.mergeByType = function(mergeType,mergeTarget) {
  	console.log("Merge with ",mergeTarget," via ",mergeType);
// 	this.guided = 1;
  	};
  
  this.equip = function(resource) {  	
  	if (worldMap.coords[this.x][this.y].stocks[resource] > this.population - this.inv[resource]) {
  		this.prestige += 5 * (this.population - this.inv[resource])/this.population;
  		this.loyalty.player++;
  		worldMap.coords[this.x][this.y].stocks[resource] -= this.population - this.inv[resource];
  		this.inv[resource] = this.population;
  	} else if (this.inv[resource] !== undefined) {
  		this.prestige +=  5*worldMap.coords[this.x][this.y].stocks[resource]/this.population;
  		this.loyalty.player++;
  		this.inv[resource] += worldMap.coords[this.x][this.y].stocks[resource];
  		worldMap.coords[this.x][this.y].stocks[resource] = 0;
  	} else {
  		this.prestige +=  5*worldMap.coords[this.x][this.y].stocks[resource]/this.population;
  		this.loyalty.player++;
  		this.inv[resource] = worldMap.coords[this.x][this.y].stocks[resource];
  		worldMap.coords[this.x][this.y].stocks[resource] = 0;
  	}
  	
  	view.refreshPeoplePanel();
  	view.refreshLandPanel();
  	view.displayGuidance(this);
  	};
  
  this.divest = function(resource) {
  	
  	this.loyalty.player--;
  	this.prestige -= 5;
  	if (worldMap.coords[this.x][this.y].stocks[resource] === undefined) {
  		worldMap.coords[this.x][this.y].stocks[resource] = this.inv[resource];
  	} else {
  		worldMap.coords[this.x][this.y].stocks[resource] += this.inv[resource];
  	}
  	this.inv[resource] = 0;
  	gameClock.guidancePoints -= 10;
  	
  	view.refreshPeoplePanel();
  	view.refreshLandPanel();
  	view.refreshMinimapPanel();
  	view.displayGuidance(this);
  	
  	};
  
  this.work = function() {
    
    // will need to use regional availability function for mats
    
    var notification = '';
    var here = worldMap.coords[this.x][this.y]
    var job = this.job.site;
    var resource;
    var matNum = 0;
    var available = 0;
    var matsCheck = 0;
    var matsOnHand = 0;
    var matsInStock = 0;
    var matsLow = this.population;
    var toolsCheck = 0;
    var toolBonus = 1;
    var toolsLow = this.population;
    var materialCost = '';
    var toolBreak;
    var toolBreakNum;
    var breakage = '';
    var matsText = '';
    
    if (job.materials[0] === undefined) {
      matsCheck = 1;
    } else {
		for (m in job.materials) {
			resource = job.materials[m].key;
			console.log(resource,"on hand",this.inv[resource]);
			if (this.inv[resource] > 0) {
				matsOnHand = this.inv[resource];
			} else {
				matsOnHand = 0;
			}
			if (here.stocks[resource] > 0) {
				matsInStock = here.stocks[resource];
			} else {
				matsInStock = 0;
			}
			console.log(matsOnHand,matsInStock);
			if (matsOnHand < this.population && matsInStock > 0) {
				matNum = Math.min(matsInStock,this.population-matsOnHand);
				here.stocks[resource] -= matNum;
				if (matsOnHand === 0) {
					this.inv[resource] = matNum;
				} else {
					this.inv[resource] += matNum;
				}
				console.log("claiming");
				notification += "They take " + matNum + " " + job.materials[m].name + " from the stockpile.  "
			}
			if (this.inv[job.materials[m].key] > 0) {
				matsLow = Math.min(matsLow,this.population,this.inv[resource]);
			} else {
				matsLow = 0
			}
		}
		matsCheck = matsLow / this.population;
		matsText = '';
		for (m in job.materials) {
			this.inv[job.materials[m].key] -= matsLow;
			matsText += job.materials[m].name + " " ;
		}
		materialCost = ' consuming ' + matsLow + ' each of ' + matsText + 'and';
    }
    
    if (job.tools[0] === undefined) {
      toolsCheck = 1;
    } else {
      for (t in job.tools) {
      	if (this.inv[job.tools[t].key] !== undefined) {
      		toolsLow = Math.min(toolsLow,this.inv[job.tools[t].key]);
      	} else {
      		toolsLow = 0;
      	}
      }
      
      toolsCheck = toolsLow / this.population;
      
      if (Math.random() < 0.1) {
      	toolBreak = job.tools[Math.floor(Math.random()*job.tools.length)];
      	toolBreakNum = Math.ceil(this.inv[toolBreak.key]/[5,6,7][Math.floor(Math.random()*3)])
      	breakage = toolBreakNum + " " + toolBreak.plural + " are broken in the process!  ";
      }
    }
    
    if (job.bonusTools === undefined) {
      toolBonus = 1;
    } else {
      for (t in job.bonusTools) {
      	if (this.inv[job.bonusTools[t].key] !== undefined) {
      		toolBonus += this.inv[job.bonusTools[t].key];
      	}
      }
      
      toolBonus = 1 + Math.min(this.population,toolBonus) / this.population;
      
//       if (Math.random() < 0.1) {
//       	toolBreak = job.tools[Math.floor(Math.random()*job.tools.length)];
//       	toolBreakNum = Math.ceil(this.inv[toolBreak.key]/[5,6,7][Math.floor(Math.random()*10)])
//       	breakage = toolBreakNum + " " + toolBreak.plural + " are broken in the process!  ";
//       }
    }

    var primary = job.primaryProduce;
    var primaryQuantity = Math.floor(Math.min(matsCheck,toolsCheck) * job.primaryEfficiency * this.population * toolBonus * 100) / 100;
    var secondary = job.secondaryProduce[Math.floor(Math.random()*job.secondaryProduce.length)];
    var secondaryQuantity = Math.floor(Math.min(matsCheck,toolsCheck) * job.secondaryEfficiency * this.population * toolBonus * 100) / 100;
    
    if (primary === dataResources.mysteryOre) {
    	primary = worldMap.coords[this.x][this.y].veins[job.miningDepth][Math.floor(Math.random()*3)];
    }
    
    if (secondary === dataResources.mysteryLivestock) {
    	var husbandryAdvances = [dataAdvances.camelHerding,dataAdvances.caribouHerding,dataAdvances.cattleHerding,dataAdvances.chickenHusbandry,dataAdvances.falconry,dataAdvances.goatHerding,dataAdvances.horseHerding,dataAdvances.kennelry,dataAdvances.llamaHerding,dataAdvances.sheepHerding,dataAdvances.swineHusbandry];
    	var potentialLivestock = [];
    	for (i in husbandryAdvances) {
    		if (husbandryAdvances[i].biomes.indexOf(worldMap.coords[this.x][this.y].biome.name) !== -1 && this.advances[husbandryAdvances[i].key] > 0) {
    			potentialLivestock.push(dataResources[husbandryAdvances[i].livestock]);
    		}
    	}
    	if (potentialLivestock.length > 0) {
    		secondary = potentialLivestock[Math.floor(Math.random()*potentialLivestock.length)];
    	} else {
    		secondary = dataResources.food;
    	}
    	
    }
      
    notification += this.name + " works as " + job.job + "s," + materialCost + " producing " + primaryQuantity + " " + primary.plural + " and " + secondaryQuantity + " " + secondary.plural + ".  " + breakage;

    if (worldMap.coords[this.x][this.y].stocks[primary.key] > 0) {
    	worldMap.coords[this.x][this.y].stocks[primary.key] += primaryQuantity;
    } else {
    	worldMap.coords[this.x][this.y].stocks[primary.key] = primaryQuantity;
    }
      
    if (worldMap.coords[this.x][this.y].stocks[secondary.key] > 0) {
    	worldMap.coords[this.x][this.y].stocks[secondary.key] += secondaryQuantity; 
    } else {
    	worldMap.coords[this.x][this.y].stocks[secondary.key] = secondaryQuantity; 
    }
    
    this.notify(notification);
    
  };
  
  this.eat = function() {
    
    var notification = '';
    
    // will need update to regional resource claiming (claim function, too)
    
    var available = worldMap.coords[this.x][this.y].stocks.food;
    
    // Claiming food

    if (available > this.population) {
      
      notification = this.name + " claims food from the stockpile.";
      this.inv.food += this.population;
      worldMap.coords[this.x][this.y].stocks.food -= this.population;
      
    } else if (available > 0) {
      
      notification = this.name + " empties the stockpile.";
      this.inv.food += worldMap.coords[this.x][this.y].stocks.food;
      worldMap.coords[this.x][this.y].stocks.food = 0;
      
    } else {
      
      notification = this.name + " finds no food in the stockpile.";
      
    }
    
    // Butchering
    
    if (this.inv.food < this.population) {
    	var onTheHoof = [];
    	var butchered = {};
    	for (i in this.inv) {
    		if (dataResources[i].foodValue > 0) {
    			for (l=0; l < this.inv[i]; l++) {
    				onTheHoof.push(i);
    			}
    			butchered[i] = 0;
    		}
    	}
    	onTheHoof.sort(function() {return Math.random() > 0.5; });
    	for (i=0; i<onTheHoof.length;i++) {
    		this.inv[onTheHoof[i]]--;
    		this.inv.food += dataResources[onTheHoof[i]].foodValue;
    		butchered[onTheHoof[i]]++;
    		if (this.inv.food >= this.population) {
    			i = onTheHoof.length + 1;
    		}
    	}
    	var butcherStock = Object.keys(butchered);
    	if (butcherStock.length > 0) {
    		var butcheredList = [];
    		var butcheredText = '';
    		for (i in butchered) {
    			if (butchered[i] > 0) {
    				butcheredList.push(i);
    			}
    		}
    		for (i in butcheredList) {
    			butcheredText += butchered[butcheredList[i]] + " " + dataResources[butcheredList[i]].plural ;
    			if (i < butcheredList.length - 2) {
    				butcheredText += ", ";
    			} else if (i == butcheredList.length - 2) {
    				butcheredText += ", and ";
    			}
    		}
    		notification += "  " + this.name + " butchers " + butcheredText + "." ;
    	}
    }
    
    // Actually eating
    
    if (this.population > this.inv.food) {
      
      // Lean Season
      this.health = Math.max(0,this.health - 30 * (1 - (this.inv.food / this.population)));
      this.inv.food = 0;
      notification = notification + " They have a lean season, and are down to "+ Math.floor(this.health) + "% health.";
      
      // Starvation Losses
      if (this.health < 50 ) {
        
        var deaths = this.population - Math.ceil(this.population * this.health / 50) ;
        
        notification = notification + " They lose " + deaths  + " souls to starvation.";
        this.population = Math.floor(this.population - deaths);
        
        this.health = this.health + 20;
      }
      
      // Check for Population Death (this needs to be its own loop in a prune function)
      if (this.population === 0) {
        notification = notification + " They are no more.";
        
        for (var i in this.inv) {
          worldMap.coords[this.x][this.y].stocks[i] += this.inv[i] ;
        }
        
        worldMap.coords[this.x][this.y].units.splice(worldMap.coords[this.x][this.y].units.indexOf(this),1);
        pops.splice(pops.indexOf(this),1);
      }
      
    } else {
      
      // Eat Their Fill
      notification = notification + " They eat their fill.";
      this.inv.food -= this.population;
      
      // Heal
      if (this.health < 100) {
        this.health = Math.min(100,this.health+30);
        notification = notification + " They heal up to " + Math.floor(this.health) + "% health.";
      }
      
    }
    
    this.notify(notification);
  };
  
  this.claim = function() {
    
    // will need update to regional resource claiming (eat function, too)
    // will need update to consider relative values
    
    var availableStocks = [];
    
    for (var i in worldMap.coords[this.x][this.y].stocks) {
      if (worldMap.coords[this.x][this.y].stocks[i] > 0) {
        availableStocks.push(i);
      }
    }
    
    // Update local valueTable (if necessary)
    if (worldMap.coords[this.x][this.y].valueTableTime !== gameClock.turn) {
    	worldMap.coords[this.x][this.y].valueTableTime = gameClock.turn;
		worldMap.coords[this.x][this.y].valueTable = {};
	
		// Compile list of local resources
		for (var u in worldMap.coords[this.x][this.y].units) {
			for (var i in worldMap.coords[this.x][this.y].units[u].inv) {
				if (worldMap.coords[this.x][this.y].units[u].inv[i] > 0) {
					if (worldMap.coords[this.x][this.y].valueTable[i] > 0) {
						worldMap.coords[this.x][this.y].valueTable[i] += worldMap.coords[this.x][this.y].units[u].inv[i];
					} else {
						worldMap.coords[this.x][this.y].valueTable[i] = worldMap.coords[this.x][this.y].units[u].inv[i];
					}
				}
			}
		}
		for (var i in availableStocks) {
			if (worldMap.coords[this.x][this.y].valueTable[availableStocks[i]] > 0) {
				worldMap.coords[this.x][this.y].valueTable[availableStocks[i]] += worldMap.coords[this.x][this.y].stocks[availableStocks[i]];
			} else {
				worldMap.coords[this.x][this.y].valueTable[availableStocks[i]] = worldMap.coords[this.x][this.y].stocks[availableStocks[i]];
			}
		}
		
		// Calculate local scarcity to get base resource value
		var totalStocks = 0;
		for (i in worldMap.coords[this.x][this.y].valueTable) {
			totalStocks += worldMap.coords[this.x][this.y].valueTable[i];
		}
		for (i in worldMap.coords[this.x][this.y].valueTable) {
			worldMap.coords[this.x][this.y].valueTable[i] = totalStocks / worldMap.coords[this.x][this.y].valueTable[i];
		}
	
		// Now double the value of resources used as tools, bonusTools, and mats in work sites here
		for (i in worldMap.coords[this.x][this.y].sites) {
			var resources = [];
			resources = resources.concat(worldMap.coords[this.x][this.y].sites[i].site.tools);
			resources = resources.concat(worldMap.coords[this.x][this.y].sites[i].site.bonusTools);
			resources = resources.concat(worldMap.coords[this.x][this.y].sites[i].site.materials);
			for (n in resources) {
				if (worldMap.coords[this.x][this.y].valueTable[resources[n].key] > 0) {
					worldMap.coords[this.x][this.y].valueTable[resources[n].key] *= 2;
				}
			}
		}
		
		// Apply resources' Force and Move modifiers to their values
		for (i in worldMap.coords[this.x][this.y].valueTable) {
			if (dataForceItems[i] > 0) {
				worldMap.coords[this.x][this.y].valueTable[i] *= 1 + dataForceItems[i]/4;
			}
		}
		for (i in worldMap.coords[this.x][this.y].valueTable) {
			if (dataMoveItems[i] > 0) {
				worldMap.coords[this.x][this.y].valueTable[i] *= 1 + dataMoveItems[i];
			}
		}
		
	}
    
    var claim = availableStocks[Math.floor(Math.random()*availableStocks.length)];
    
    if (claim === undefined) {
    	notification = this.name + " does not find anything in the stockpile worth claiming.";
    } else {
		var claimNum = Math.ceil(Math.min(this.population,worldMap.coords[this.x][this.y].stocks[claim]/2));
	
		worldMap.coords[this.x][this.y].stocks[claim] -= claimNum;
	
		if (this.inv[claim] === undefined) {
		  this.inv[claim] = claimNum;
		} else {
		  this.inv[claim] += claimNum;
		}
		
		notification = this.name + " claims " + claimNum + " " + dataResources[claim].plural + ".";

    }
    
    if (worldMap.coords[this.x][this.y].links.length > 0) {
    	var tradeAway;
    	var tradeAwayNum;
    	var tradeFor;
    	var tradeForNum;
    	var tradeLink = worldMap.coords[this.x][this.y].links[Math.floor(Math.random()*worldMap.coords[this.x][this.y].links.length)];
    	var tradeTarget = tradeLink.destination;
    	var comparedValuesTable = {};
    	
    	if (tradeTarget.units.length == 0) {
    		tradeTarget.valueTable = {};
    		notification += "  Their traders travel to " + tradeTarget.name + " ("+tradeTarget.x+","+tradeTarget.y+") and finds the place deserted!";
    	}
    	    	
    	for (i in this.inv) {
    		if (tradeTarget.valueTable[i] > 0 && this.inv[i] > 1) {
    			comparedValuesTable[i] = tradeTarget.valueTable[i] / worldMap.coords[this.x][this.y].valueTable[i] ;
    		} else if (this.inv[i] > 1) {
    			comparedValuesTable[i] = 1000;
    		}
    	}
    	for (i in tradeTarget.stocks) {
    		if (worldMap.coords[this.x][this.y].valueTable[i] > 0 && tradeTarget.stocks[i] > 1 && tradeTarget.valueTable[i] > 0) {
    			comparedValuesTable[i] = tradeTarget.valueTable[i] / worldMap.coords[this.x][this.y].valueTable[i] ;
    		} else if (tradeTarget.stocks[i] > 1 && tradeTarget.valueTable[i] > 0) {
    			comparedValuesTable[i] = .001;
    		}
    	}
    	
    	// Get the resource with the highest Comparative Value (most valuable there / least valuable here)
    	tradeAway = Object.keys(comparedValuesTable).reduce(function(a, b){ return comparedValuesTable[a] > comparedValuesTable[b] ? a : b });
    	
    	// Get the resource with the lowest Comparative Value (most valuable here / least valuable there)
    	tradeFor = Object.keys(comparedValuesTable).reduce(function(a, b){ return comparedValuesTable[a] < comparedValuesTable[b] ? a : b });
    	
    	tradeAwayNum = Math.floor(this.inv[tradeAway] / 4);
    	
    	if (comparedValuesTable[tradeAway] === 1000 || comparedValuesTable[tradeFor] === .001) {
    		tradeAwayNum = 1;
    		tradeForNum = Math.floor(tradeTarget.stocks[tradeFor] / 3);
    	} else {
	    	tradeForNum = Math.floor(tradeAwayNum * comparedValuesTable[tradeAway] / comparedValuesTable[tradeFor]);
	    	
	    	// Make sure we're not trading for more than they've got
			if (tradeForNum > tradeTarget.stocks[tradeFor]) {
				tradeForNum = Math.floor(tradeTarget.stocks[tradeFor]);
				tradeAwayNum = Math.floor(tradeForNum * comparedValuesTable[tradeFor] / comparedValuesTable[tradeAway]);
			}
	    }
    	
    	if (tradeAwayNum > 0 && tradeForNum > 0 && tradeAway !== tradeFor) {
    		// Reduce and increase inventory and stocks
			this.inv[tradeAway] -= tradeAwayNum;
			tradeTarget.stocks[tradeFor] -= tradeForNum;
		
			if (tradeTarget.stocks[tradeAway] > 0) {
				tradeTarget.stocks[tradeAway] += tradeAwayNum;
			} else {
				tradeTarget.stocks[tradeAway] = tradeAwayNum;
			}
		
			if (this.inv[tradeFor] > 0) {
				this.inv[tradeFor] += tradeForNum;
			} else {
				this.inv[tradeFor] = tradeForNum;
			}
		
			notification += "  Their traders travel to " + tradeTarget.name + ", trading " + tradeAwayNum + " " + dataResources[tradeAway].plural + " for " + tradeForNum + " " + dataResources[tradeFor].plural + ".";

    	} else if (tradeTarget.units.length == 0) {
    	
    		tradeFor = [];
    		
    		for (i in tradeTarget.stocks) {
    			if (tradeTarget.stocks[i] >= 1) {
    				tradeFor.push(i);
    			}
    		}
    		
    		if (tradeFor.length > 0) {
				tradeFor = tradeFor[Math.floor(Math.random()*tradeFor.length)];
				tradeForNum = Math.floor(tradeTarget.stocks[tradeFor]);
		
				tradeTarget.stocks[tradeFor] = 0;
		
				if (this.inv[tradeFor] > 0) {
					this.inv[tradeFor] += tradeForNum;
				} else {
					this.inv[tradeFor] = tradeForNum;
				}
				notification += " The traders help themselves to " + tradeForNum + " " + tradeFor + " from the abandoned village.";
			} else {
			
				worldMap.coords[this.x][this.y].links.splice(worldMap.coords[this.x][this.y].links.indexOf(tradeLink),1);
				
				notification += " With no one remaining to trade with, the trade link falls into disuse.";
			}
    	}
    }

    this.notify(notification);
  
  };
  
  this.share = function() {
    
    var neighbors = [];
    
    for (var i in worldMap.coords[this.x][this.y].units) {
      if (worldMap.coords[this.x][this.y].units[i] != this) {
        neighbors.push(worldMap.coords[this.x][this.y].units[i],worldMap.coords[this.x][this.y].units[i],worldMap.coords[this.x][this.y].units[i]);
      }
    }
    
    if (this.x > 0) {
      neighbors = neighbors.concat(worldMap.coords[this.x-1][this.y].units);
    }
    
    if (this.y > 0 ) {
      neighbors = neighbors.concat(worldMap.coords[this.x][this.y-1].units);
    }
    
    if (this.x < worldMap.prefs.size_x-1) {
      neighbors = neighbors.concat(worldMap.coords[this.x+1][this.y].units);
    }
    
    if (this.y < worldMap.prefs.size_y-1) {
      neighbors = neighbors.concat(worldMap.coords[this.x][this.y+1].units);
    }
    
    if (neighbors.length === 0) {
      notification = this.name + " has no neighbors to share with!";
      
    } else {
    
	  // Sharing!
	  
      var targetPop = neighbors[Math.floor(Math.random()*neighbors.length)];
      var sharingRites = this.rites;
      var sharingAdvances = this.advances;
      
      if (Math.random() > 0.8 && this.values.piety !== undefined && sharingRites.length > 0) { // share a rite
        var rite = sharingRites[Math.floor(Math.random()*sharingRites.length)];
        if (targetPop.rites.indexOf(rite) === -1) {
          targetPop.rites.push(rite);
//           rite.power += 1;
          rite.practitioners.push(targetPop);
          notification = this.name + " shares the "+rite.name+" with " + targetPop.name + "."
          var shared = 1;
        }
      
        
      } else if (Math.random() > 0.9 && Object.keys(sharingAdvances).length > 1) { // share an advance
        var advancesList = Object.keys(sharingAdvances);
        advancesList.splice(0,1);
        var advance = advancesList[Math.floor(Math.random()*advancesList.length)]
        if (targetPop.advances[advance] === undefined) {
          targetPop.advances[advance] = 1;
          notification = this.name + " shares the " + dataAdvances[advance].name + " advance with " + targetPop.name + ".";
          var shared = 1;
        } else if (targetPop.advances[advance] < this.advances[advance]) {
          targetPop.advances[advance]++;
          notification = this.name + " shares the " + dataAdvances[advance].name + " " + targetPop.advances[advance] + " advance with " + targetPop.name + ".";
          var shared = 1;
        }
      }
      
      if (shared != 1) { //share a value
        var value = Object.keys(this.values)[Math.floor(Math.random()*Object.keys(this.values).length)];
        if (targetPop.values[value] === undefined) {
          targetPop.values[value] = this.values[value] / 2 ;
          notification = this.name + " teaches " + targetPop.name + " about " + value + ".";
        } else if (targetPop.values[value] > this.values[value]) {
          targetPop.values[value] = (targetPop.values[value] + this.values[value])/2;
          notification = this.name + " shares their views with " + targetPop.name + ", dampening their stance on " + value + ".";
        } else {
          targetPop.values[value] = (targetPop.values[value] + this.values[value])/2;
          notification = this.name + " shares their views with " + targetPop.name + ", emboldening their stance on " + value + ".";
        }
      }
      targetPop.notify(notification);
    }
    
    this.notify(notification);
    
  };
  
  this.impulse = function() {
    
    var impulse = {};
    
    for (var i in this.values) {
      impulse[i] = this.values[i] - Math.random()*100;
    }
    
    var withinRange = this.withinRange();
    if (this.values.inquiry > 0 && this.familiarTiles.length < withinRange.length) {
    	impulse.scout = this.values.inquiry - 20 - Math.random()*100;
    }
    
    if (this.prestige < 1 || this.health < 50 ) {
      // will eventually need to check for freedom of movement
      impulse.migration =  this.prestige * -1 * (50/this.health) ;
    }
    
    if (this.job.site.primaryProduce !== dataResources.food && this.inv.food + worldMap.coords[this.x][this.y].stocks.food < this.population/10) {
      // will eventually need to check for freedom of movement
      impulse.migration =  this.prestige * -1 * (50/this.health) ;
    }
    
    if (this.population < 10 && this.prestige < 50) {
    	impulse.assimilate = 100 - this.prestige - this.population;
    }
    
    if (this.job.site.primaryProduce === dataResources.food) {
    	impulse.jobChange = (this.inv.food/this.population)*100 - Math.random()*100 ;
    }
    
    if (this.lastProduce < this.population) {
    	impulse.jobChange = 100 * this.lastProduce / this.population;
    	this.lastSeason += this.name + " is disappointed with their work produce.  "
    }
    
    if (this.inv.food < 1 && worldMap.coords[this.x][this.y].stocks.food < 1 && this.job.site.primaryProduce != dataResources.food) {
      impulse.growFood = Math.random()*100;
    }
    
    // OMG the Build Impulse
    var canBuild = []; // Work Sites
    var canRaise = []; // Communal Buildings
    var canErect = []; // Places of Worship
    var canLink = []; // Trade Links
    for (i in this.advances) {
    	if (i !== 'failures') {
			for (l = 1 ; l < this.advances[i]+1 ; l++) {
				if (dataAdvances[i].unlocks[l].type === "site") {
					canBuild.push(dataAdvances[i].unlocks[l].key);
				}
				if (dataAdvances[i].unlocks[l].type === "building") {
					canRaise.push(dataAdvances[i].unlocks[l].key);
				}
				if (dataAdvances[i].unlocks[l].type === "shrine") {
					canErect.push(dataAdvances[i].unlocks[l].key);
				}
				if (dataAdvances[i].unlocks[l].type === "link") {
					canLink.push(dataAdvances[i].unlocks[l].key);
				}
			}
		}
    }
    var builtHere = [];
    for (i in worldMap.coords[this.x][this.y].sites) {
    	builtHere.push(worldMap.coords[this.x][this.y].sites[i].site);
    }
    var letsBuild = [];
    var matsCheck = 0;
    for (i in canBuild) {
    	if (builtHere.indexOf(dataSites[canBuild[i]]) === -1) {
    		matsCheck = 0;
    		for (m in dataSites[canBuild[i]].buildCost) {
    			if (this.inv[m] > dataSites[canBuild[i]].buildCost[m]) {
    				matsCheck = 1;
    			}
    		}
    		if (matsCheck === 1) {
    			letsBuild.push(canBuild[i]);
    		}
    	}
    }
    if (letsBuild.length > 0) {
    	impulse.build = 75;
    	letsBuild = letsBuild[Math.floor(Math.random()*letsBuild.length)];
    }
    
    // Are there tiles this unit is familiar with to which there are no trade links?
    if (canLink.length > 0) {
    	existingRoutes = [];
    	noRoutes = [];
    	for (i in worldMap.coords[this.x][this.y].links) {
    		existingRoutes.push(worldMap.coords[this.x][this.y].links[i].destination);
    	}
    	for (i in this.familiarTiles) {
    		if (existingRoutes.indexOf(this.familiarTiles[i]) === -1 && this.familiarTiles[i] !== worldMap.coords[this.x][this.y]) {
    			noRoutes.push(this.familiarTiles[i]);	
    		}
    	}
    }
    
    // Setting Link-related impulses
    if (canLink.length > 0 && noRoutes.length === 0 && this.familiarTiles.length < withinRange.length/2) {	
    	if (impulse.scout > 0) {
    		impulse.scout += 20;
    	} else {
    		impulse.scout = 20;
    	}
    } else if (canLink.length > 0) {
    	// find a good tile to link to and set an impulse for it (based on value?)
    	var goodRoutes = [];
    	localValueTable = worldMap.coords[this.x][this.y].valueTable;
    	for (i in noRoutes) {
    		for (r in worldMap.coords[noRoutes[i].x][noRoutes[i].y].valueTable) {
    			if (localValueTable[r] > 0) {
    				if (worldMap.coords[noRoutes[i].x][noRoutes[i].y].valueTable[r] < localValueTable[r] * 0.8) {
    					goodRoutes.push({destination:worldMap.coords[noRoutes[i].x][noRoutes[i].y], r:r, v:localValueTable[r] / worldMap.coords[noRoutes[i].x][noRoutes[i].y].valueTable[r]});
    				}
    			} else {
    				goodRoutes.push({destination:worldMap.coords[noRoutes[i].x][noRoutes[i].y], r:r, v:25});
    			}
    		}
    	}
    	if (goodRoutes.length > 0) {
    		var letsLink = goodRoutes[Math.floor(Math.random()*goodRoutes.length)];
    		impulse.link = 2 * letsLink.v;
    	}
    }
    
    // End Build Impulse
    
     // can add other impulses (migration/survival/rebellion) in here
    
    impulse = Object.keys(impulse).reduce(function(a, b){ return impulse[a] > impulse[b] ? a : b });
    
    if (this.prestige > 100 && worldMap.coords[this.x][this.y].units.length > 1) {
    	impulse = "prestige";
    }
    
    this.lastSeason += " " + this.name + " has a " + impulse + " impulse. ";
    notification = this.name + "has an impulse that didn't go off: " + impulse;
    
    if (impulse === "jobChange") {
      this.impulse.jobChange(this);
    } else if (impulse === "matriarchy") {
      this.impulse.matriarchy(this);
    } else if (impulse === "patriarchy") {
      this.impulse.patriarchy(this);
    } else if (impulse === "neutrarchy") {
      this.impulse.neutrarchy(this);
    } else if (impulse === "piety") {
      this.impulse.piety(this);
    } else if (impulse === "authority") {
      this.impulse.authority(this);
    } else if (impulse === "inquiry") {
      this.impulse.inquiry(this);
    } else if (impulse === "scout") {
      this.impulse.scout(this);
    } else if (impulse === "aggression") {
      this.impulse.aggression(this);
    } else if (impulse === "migration") {
      this.impulse.migration(this);
    } else if (impulse === "growFood") {
      this.impulse.growFood(this);
    } else if (impulse === "assimilate") {
      this.impulse.assimilate(this);
    } else if (impulse === "prestige") {
      this.impulse.prestige(this);
    } else if (impulse === "build") {
      this.build(letsBuild);
    } else if (impulse === "link") {
      this.link(letsLink.destination,dataLinks.overland);
    } 
    
  };
  
  this.impulse.jobChange = function(pop,resource) {
  
    // Extra credit rewrite: value of the primary resources to be produced?
    
    var sites = worldMap.coords[pop.x][pop.y].sites;
    var spaceAvailable = 0;
    var goodSites = [];
    var poorSites = [];
    var badSites = [pop.job];
    
    for (i in sites) {
    	if (sites[i].site.tools.length !== 0 && sites[i].site.materials.length !== 0 ) { // requires tools and materials
    		for (m in sites[i].site.materials) {
    			if (pop.inv[sites[i].site.materials[m].key] === undefined && worldMap.coords[pop.x][pop.y].stocks[sites[i].site.materials[m].key] === undefined) {
    				available = 0;
    			} else if (worldMap.coords[pop.x][pop.y].stocks[sites[i].site.materials[m].key] === undefined) {
    				available = pop.inv[sites[i].site.materials[m].key];
    			} else if (pop.inv[sites[i].site.materials[m].key] === undefined ) {
    				available = worldMap.coords[pop.x][pop.y].stocks[sites[i].site.materials[m].key];
    			} else {
    				available = pop.inv[sites[i].site.materials[m].key] + worldMap.coords[pop.x][pop.y].stocks[sites[i].site.materials[m].key];
    			}
    			if (pop.population < available) {
    				goodSites.push(sites[i]);
    			} else if (available > 0) {
    				poorSites.push(sites[i]);
    			} else {
    				badSites.push(sites[i]);
    			}
    		}
    		for (t in sites[i].site.tools) {
    			if (pop.population < pop.inv[sites[i].site.tools[t].key]) {
    				goodSites.push(sites[i]);
    			} else if (pop.inv[sites[i].site.tools[t].key] > 0) {
    				poorSites.push(sites[i]);
    			} else {
    				badSites.push(sites[i]);
    			}
    		}
    		
    	} else if (sites[i].site.materials.length !== 0) { // requires materials
    		for (m in sites[i].site.materials) {
    			if (pop.inv[sites[i].site.materials[m]] === undefined && worldMap.coords[pop.x][pop.y].stocks[sites[i].site.materials] === undefined) {
    				available = 0;
    			} else if (worldMap.coords[pop.x][pop.y].stocks[sites[i].site.materials] === undefined) {
    				available = pop.inv[sites[i].site.materials[m]];
    			} else if (pop.inv[sites[i].site.materials[m]] === undefined ) {
    				available = worldMap.coords[pop.x][pop.y].stocks[sites[i].site.materials];
    			} else {
    				available = pop.inv[sites[i].site.materials[m]] + worldMap.coords[pop.x][pop.y].stocks[sites[i].site.materials];
    			}
    			if (pop.population < available) {
    				goodSites.push(sites[i]);
    			} else if (available > 0) {
    				poorSites.push(sites[i]);
    			} else {
    				badSites.push(sites[i]);
    			}
    		}
    	} else if (sites[i].site.tools.length !== 0) { // requires tools
    		for (t in sites[i].site.tools) {
    			if (pop.population < pop.inv[sites[i].site.tools[t].key]) {
    				goodSites.push(sites[i]);
    			} else if (pop.inv[sites[i].site.tools[t].key] > 0) {
    				poorSites.push(sites[i]);
    			} else {
    				badSites.push(sites[i]);
    			}
    		}
    	} else { // requires no tools or materials
    		goodSites.push(sites[i]);
    		
    	}
    	
    	spaceAvailable = sites[i].capacity;
    	
    	for (u in worldMap.coords[pop.x][pop.y].units) {
    		if (worldMap.coords[pop.x][pop.y].units[u].job === sites[i]) {
    			spaceAvailable -= worldMap.coords[pop.x][pop.y].units[u].population;
    		}
    	}
    	
    	if (this.population > spaceAvailable) {
    		badSites.push(sites[i]);
    	}
    	
    	if (resource !== undefined && sites[i].site.primaryProduce.key !== resource) {
    		badSites.push(sites[i]);
    	}
    }
    
    goodSites = goodSites.filter(function(value) {return badSites.indexOf(value) === -1}) ;
    poorSites = poorSites.filter(function(value) {return badSites.indexOf(value) === -1}) ;
    
    if (goodSites.length > 0) {
    	pop.assign(goodSites[Math.floor(Math.random()*goodSites.length)]);
    } else if (poorSites.length > 0) {
    	pop.assign(poorSites[Math.floor(Math.random()*poorSites.length)]);
    } else {
    	notification = pop.name + " wants to work elsewhere, but doesn't have the tools or materials.";
    	pop.prestige -= 10;
    	for (i in pop.loyalty) {
    		pop.loyalty[i] -= 1;
    	}
    	pop.notify(notification);
    }
    
    
  };
  
  this.impulse.matriarchy = function(pop) {
    
    var targets = [];
    var superiors = [];
    
    for (var i in worldMap.coords[pop.x][pop.y].units) {
      if (worldMap.coords[pop.x][pop.y].units[i].demographics.gender != "Women") {
        targets.push(worldMap.coords[pop.x][pop.y].units[i]);
      } else if (worldMap.coords[pop.x][pop.y].units[i].demographics.gender === "Women") {
        superiors.push(worldMap.coords[pop.x][pop.y].units[i]);
      }
    }
    
    if ((pop.demographics.gender === "mixed" || pop.demographics.gender === "Breeders") && pop.population > 1) {
    
      pop.splitByType("matriarchy");
      
    } else if (pop.demographics.gender === "Women" && targets.length > 0) {
      var targetPop = targets[Math.floor(Math.random()*targets.length)];
      var potentialTribute = Object.keys(targetPop.inv);
      var tribute = potentialTribute[Math.floor(Math.random()*potentialTribute.length)];
      var tributeNum = Math.ceil(targetPop.inv[tribute]/2);
      
      
      targetPop.inv[tribute] -= tributeNum;
      if (pop.inv[tribute] === undefined) {
      	pop.inv[tribute] = tributeNum;
      } else {
      	pop.inv[tribute] += tributeNum;
      }
      
      pop.prestige += 1;
      
      if (Math.random()*100 > targetPop.values.matriarchy) {
        // add matriarchs to disposition shit-list
		targetPop.dispositions.negative.shift();
		targetPop.dispositions.negative.push(pop);
      }
      
      notification = pop.name + " celebrates their mothers by exacting " + tributeNum + " " + dataResources[tribute].plural + " as tribute from the " + targetPop.name + ".";
      
    } else if (pop.demographics.gender != "Women" && superiors.length > 0) {
      var targetPop = superiors[Math.floor(Math.random()*superiors.length)];
      var potentialTribute = Object.keys(pop.inv);
      var tribute = potentialTribute[Math.floor(Math.random()*potentialTribute.length)];
      var tributeNum = Math.ceil(pop.inv[tribute]/2);
      
      pop.inv[tribute] -= tributeNum;
      if (targetPop.inv[tribute] === undefined) {
      	targetPop.inv[tribute] = tributeNum;
      } else {
      	targetPop.inv[tribute] += tributeNum;
      }

      // Add inferiors to superior's disposition like list
      targetPop.dispositions.positive.shift();
      targetPop.dispositions.positive.push(pop);
      
      targetPop.prestige += 1;
      
      notification = pop.name + " celebrates their mothers by offering " + tributeNum + " " + dataResources[tribute].plural + " as tribute to the "+ targetPop.name +".";
    } else {
      
      var potentialTribute = Object.keys(pop.inv);
      var tribute = potentialTribute[Math.floor(Math.random()*potentialTribute.length)];
      var tributeNum = Math.ceil(pop.inv[tribute]/4) ;
      
      pop.inv[tribute] -= tributeNum;
      pop.values.matriarchy -= Math.ceil(Math.random()*3);
      
      notification = pop.name + " celebrates their mothers in a modest ceremony, consuming " + tributeNum + " " + dataResources[tribute].plural + ".";
    }
    
	pop.notify(notification);
  };

  this.impulse.patriarchy = function(pop) {
    
    var targets = [];
    var superiors = [];
    
    for (var i in worldMap.coords[pop.x][pop.y].units) {
      if (worldMap.coords[pop.x][pop.y].units[i].demographics.gender === "Women") {
        targets.push(worldMap.coords[pop.x][pop.y].units[i]);
      } else if (worldMap.coords[pop.x][pop.y].units[i].demographics.gender === "Men") {
        superiors.push(worldMap.coords[pop.x][pop.y].units[i]);
        
      }
    }
    
    if ((pop.demographics.gender === "mixed" || pop.demographics.gender === "Breeders") && pop.population > 1) {
    
      pop.splitByType("patriarchy");
      
    } else if (pop.demographics.gender === "Men" && targets.length > 0) {
      var targetPop = targets[Math.floor(Math.random()*targets.length)];
      var potentialTribute = Object.keys(targetPop.inv);
      var tribute = potentialTribute[Math.floor(Math.random()*potentialTribute.length)];
      var tributeNum = Math.ceil(targetPop.inv[tribute]/2);
      
      targetPop.inv[tribute] -= tributeNum;
      if (pop.inv[tribute] === undefined) {
      	pop.inv[tribute] = tributeNum;
      } else {
      	pop.inv[tribute] += tributeNum;
      }
      
      pop.prestige += 1;
      
      if (Math.random()*100 > targetPop.values.patriarchy) {
			// add patriarchs to disposition shit-list
			targetPop.dispositions.negative.shift();
			targetPop.dispositions.negative.push(pop);
      }
      
      notification = pop.name + " celebrates their fathers by exacting " + tributeNum + " " + dataResources[tribute].plural + " as tribute from the " + targetPop.name + ".";
      
    } else if (pop.demographics.gender != "Men" && superiors.length > 0) {
      var targetPop = superiors[Math.floor(Math.random()*superiors.length)];
      var potentialTribute = Object.keys(pop.inv);
      var tribute = potentialTribute[Math.floor(Math.random()*potentialTribute.length)];
      var tributeNum = Math.ceil(pop.inv[tribute]/2);
      
      pop.inv[tribute] -= tributeNum;
      if (targetPop.inv[tribute] === undefined) {
      	targetPop.inv[tribute] = tributeNum;
      } else {
      	targetPop.inv[tribute] += tributeNum;
      }
      
      // Add inferiors to superior's disposition like list
      targetPop.dispositions.positive.shift();
      targetPop.dispositions.positive.push(pop);
      
      targetPop.prestige += 1;
      
      notification = pop.name + " celebrates their fathers by offering " + tributeNum + " " + dataResources[tribute].plural + " as tribute to the "+ targetPop.name +".";
    } else {
      
      var potentialTribute = Object.keys(pop.inv);
      var tribute = potentialTribute[Math.floor(Math.random()*potentialTribute.length)];
      var tributeNum = Math.ceil(pop.inv[tribute]/4) ;
      
      pop.inv[tribute] -= tributeNum;
      pop.values.patriarchy -= Math.ceil(Math.random()*3);
      
      notification = pop.name + " celebrates their fathers in a modest ceremony, consuming " + tributeNum + " " + dataResources[tribute].plural + ".";
    }
	pop.notify(notification);
  };
  
  this.impulse.neutrarchy = function(pop) {
    
    var targets = [];
    var superiors = [];
    
    for (var i in worldMap.coords[pop.x][pop.y].units) {
      if (worldMap.coords[pop.x][pop.y].units[i].demographics.gender != "Neuter") {
        targets.push(worldMap.coords[pop.x][pop.y].units[i]);
      } else if (worldMap.coords[pop.x][pop.y].units[i].demographics.gender === "Neuter") {
        superiors.push(worldMap.coords[pop.x][pop.y].units[i]);
        
      }
    }
    
    if (pop.demographics.fertility === "mixed" && pop.population > 1) {

    
      pop.splitByType("neutrarchy");      
      
    } else if (pop.demographics.fertility === "Celibate" && targets.length > 0) {
      var targetPop = targets[Math.floor(Math.random()*targets.length)];
      var potentialTribute = Object.keys(targetPop.inv);
      var tribute = potentialTribute[Math.floor(Math.random()*potentialTribute.length)];
      var tributeNum = Math.ceil(targetPop.inv[tribute]/2);
      
      targetPop.inv[tribute] -= tributeNum;
      if (pop.inv[tribute] === undefined) {
      	pop.inv[tribute] = tributeNum;
      } else {
      	pop.inv[tribute] += tributeNum;
      }
      
      pop.prestige += 1;
      
      if (Math.random()*100 > targetPop.values.neutrarchy) {
			// add neuters to disposition shit-list
			targetPop.dispositions.negative.shift();
			targetPop.dispositions.negative.push(pop);
      }
      
      notification = pop.name + " celebrates their celibates by exacting " + tributeNum + " " + dataResources[tribute].plural + " as tribute from the " + targetPop.name + ".";
      
    } else if (pop.demographics.fertility != "Celibate" && superiors.length > 0) {
      var targetPop = superiors[Math.floor(Math.random()*superiors.length)];
      var potentialTribute = Object.keys(pop.inv);
      var tribute = potentialTribute[Math.floor(Math.random()*potentialTribute.length)];
      var tributeNum = Math.ceil(pop.inv[tribute]/2);
      
      pop.inv[tribute] -= tributeNum;
      if (targetPop.inv[tribute] === undefined) {
      	targetPop.inv[tribute] = tributeNum;
      } else {
      	targetPop.inv[tribute] += tributeNum;
      }
      
      // Add inferiors to superior's disposition like list
      targetPop.dispositions.positive.shift();
      targetPop.dispositions.positive.push(pop);
      
      targetPop.prestige += 1;
      
      notification = pop.name + " celebrates their celibates by offering " + tributeNum + " " + dataResources[tribute].plural + " as tribute to the "+ targetPop.name +".";
    } else {
      
      var potentialTribute = Object.keys(pop.inv);
      var tribute = potentialTribute[Math.floor(Math.random()*potentialTribute.length)];
      var tributeNum = Math.ceil(pop.inv[tribute]/4) ;
      
      pop.inv[tribute] -= tributeNum;
      pop.values.neutrarchy -= Math.ceil(Math.random()*3);
      
      notification = pop.name + " celebrates their celibates in a modest ceremony, consuming " + tributeNum + " " + dataResources[tribute].plural + ".";
    }
	pop.notify(notification);
  };
  
  this.impulse.authority = function(pop) {
    var targets = [];
    var superiors = [];
    for (var i in worldMap.coords[pop.x][pop.y].units) {
      if (worldMap.coords[pop.x][pop.y].units[i].prestige < pop.prestige) {
        targets.push(worldMap.coords[pop.x][pop.y].units[i]);
      } else if (worldMap.coords[pop.x][pop.y].units[i].prestige > pop.prestige) {
        superiors.push(worldMap.coords[pop.x][pop.y].units[i]);
      }
    }
      
    if (pop.population > 1 && targets.length < 1 && superiors.length < 2) {
    
      pop.splitByType('authority');

      
    } else if (targets.length < 1 && superiors.length > 0) {
      var targetPop = superiors[Math.floor(Math.random()*superiors.length)]
      pop.values.authority -= 1;
      targetPop.prestige += 1;

      var potentialTribute = Object.keys(pop.inv);
      var tribute = potentialTribute[Math.floor(Math.random()*potentialTribute.length)];
      var tributeNum = Math.ceil(pop.inv[tribute]/2);
      
      pop.inv[tribute] -= tributeNum;
      if (targetPop.inv[tribute] === undefined) {
      	targetPop.inv[tribute] = tributeNum;
      } else {
      	targetPop.inv[tribute] += tributeNum;
      }
      
      // Add servants to superior's disposition like list
      targetPop.dispositions.positive.shift();
      targetPop.dispositions.positive.push(pop);
            
      notification = pop.name + " serves " + targetPop.name + ", spending " + tributeNum + " " + dataResources[tribute].plural + " in the process.";
      
    } else if (targets.length > 0) {
      
      var targetPop = targets[Math.floor(Math.random()*targets.length)];
      targetPop.prestige -= 1;

      var potentialTribute = Object.keys(targetPop.inv);
      var tribute = potentialTribute[Math.floor(Math.random()*potentialTribute.length)];
      var tributeNum = Math.ceil(targetPop.inv[tribute]/2);
      
      targetPop.inv[tribute] -= tributeNum;
      if (pop.inv[tribute] === undefined) {
      	pop.inv[tribute] = tributeNum;
      } else {
      	pop.inv[tribute] += tributeNum;
      }
      
      if (Math.random()*100 > targetPop.values.authority) {
      		// Add raiders to raidTarget's dispositions shit-list
			targetPop.dispositions.negative.shift();
			targetPop.dispositions.negative.push(pop);
      }
      
      notification = pop.name + " exacts "+tributeNum+" "+dataResources[tribute].plural+" as tribute from the "+targetPop.name+", as is their right.";
      
    } else {
      console.log(pop);
      notification = pop.name + " finds a weird edge-case.";
    }
    
    
	pop.notify(notification);
  };
  
  this.impulse.piety = function(pop) {
    
    localRites = [];
    notification = pop.name + " has a pious impulse.";
    
    for (i in worldMap.coords[pop.x][pop.y].units) {
      localRites = localRites.concat(worldMap.coords[pop.x][pop.y].units[i].rites);
    }
    
    if (Math.random()< 1/(1+pop.rites.length) ) { // attempt to create new rite
    	
    	pop.design();
      
    } else if (Math.random() < localRites.length / 20 && localRites.length > 1) { // syncretize rites
      var riteA = pop.rites[Math.floor(Math.random()*pop.rites.length)];
      var otherRites = localRites.slice();
      otherRites.splice(otherRites.indexOf(riteA),1);
      var riteB = otherRites[Math.floor(Math.random()*otherRites.length)];
      
      pop.synthesize(riteA,riteB);
      
    } else { // enact rite
      
      var rite = pop.rites[Math.floor(Math.random()*pop.rites.length)]
      
      notification = pop.name + " enacts the " + rite.name + ".";
      
      rite.enact(pop);
    }
    
  };
  
  this.impulse.inquiry = function(pop) {
    
    var currentSites = worldMap.coords[pop.x][pop.y].sites;
    
    if (pop.inv.food > currentSites.length*10 && pop.inv.simpleTool > currentSites.length*5) {
    	pop.prospect();
    } else {
		var sacrifice = Object.keys(pop.inv)[Math.floor(Math.random()*Object.keys(pop.inv).length)];
		pop.experiment(sacrifice);
    }
    
    
  };
  
  this.impulse.scout = function(pop) {
  	var tiles = pop.withinRange();
  	var scoutDestinations = [];
  	var scoutDestination;
  	
  	for (i in tiles) {
  		if (pop.familiarTiles.indexOf(tiles[i].tile) === -1) {
  			scoutDestinations.push(tiles[i].tile);
  		}	
  	}
  	scoutDestination = scoutDestinations[Math.floor(Math.random()*scoutDestinations.length)];
  	if (scoutDestination === undefined) {
  		console.log("No destination for scouting...");
  		pop.impulse.inquiry(pop);
  	} else {
  		pop.scout(scoutDestination);
  	}
  };
  
  this.impulse.aggression = function(pop) {
  
  	var tiles = pop.withinRange();
  	var raidDestination;
  	var undefendedTiles = [];
  	var potentialTargets = [];
  	var raidTargets = [];
  	var hatedTargets = [];
  	var targetPop;
  	var targetPile;
  	var pile = 0;
  	
  	for (i in tiles) {
  		potentialTargets = potentialTargets.concat(tiles[i].tile.units);
  		pile = 0;
  		for (n in tiles[i].tile.stocks) {
  			pile += tiles[i].tile.stocks[n];
  		}
  		if (tiles[i].tile.units.length === 0 && pile > 0) {
  			undefendedTiles.push({x:tiles[i].x,y:tiles[i].y});
  		}
  	}

  	// Add additional entries to potentialTargets if they appear on the raiders' shit-list
  	for (i in potentialTargets) {
  		hatedTargets = hatedTargets.concat(pop.dispositions.negative.filter(function(pop) {return pop === potentialTargets[i]}));
  	}
  	potentialTargets = potentialTargets.concat(hatedTargets);
  	
  	if (potentialTargets.length === 0) {
  		potentialTargets = worldMap.coords[pop.x][pop.y].units.slice();
  		potentialTargets.splice(potentialTargets.indexOf(pop),1);
  	}
  	
  	targetPop = potentialTargets[Math.floor(Math.random()*potentialTargets.length)];
  	targetPile = undefendedTiles[Math.floor(Math.random()*undefendedTiles.length)];
  	
  	if (targetPop === undefined && targetPile === undefined & pop.population > 1) {
  		pop.splitByType("aggression");
		pop.notify(notification);
  	} else if (targetPop === undefined && targetPile === undefined) {
  		notification = pop.name + ' has no targets and is alone with futilely aggressive thoughts.';
		pop.notify(notification);
  	} else if (targetPile !== undefined) {
  		pop.raid(targetPile.x,targetPile.y);
  	} else if (targetPop !== undefined) {
  		pop.raid(targetPop.x,targetPop.y);
  	}
  	  	    
  };
  
  this.impulse.growFood = function(pop) {
  	
  	pop.impulse.jobChange(pop,"food");
    
  };
  
  this.impulse.migration = function(pop) {
  
  	var tiles = pop.withinRange();
  	
  	if (tiles.length > 0) {
  		var targetTile = tiles[Math.floor(Math.random()*tiles.length)];
  		
  		pop.migrate(targetTile.x,targetTile.y);
  		
  	} else {
  		notification = pop.name + " wants to migrate away, but there is nowhere to go.";
  		
  		if (pop.loyalty.player !== undefined) {
  			pop.loyalty.player = Math.floor(pop.loyalty.player/2);
  		}
  	}
  };
  
  this.impulse.assimilate = function(pop) {
  	var superiors = [];
  	for (i in worldMap.coords[pop.x][pop.y].units) {
  		potential = worldMap.coords[pop.x][pop.y].units[i];
  		if (potential.prestige > pop.prestige && potential.demographics.gender === pop.demographics.gender && potential.demographics.fertility === pop.demographics.fertility) {
  			superiors.push(worldMap.coords[pop.x][pop.y].units[i]);
  		}
  	}
  	if (superiors.length === 0 ) {
  		pop.impulse.jobChange(pop);
  	} else {
  		var superior = superiors[Math.floor(Math.random()*superiors.length)];
  		var missingValues = [];
  		var diffValues = {};
  		var valueDifference = 0;
  		for (i in superior.values) {
  			if (pop.values[i] === undefined) {
  				missingValues.push(i);
  			} else {
  				diffValues[i] = superior.values[i] - pop.values[i];
  				valueDifference += superior.values[i] - pop.values[i];
  			}
  		}
  		if (missingValues.length !== 0) {
  			// adopts a value
  			var valueName = missingValues[Math.floor(Math.random()*missingValues.length)];
  			pop.values[valueName] = superior.values[valueName] + (Math.random()-0.5)*50;
  			notification = pop.name + " adopts the " + dataValues[valueName].name + " value of their superiors, the " + superior.name + ".";
  		} else if (valueDifference > 50 && valueDifference > -50) {
  			// shifts a value
  			diffValues = Object.keys(diffValues);
  			var valueName = diffValues[Math.floor(Math.random()*diffValues.length)];
  			pop.values[valueName] = (pop.values[valueName] + superior.values[valueName]) / 2;
  			notification = pop.name + " shifts their value of " + dataValues[valueName].name + " towards that of their superiors, the " + superior.name + ".";
  		} else {
  			var popNum = Math.ceil(pop.population * (100 - valueDifference)/100 );
  			superior.prestige -= popNum;
  			for (i in diffValues) {
  				pop.values[i] =  pop.values[i] + (pop.values[i] - superior.values[i])/2;
  				superior.values[i] = (superior.values[i]*superior.population + pop.values[i]*popNum ) / (superior.population + popNum);
  			}
  			pop.population -= popNum;
  			superior.population += popNum;
  			notification = popNum + " members abandon the " + pop.name + " and find acceptance among the " + superior.name + ", adopting their ways.";
  			
  			if (pop.population < 1) {
  			pops.splice(pops.indexOf(pop),1);
  			worldMap.coords[pop.x][pop.y].units.splice(worldMap.coords[pop.x][pop.y].units.indexOf(pop),1);
  			notification += "  The population is no more."
  			}
  		}
  	}
  	
  	pop.notify(notification);
  };
  
  this.impulse.prestige = function (pop) {
  	var lessPrestige = pop.prestige - 100;
  	var prestigeName = ["Royal","Noble","Ascendant","Exalted","Great","High"][Math.floor(Math.random()*6)];
  	var tileSuffix = ["land","lund","iland","borough","boro","bury","by","don","den","ex","ham","holm","howe","ness","istan","stan","stead","thorp","thorpe","tun","ton","wold","weald","wick","wich","worth"][Math.floor(Math.random()*26)];
  	var newTileName = pop.people.name + tileSuffix;
  	for (i in worldMap.coords[pop.x][pop.y].units) {
  		worldMap.coords[pop.x][pop.y].units[i].prestige -= lessPrestige;
  	}
  	
  	notification = pop.name + " claim ascendancy over " + worldMap.coords[pop.x][pop.y].name + " and rename it " + newTileName + ".  ";
  	worldMap.coords[pop.x][pop.y].name = newTileName
  	
  	for (i in worldMap.coords[pop.x][pop.y].stocks) {
  		if (worldMap.coords[pop.x][pop.y].stocks[i] > 0) {
			if (pop.inv[i] > 0) {
				pop.inv[i] += Math.ceil(worldMap.coords[pop.x][pop.y].stocks[i] / 2);
			} else {
				pop.inv[i] = Math.ceil(worldMap.coords[pop.x][pop.y].stocks[i] / 2);
			}
			worldMap.coords[pop.x][pop.y].stocks[i] = Math.floor(worldMap.coords[pop.x][pop.y].stocks[i] / 2);
			notification += "They claim " + Math.ceil(worldMap.coords[pop.x][pop.y].stocks[i] / 2) + " " + dataResources[i].plural + ".  ";
  		}
  	}
  	
  	notification += pop.name + " style themselves " + prestigeName + " " + pop.people.name + ".";
  	pop.name = prestigeName + " " + pop.people.plural;
  	
  	pop.notify(notification);
  };
  
  this.season = function(pop) {
  	var season = gameClock.season();
  	
  	if (season === "Winter") {
  		pop.season.winter(pop);
  	}

  };
  
  this.season.spring = function(pop) {
  };
  
  this.season.summer = function(pop) {
  };
  
  this.season.autumn = function(pop) {
  };
  
  this.season.winter = function(pop) {
  	var mates = 0;
  	var targetGender;
  	var targetFertility;
  	var popGrowth;
  	var tilePop = 0;
  	
  	for (i in worldMap.coords[pop.x][pop.y].units) {
  		targetGender = worldMap.coords[pop.x][pop.y].units[i].demographics.gender;
  		targetFertility = worldMap.coords[pop.x][pop.y].units[i].demographics.fertility;
  		if (targetGender === "mixed" && targetFertility !== "Celibate") {
  			mates += worldMap.coords[pop.x][pop.y].units[i].population / 2;
  		} else if ( targetGender !== pop.demographics.gender && targetGender !== "Neuters"  && targetFertility !== "Celibate") {
  			mates += worldMap.coords[pop.x][pop.y].units[i].population;
  		} else if (targetGender === "Genderqueers" && pop.demographics.gender === "Genderqueers" && targetFertility !== "Celibate") {
  			mates += worldMap.coords[pop.x][pop.y].units[i].population;
  		}
  		tilePop =+ worldMap.coords[pop.x][pop.y].units[i].population;
  	}
  	
  	if (pop.demographics.fertility === "Celibate") {
  		popGrowth = tilePop * .01 * pop.prestige / 20;
  	} else {
  		popGrowth = pop.population * Math.min(0.3,0.1 * mates / pop.population);
  	}
  	
  	if (Math.random < popGrowth-Math.floor(popGrowth)) {
  		popGrowth = Math.ceil(popGrowth);
  	} else {
  		popGrowth = Math.floor(popGrowth);
  	}
  	
  	pop.population += popGrowth;
  	
  	if (popGrowth > 0 && pop.demographics.fertility !== "Celibate") {
  		notification = pop.name + " sees " +popGrowth+ " young people come of age and join them in adulthood.";
  	} else if (popGrowth > 0 && pop.demographics.fertility === "Celibate") {
  		notification = pop.name + " sees " +popGrowth+ " new celibates join their ranks.";
  	} else if (mates/pop.population < .2 && pop.demographics.fertility !== "Celibate") {
  		notification = "With so few mates available, " + pop.name + " sees no new members come of age this year.";
  	} else if (pop.demographics.fertility === "Celibate") {
  		notification = pop.name + " sees no new celibates join their ranks this year.";
  	} else {
  		notification = pop.name + " sees no new members come of age this year.";
  	}
  	
    pop.notify(notification);
      	
  };
  
};