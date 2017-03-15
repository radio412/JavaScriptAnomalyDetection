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

var roundByPlace = function(n, place){
	return Math.round(n / place) * place;
}
//Form clusters as identifiable groups and outliers
clustering.nearness = function (obj){

	//find clusters
	var clusterBounds = clustering.differentiateGroups(obj);

	//find bound and weight
	/*var bound = 0;
	var weight = 0;
	console.log(clusterBounds);
	for(var i in clusterBounds){
		//we start with 0 for weight and bound since we assume two items that produce a 0 zero difference is a cluster?
		if(clusterBounds[i] > weight && Number(i) > bound){
			bound = Number(i);
			weight = clusterBounds[i];
			console.log("winner",i,"::","bound",bound," :: ","weight", weight);
		}
	}*/




	var sortList = [];
	var hashList = {};
	var nameList = {};
	var out = [];
	for(var i in obj){

		//add all values to as outliers until they're confirmed to be part of a cluster
		nameList[i] = "outlier";

		//build a set of the values as an array
		sortList.push(obj[i]);

		//create a hash of the object so we can do reverse look up of values and get the instances with the value
		if(hashList[obj[i]] == undefined){
			hashList[obj[i]] = [i];
		}else{
			hashList[obj[i]].push(i);
		}
	}

	//sort the sortList so it's a sorted...list. we use the sortList to "walk" through the values in the cluster recoginition.
	sortList.sort(function(a,b){
   		return a - b;
	});;


	//if there's an active cluster we add values to that cluster, otherwise there is a new cluster found
	var activeCluster = false;
	var currentCluster;

	//go through the sorted values
	for(var i=0; i<sortList.length-1;i++){
		var value1 = sortList[i];
		var value2 = sortList[i+1];

		//get the difference between the values
		var round1 = String(Math.round(value1)).length;
		var round2 = String(Math.round(value2)).length;
		//console.log(round2);
		var diff = Math.abs(Math.abs( roundByPlace(value1, round1*10) ) - Math.abs(roundByPlace( value2, round2*10 ) ));

		//if the difference is less than the agreeable bound, create a cluster. otherwise the value is outside the definition of a cluster
		if(diff == 0/*bound*/){

			//identify cluster
			if(activeCluster == false){
				currentCluster = {};
				out.push(currentCluster);
				activeCluster = true;
			}

			//since it's part of a cluster, remove it from the outlier list.
			var vals = hashList[value1].concat(hashList[value2]);
			for(var n in vals){
				var value = vals[n];
				delete nameList[value];
				currentCluster[value] = obj[value];//diff;
			}

		}else{
			//since we're a sorted list, we can be confident that we've got all the clusters so far. if a value no longer is part of an existing cluster it's time to move on and make a new cluster.
			activeCluster = false;
		}
	}
	for(var i in nameList){
		nameList[i] = obj[i];
	}
	//since we found all the clusters, outliers are anything left in the nameList array. easy.
	return {"clusters":out, "outliers": nameList};
}
