var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
		

var options = {
	scaleGridLineWidth : 1,
	responsive: true
};		



var redraw = function(data, status, headers, config, InitFund){
	var labelsSet = loopLabelSet(data.Stock.Years);
	var datas = loopData(data.MonteResult, InitFund);
	
	
	var lineChartData = {
			labels : labelsSet,
			datasets : datas

		}
	
	var ctx = document.getElementById("canvas").getContext("2d");
	console.log("ChartHelper redraw");
	window.myLine = new Chart(ctx).Line(lineChartData, options);
	
	//conclusion data
	var conclusionData = calculateConclusionData(data.MonteResult, InitFund);
	
	var lineChartData = {
		labels : labelsSet,
		datasets : [composeConclusionDataSet(conclusionData)]

	}
	

	//draw conclusion chart
	var ctx = document.getElementById("conclusionCanvas").getContext("2d");
	window.myLine1 = new Chart(ctx).Line(lineChartData, options);
	
	
	return conclusionData[conclusionData.length-1];
	
}


function calculateConclusionData(data, InitFund){
	var result = [], temp = 0;
	//first push InitFund
	result.push(InitFund);
	var col_len = data.length;
	var row_len = data[0].length;
	
	for( i = 0; i < row_len; i++){
		//reset temp
		temp = 0;
		for( j = 0; j < col_len; j++){
			temp = temp + data[j][i];
		}
		temp = 1 + (temp / col_len);
		result.push(temp * result[result.length-1]);
	}
	return result;
}



function composeConclusionDataSet(conclusionData){
	var randomColor =  getRandomColor();
	var data = {
				label: labelName(i),
				fillColor : "rgba(220,220,220,0)",
				strokeColor : randomColor,
				pointColor :  randomColor,
				pointStrokeColor : "#fff",
				pointHighlightFill : randomColor,
				pointHighlightStroke : "rgba(220,220,220,1)",
				//data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
				data: conclusionData
			};
	return data;
}

//offset by increasing 1 because current year still needs a label		
var loopLabelSet = function(years){
	var labels = [];
	var year = new Date().getFullYear();
	for(i = 0; i<= years; i++){
		labels.push(year+i)
	}
	return labels;
}

var loopData = function(MonteResult, InitFund){
	var datas = [];
	for(i = 0; i< MonteResult.length; i++){
		var randomColor =  getRandomColor();
		var data = {
					label: labelName(i),
					fillColor : "rgba(220,220,220,0)",
					strokeColor : randomColor,
					pointColor :  randomColor,
					pointStrokeColor : "#fff",
					pointHighlightFill : randomColor,
					pointHighlightStroke : "rgba(220,220,220,1)",
					//data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
					data: calculateEachRun(MonteResult[i], InitFund)
				};
		
		
		
		datas.push(data);
	}
	
	return datas;

}

function calculateEachRun(MonteResultEachSet, InitFund){
	var result = [];
	//first time is fixed
	result.push(InitFund);
	for( j = 0; j<	MonteResultEachSet.length;j++){
		InitFund = InitFund * (1 + MonteResultEachSet[j]);
		result.push(InitFund);
	}
	return result;
}


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function labelName(i){
	return i + "th run";
}



//	window.onload = function(){
//		var ctx = document.getElementById("canvas").getContext("2d");
//		window.myLine = new Chart(ctx).Line(lineChartData, options);
//	}
	
destroyChart = function(){
	if(window.myLine!=null){
		window.myLine.destroy();
	}
	if(window.myLine1!=null){
		window.myLine1.destroy();
	}
}