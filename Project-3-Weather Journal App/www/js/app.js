// OpenWeatherMap API
const personalKey = 'dc82af56ba14fd38a7e2db7ec561b9bf';
const baseURL1 = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const baseURL2 = ',us&units=imperial&appid=';

const createWeatherURL = ( zipCode ) => {

	return baseURL1 + zipCode + baseURL2 + personalKey;

};

// Function used to get weather data from OpenWeatherMap API
const getWeatherInfo = async ( zipCode ) => {

	const weatherURL = createWeatherURL( zipCode ); // Create valid API URL
	const response = await fetch( weatherURL ); // Get weather info from OpenWeatherMap.org

	try{

		const weatherData = await response.json(); // Convert response to JSON and store
		weatherData.zipCode = zipCode; // Store selected zip code in return data
		
		// Exit promise chain if zip code is not found on OpenWeatherMap API
		if( weatherData.cod == 404 ){

			return Promise.reject( weatherData.message );

		}

		return weatherData;

	}catch( error ){

		console.log( error );

	}

};

// Function for posting app data to the server
const postAppData = async ( weatherData ) => {

	// Get user input
	const feelings = document.querySelector( '#feelings' ).value;

	// Create data for app entry
	const date = new Date();
	const entryID = date.getTime();
	const dateString = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;

	const appData = {
		'entryID': entryID,
		'date': dateString,
		'zipCode': weatherData.zipCode,
		'name': weatherData.name,
		'temp': weatherData.main.temp,
		'feelings': feelings
		};

	const response = await fetch( '/upload', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify( appData )
		});

	try{

		const returnData = await response.json();
		return returnData.entryID;

	}catch( error ){

		console.log( error );

	}

};

// Function for getting app data from the server
const getAppData = async () => {

	const response = await fetch( '/all' );

	try{

		const appData = await response.json(); // Convert response to JSON and store
		return appData;

	}catch( error ){

		console.log( error );

	}

};

// Update app UI with the app data
const updateUI = async ( appData ) => {

	let allEntries = "";

	for( const entry of appData.reverse() ){

		const journalEntry = `
		<div class="journalEntry">
			<div id="date">${entry.date}</div>
			<div id="city">${entry.name}</div>
			<div id="temp">${entry.temp}°F</div>
			<div id="content">${entry.feelings}</div>
		</div>
		`;

		allEntries += journalEntry;

	}
	
	if( allEntries != "" ){

		document.querySelector( '#entryHolder' ).innerHTML = allEntries;

	}else{

		document.querySelector( '#entryHolder' ).innerHTML = "Your journal is currently empty.";

	}

};

// Main function used to add a journal entry to the app
const addJournalEntry = () => {

	// Store user input
	const zipCode = document.querySelector( '#zip' ).value;
	const feelings = document.querySelector( '#feelings' ).value;

	// Simple form validation for zip code
	if( zipCode.length == 5 && !isNaN( zipCode ) ){

		// Simple form validation for feelings
		if( feelings.length > 0 ){

			// Get weather info, post data to server, and return entry from server
			getWeatherInfo( zipCode )
				.then( ( weatherData ) => { return postAppData( weatherData ); } )
				.then( () => { return getAppData(); } )
				.then( ( appData ) => { updateUI( appData );} )
				.catch( ( error ) => { alert( error ); } );

		}else{

			alert( "Please enter your feelings." );
			document.querySelector( '#feelings' ).focus();

		}
	
	}else{

		alert( 'Please enter a valid 5 digit zip code.' );
		document.querySelector( '#zip' ).focus();

	}

};

// Add event listeners when the page is ready
document.addEventListener( 'DOMContentLoaded', () => {

	// Add functionality to 'Generate' button via click event listener
	document.querySelector( '#generate' ).addEventListener( 'click', addJournalEntry );

	// Load existing journal entries
	getAppData()
		.then( ( appData ) => { updateUI( appData ); } );

});
