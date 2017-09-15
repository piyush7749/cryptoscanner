var marketScanner = {
	volume: 1000000,
	marketList: [],
	selectedMarket: "BitTrex",
	percentageDrop: 10.00,
	numHistoricDays: 3,
	currentMarketData: [],
	historicLowCountsData: [],
	trendingCoinsList: [],
	pageFuncs: {
		initPageLoad: function(){
			// marketScanner.pageFuncs.loadMarketListDropdown();
			marketScanner.pageFuncs.refreshMarketData();
		},
		refreshMarketData: function(){
			var promise = marketScanner.pageFuncs.getMarkets();
			promise.done(function(){
				var promise1 = marketScanner.pageFuncs.loadCurrentMarketData();
				promise1.done(function(){
					var promise2 = marketScanner.pageFuncs.loadHistoricMarketData();
					promise2.done(function(){
						marketScanner.pageFuncs.calculatePercentageDrop();
						// setTimeout(marketScanner.pageFuncs.refreshMarketData, 60000);
					});
				});
			})
		},
		getMarkets: function(){
			var deferredObject = $.Deferred();
			var plnxList = [];
			var bittrexList = [];
			if(marketScanner.marketList.length === 0){
					marketData.BitTrex.forEach(function(d,i){
						var exchangeArr = d.split("_");
						var o = {};
						o.fromCoin = exchangeArr[1];
						o.toCoin = exchangeArr[0];
						o.market = "BitTrex";
						marketScanner.marketList.push(o);
					})
					marketData.Poloniex.forEach(function(d,i){
						var exchangeArr = d.split("_");
						var o = {};
						o.fromCoin = exchangeArr[1];
						o.toCoin = exchangeArr[0];
						o.market = "Poloniex";
						marketScanner.marketList.push(o);
						if(i === marketData.Poloniex.length -1){
								deferredObject.resolve();
						}
					})
				}else{
					deferredObject.resolve();
				}
				return deferredObject.promise();
		},
		loadCurrentMarketData: function(){
			// call the API to get current price based on input Params
			var deferredObject = $.Deferred();
			marketScanner.currentMarketData.length = 0;
			marketScanner.marketList.forEach(function(d,i){
				var currentMarketPath = "https://min-api.cryptocompare.com/data/price?fsym=" + d.fromCoin + "&tsyms=" 		+ d.toCoin + "&e=" + d.market;
				$.ajax({
					type: "GET",
					url: currentMarketPath,
					crossDomain: true,
					success: function(data){
						if(!data.Response){
							var o = {};
							o.fromCoin = d.fromCoin;
							o.toCoin = d.toCoin;
							o.price = data[o.toCoin];
							o.market = d.market;
							marketScanner.currentMarketData.push(o);
						}
						if(i === marketScanner.marketList.length - 1){
							deferredObject.resolve();
						}
					}
				})
			})
			return deferredObject.promise();
		},
		loadHistoricMarketData: function(){
			// call the API to get historic price based on input Params
			var deferredObject = $.Deferred();
			marketScanner.historicLowCountsData.length = 0;
			marketScanner.marketList.forEach(function(d,i){
				var histPath = "https://min-api.cryptocompare.com/data/histoday?fsym=" + d.fromCoin + "&tsym=" + d.toCoin + "&e=" + d.market+ "&limit=10&aggregate=1";
				$.ajax({
					type: "GET",
					url: histPath,
					crossDomain: true,
					success: function(data){
						if(data.Response === "Success"){
							var histData = data.Data;
							histData.pop();
							histData.sort(function(a, b) {
									return parseFloat(a.low) - parseFloat(b.low);
							});
							marketScanner.currentMarketData.forEach(function(d1){
								if(d1.fromCoin === d.fromCoin && d1.toCoin === d.toCoin && d1.market === d.market){
									d1.lowPrice = histData[0].low;
								}
							})
						}
						if(i === marketScanner.marketList.length - 1){
							deferredObject.resolve();
						}
					}
				})
			})
			return deferredObject.promise();
		},
		calculatePercentageDrop: function(){
			marketScanner.trendingCoinsList.length = 0;
			marketScanner.currentMarketData.forEach(function(d){
								//calculate percentage change - ((y2 - y1) / y1)*100
								var percentDrop = ((d.price - d.lowPrice) / d.lowPrice)*100;
								if(percentDrop <= -1){
									var o = {};
									o.exchange = d.fromCoin + "/" + d.toCoin;
									o.price = d.price;
									o.percent = percentDrop.toFixed(2);
									o.market = d.market;
									o.lowprice = d.lowPrice;
									marketScanner.trendingCoinsList.push(o);
								}
				marketScanner.pageFuncs.loadMarketTable();
			})
		},
		loadMarketTable: function(){
			trendingMarketDataTable.init({ appendTo: "#trendingMarketTable", data: marketScanner.trendingCoinsList});
			trendingMarketDataTable.show();
		}
	}
}
