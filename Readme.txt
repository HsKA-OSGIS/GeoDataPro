Deployment Instructions 
How to Deploy
To get the project up and running on your local machine, follow these simple steps:
1.	Open Command Prompt: Navigate to the project's root directory using the command prompt or terminal.
2.	Install Dependencies: Execute the command npm install to download and install all the necessary packages and dependencies for the project.
3.	Start the Project: Once the dependencies are installed, run the command npm start. This will start the local server and launch the project in your default web browser.
4.	CORS Unblocker Setup: To handle Cross-Origin Resource Sharing (CORS) issues, use the Google Chrome extension for CORS unblocking. After installing the extension, left-click and then right-click on its icon. Navigate to "Extra Options" -> "Overwrite 4xx status code for this tab" -> "Enable on This Tab". This setup is essential for the proper functioning of the project.
Project Workflow Overview
Code Flow
•	Initial Entry: The application initializes in the App.js file and begins by loading the MapComponent.
•	Map Creation: Within MapComponent, we employ OpenLayers to craft our map. This involves utilizing OpenLayers' Map, Layer, and Draw objects.
•	User Interaction: Users start by drawing a LineString layer. Selection within the MapComponent then transitions to the RadiationEstimator component.
•	Data Handling: OpenLayers uses a unique geojson format. We convert this into the required geojson structure for our application. This includes capturing user selections for pregnancy status, age group, and the drawn LineString layer, which are stored in the React state.
•	Form Submission: Post-selection, users submit the data, leading them to the PreventionTaken component. This component offers multiple checkboxes representing additional parameters needed for the Web Processing Service (WPS) connection.
•	Final Submission: After selection, these fields are incorporated into the previously created geojson in the React state. The user then submits this data, triggering a frontend request to the WPS. The results are fetched and displayed in a few seconds.
Additional Features
•	Restart Process: Users can reset and restart the process at any time by clicking the "Clear All" button.
•	Geocoding Utility: For users needing to specify start and end locations, the project includes search bars integrated with the OpenRouteService (ORS) tools API. This feature automatically calculates and displays the shortest route.
