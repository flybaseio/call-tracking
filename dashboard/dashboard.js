$( function() {
	var calls = $('#calls').epoch( {
		type: 'time.area', axes: ['left', 'bottom', 'right'],
		data: [ { values: [ { time: Date.now()/1000, y: 0 } ] } ]
	} );
	var numbers = $( '#numbers' ).epoch( { type: 'bar' } );
	var cities = $( '#cities' ).epoch( { type: 'bar' } );
	var stats = {
		cities: {},
		numbers: {}
	};

	var dashboard = new Flybase("YOUR-FLYBASE-API-KEY", "calltracking", "stats");

	dashboard.once('value', function (data) {
		updateStats( data );
	});

	dashboard.on( 'added', function (data ){
		updateStats( data );
	});

	function updateStats( data ){
		data.forEach( function( snapshot ){
			var row = snapshot.value();

			calls.push( [ { time: row.time, y: 1 } ] );

			var cityCount = stats.cities[ row.city ] || 0;
			stats.cities[ row.city ] = ++cityCount;

			var numberCount = stats.numbers[ row.number ] || 0;
			stats.numbers[ row.number ] = ++numberCount;
		});	

		var citiesData = [];
		for( var city in stats.cities ) {
			citiesData.push( { x: city, y: stats.cities[ city ] } );
		}
		cities.update( [ { values: citiesData } ] );

		var numbersData = [];
		for( var number in stats.numbers ) {
			numbersData.push( { x: number, y: stats.numbers[ number ] } );
		}
		numbers.update( [ { values: numbersData } ] );

	}

});