trendingMarketDataTable = (function(d3) {
	  var data =[],
	      initialized = false,
	      appendTo,
	      dataTableObj,
	      component = {};

	  function initializeChart(){
	    if ($.fn.dataTable.isDataTable(appendTo)) {
	    	$(appendTo).dataTable().fnDestroy();
		}
	    initialized = true;
	  }
	  function renderChart(){
			$.fn.dataTableExt.sErrMode = 'console';
			dataTableObj = $(appendTo).DataTable({
				data: data,
				"searching": false,
				"bLengthChange": false,
				"bPaginate": true,
				"order" : [ [ 4, "asc" ] ],
				"bInfo":false,
				"columnDefs": [{
					className: "dt-left",
					"width": "20%",
					"targets": 0
				}, {
					className: "dt-left",
					"width": "20%",
					"targets": 1
				}, {
					className: "dt-right",
					"width": "20%",
					"targets": 2
				}, {
					className: "dt-right",
					"width": "20%",
					"targets": 3
				}, {
					className: "dt-right",
					"width": "20%",
					"targets": 4
				}],
				columns: [{
					data:'exchange'
				},{
					data: 'market'
				},{
					data: 'price'
				},{
					data: 'lowprice'
				},{
					data: 'percent'
				}]
			});
	  }

	  function deleteChart(){
		  if ($.fn.dataTable.isDataTable(appendTo)) {
			  $(appendTo).dataTable().fnDestroy();
		  }
	  }

	  component.init = function(options){
	    if(options.appendTo)
	      appendTo = options.appendTo;
	    data = options.data;
	    initializeChart();
	  };

	  component.show = function(){
	    renderChart(); //calls function to render the chart
	  };

	  component.update = function(arg, pallete){
		  data = arg;
		  colors = pallete;
		  updateChart();
	  };

	  component.destroy = function(){
		  deleteChart();
	  };

	  component.isInitialized = function(){
		  return initialized;
	  };

	  return component;

	})(d3);
