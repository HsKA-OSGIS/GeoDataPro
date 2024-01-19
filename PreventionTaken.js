/*
 Radiation Estimator is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

// PreventionTaken.js
import React, { useEffect, useState } from "react";
import "./PreventionTaken.css"; // Import the CSS file

const PreventionTaken = ({
  setTriggerWps,
  data,
  showPrevention,
  setFormData,
}) => {
  const handleFormSubmit = (e) => {
    const updatedData = updatePropertiesInFeatureCollection(data);
    setFormData((prevData) => ({ ...prevData, geoJson: updatedData }));
    setTriggerWps(true);
    console.log(updatedData);
  };

  const [residence, setResidence] = useState("outside");
  const [preventions, setPreventions] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  function updatePropertiesInFeatureCollection() {
    // Ensure the input is a Feature Collection
    if (
      !data ||
      data.type !== "FeatureCollection" ||
      !Array.isArray(data.features)
    ) {
      throw new Error("Invalid GeoJSON Feature Collection.");
    }

    // Assuming there's only one feature in the collection (the LineString)
    const lineStringFeature = data.features[0];

    // Update properties or add new ones
    lineStringFeature.properties = {
      ...lineStringFeature.properties,
      actions: preventions.length > 0 ? preventions : [""],
      start: "track1",
      residence,
      begin: startDate,
      end: endDate,
    };

    return data;
  }

  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false, // Use 24-hour format
    };

    const [date, _] = dateString.split(", ");
    const [month, day, year] = date.split("-");
    const [year2, time] = year.split("T");

    const formattedDate = `${year2}.${day}.${month} ${time}`;
    return formattedDate;
  };

  return (
    <div className="prevention-container">
      {showPrevention && (
        <>
          <h2>Prevention Taken :</h2>
          <form name="PreventionTaken" className="create-course-form">
            <div>
              <label className="elemName">Mask Taken---</label>
              <input
                className="elemValue"
                type="checkbox"
                name="mask"
                onChange={(e) => {
                  if (e.target.checked)
                    setPreventions((prevData) => [
                      ...prevData,
                      "protecting_mask",
                    ]);
                }}
              />
            </div>
            <div>
              <label className="elemName">Iodine dose taken---</label>
              <input
                className="elemValue"
                type="checkbox"
                name="iodine"
                onChange={(e) => {
                  if (e.target.checked)
                    setPreventions((prevData) => [...prevData, "iodine"]);
                }}
              />
            </div>
            <div>
              <label className="elemName">Radiation Shield---</label>
              <input
                className="elemValue"
                type="checkbox"
                name="radiationShield"
                onChange={(e) => {
                  if (e.target.checked)
                    setPreventions((prevData) => [...prevData, "evacuation"]);
                }}
              />
            </div>

            <label className="elemName">Residence</label>
            <select
              className="elemValue"
              name="residence"
              onChange={(e) => setResidence(e.target.value)}
            >
              <option value="outside">Outside</option>
              <option value="house">House</option>
              <option value="basement">Basement</option>
            </select>

            <br />

            <label htmlFor="startDate">Start Date and Time:</label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              onChange={(e) => setStartDate(formatDate(e.target.value))}
            />

            <br />

            <label htmlFor="endDate">End Date and Time:</label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              onChange={(e) => setEndDate(formatDate(e.target.value))}
            />

            {/* Add the Submit button */}
            <button
              type="button"
              className="SubmitButton"
              onClick={handleFormSubmit}
            >
              Submit
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default PreventionTaken;
