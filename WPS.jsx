/*
 Radiation Estimator is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

// WPSService.jsx
import React, { useState, useEffect } from "react";
import "./WPSService.css"; // Import the CSS file for styling

const WPSService = ({ formData, ref, setShowPrevention }) => {
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const myHeaders = {
      "Content-Type": "application/xml",
      "Access-Control-Allow-Origin": "*",
    };

    const raw = `<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<wps:Execute version=\"1.0.0\" service=\"WPS\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://www.opengis.net/wps/1.0.0\" xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns:wps=\"http://www.opengis.net/wps/1.0.0\" xmlns:ows=\"http://www.opengis.net/ows/1.1\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:wcs=\"http://www.opengis.net/wcs/1.1.1\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xsi:schemaLocation=\"http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd\">\n    <ows:Identifier>gs:DoseReconstruction</ows:Identifier>\n    <wps:DataInputs>\n        <wps:Input>\n            <ows:Identifier>code</ows:Identifier>\n            <wps:Data>\n                <wps:LiteralData>feab09</wps:LiteralData>\n            </wps:Data>\n        </wps:Input>\n        <wps:Input>\n            <ows:Identifier>route</ows:Identifier>\n            <wps:Data>\n                <wps:ComplexData mimeType=\"application/json\">\n                    <![CDATA[${JSON.stringify(
      formData.geoJson
    )}]]>\n                </wps:ComplexData>\n            </wps:Data>\n        </wps:Input>\n        <wps:Input>\n            <ows:Identifier>ageGroup</ows:Identifier>\n            <wps:Data>\n                <wps:LiteralData>${
      formData.ageGroup
    }</wps:LiteralData>\n            </wps:Data>\n        </wps:Input>\n        <wps:Input>\n            <ows:Identifier>stadiumFoetus</ows:Identifier>\n            <wps:Data>\n                <wps:LiteralData>${
      formData.stadiumFoetus
    }</wps:LiteralData>\n            </wps:Data>\n        </wps:Input>\n        <wps:Input>\n            <ows:Identifier>calculation</ows:Identifier>\n            <wps:Data>\n                <wps:LiteralData>0</wps:LiteralData>\n            </wps:Data>\n        </wps:Input>\n    </wps:DataInputs>\n    <wps:ResponseForm>\n        <wps:RawDataOutput>\n            <ows:Identifier>result</ows:Identifier>\n        </wps:RawDataOutput>\n    </wps:ResponseForm>\n</wps:Execute>`;
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://entw-imis.lab.bfs.de/dosrek-duGh9aeh?/wps", requestOptions)
      .then((response) => {
        setLoading(true);
        return response.text();
      })
      .then((objRes) => {
        console.log(objRes);
        setLoading(false);
        setShowResult(true);
        setResult(JSON.parse(objRes));
      })
      .catch((error) => setError(error));
  }, []);

  const clearAll = (e) => {
    window.location.reload();
  };

  return (
    <div className="WPSServiceContainer">
      <p>WPS Result:</p>
      {loading && <p className="LoadingMessage">Loading...</p>}
      {/* {error && <p className="ErrorMessage">Error: {error.message}</p>} */}
      {showResult && result && (
        <>
          <pre className="WPSResult">Eff Dose: {result["eff_dose"]}</pre>
          <pre className="WPSResult">
            Red Bone Marrow: {result["red_bone_marrow"]}
          </pre>
          <pre className="WPSResult">Thyroid: {result["thyroid"]}</pre>
        </>
      )}

      <button onClick={clearAll} className="SubmitButton">
        Clear All
      </button>
    </div>
  );
};

export default WPSService;
