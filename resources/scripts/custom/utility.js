function loadingMask(){
	return {
		run: function(){
			console.log("Run called");
			$('#trendingMarketTable').hide();
			$('#table-spinner').show();
		},
		stop: function(){
			console.log("Stop called");
			$('#trendingMarketTable').show();
			$('#table-spinner').hide();
		}
	}
}
