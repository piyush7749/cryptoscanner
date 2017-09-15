$(document).on('ready', function(e) {
	marketScanner.pageFuncs.initPageLoad();
});

$('#anomaliesTable').on('click', 'tr', function() {
	var parent = $(this).parent().prop("tagName");
	var segment = $(this).children()[0].innerHTML;
	if (parent == "TBODY") {
		$(this).siblings().removeClass("selected");
		$(this).addClass("selected");
		$("#segment-text").text(segment);
		currentSegmentData = getSegmentData(segment);
		updateLineChart(currentSegmentData);
	}
});

$(document).on('click', '.scale-type', function(e) {
	var selectedOptionText = $(this).text();
	$('#switch-scale-dropdown b').remove().appendTo($('#switch-scale-dropdown').text(selectedOptionText));
	scaleType = selectedOptionText;
	updateLineChart(currentSegmentData);
	e.stopPropagation();
});

$(document).on('click', '.outlier-formula', function(e) {
	var selectedOptionText = $(this).text();
	$('#formula-dropdown b').remove().appendTo($('#formula-dropdown').text(selectedOptionText));
  if(selectedOptionText.contains('1')) outlierMultiplier = 1;
  else if(selectedOptionText.contains('2')) outlierMultiplier = 2;
  else if(selectedOptionText.contains('3')) outlierMultiplier = 3;
  calculateAndPopulate();
  updateLineChart(currentSegmentData);
	e.stopPropagation();
});

$(document).on('click', '.week-type', function(e) {
	var selectedOptionText = $(this).text();
	$('#week-type-dropdown b').remove().appendTo($('#week-type-dropdown').text(selectedOptionText));
	if (selectedOptionText == "Only Weekdays") weekendsOnly = false;
	else weekendsOnly = true;
	updateLineChart(currentSegmentData);
});

$('input').on( 'keyup', function () {
  console.log("search called");
  anomaliesTable
      .columns(0)
      .search( this.value )
      .draw();
} );
