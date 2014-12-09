//Detect Cluster Types
clustering = {};
clustering.differentiateGroups = function (obj){
	var sortList = [];
	var diffs = {};
	for(var i in obj){
		sortList.push(obj[i]);
	}
	sortList.sort(function(a,b){
   		return a - b;
	});
	for(var i=0; i<sortList.length-1;i++){
		var value1 = sortList[i];
		var value2 = sortList[i+1];
		var diff = Math.abs(Math.abs(value1) - Math.abs(value2));
		if(diffs[diff.toString()] == undefined){
			diffs[diff.toString()] = 1;
		}else{
			diffs[diff.toString()] = diffs[diff.toString()] + 1;
		}
	}
	return diffs;
}
//Form clusters as identifiable groups and outliers
clustering.nearness = function (obj){
	var clusterBounds = clustering.differentiateGroups(obj);
	var bound = 0; 
	var weight = 0;
	for(var i in clusterBounds){
		if(clusterBounds[i] >= weight && Number(i) > bound){
			bound = Number(i);
			weight = clusterBounds[i];
		}
	}
	
	var sortList = [];
	var hashList = {};
	var nameList = {};
	var out = [];
	for(var i in obj){
		nameList[i] = "outlier";
		sortList.push(obj[i]);
		if(hashList[obj[i]] == undefined){
			hashList[obj[i]] = [i];
		}else{
			hashList[obj[i]].push(i);
		}
	}
	sortList.sort(function(a,b){
   		return a - b;
	});
	var activeCluster = false;
	var currentCluster;
	for(var i=0; i<sortList.length-1;i++){
		var value1 = sortList[i];
		var value2 = sortList[i+1];
		var diff = Math.abs(Math.abs(value1) - Math.abs(value2));
		if(diff <= bound){
			if(activeCluster == false){
				currentCluster = {};
				out.push(currentCluster);
				activeCluster = true;
			}
			
			var vals = hashList[value1].concat(hashList[value2]);
			for(var n in vals){
				var value = vals[n];
				delete nameList[value];
				currentCluster[value] = diff;
			}
		}else{
			
			activeCluster = false;
		}
	}
	return {"clusters":out, "outliers": nameList};
}