/*
 Radiation Estimator is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import PreventionTaken from "./PreventionTaken";
import WPSService from "./WPS";

const RadiationEstimator = ({ data }) => {
  const [formData, setFormData] = useState({
    ageGroup: "A1",
    stadiumFoetus: "0",
    geoJson: {},
  });

  const [showPrevention, setShowPrevention] = useState(false);
  const [triggerWPS, setTriggerWPS] = useState(false);

  const handleFormSubmit = (e) => {
    console.log("Form submitted:", formData);
    setShowPrevention(true);
  };

  const ref = useRef();

  return (
    <div id="personaldata" className="TopLeftAlignment">
      <h1>Radiation Exposure Estimator</h1>
      <form name="FormPersonalData" ref={ref}>
        <h2>Personal Information:</h2>
        <div className="UnderPersInf">
          <div>
            <label className="elemName">Pregnancy---</label>
            <input
              className="elemValue"
              type="checkbox"
              name="stadiumFoetus"
              onChange={(e) => {
                if (e.target.checked)
                  setFormData((prevData) => ({
                    ...prevData,
                    stadiumFoetus: "1",
                  }));
                else
                  setFormData((prevData) => ({
                    ...prevData,
                    stadiumFoetus: "0",
                  }));
              }}
            />
            <label className="elemName">Alter</label>
            <select
              className="elemValue"
              name="ageGroup"
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  ageGroup: e.target.value,
                }))
              }
            >
              <option value="A1">&lt; 1 a</option>
              <option value="A2">1 - 2 a</option>
              <option value="A3">2 - 7 a</option>
              <option value="A4">7 - 12 a</option>
              <option value="A5">12 - 17 a</option>
              <option value="A6">&gt 17 a</option>
            </select>
          </div>
          <button
            type="button"
            className="SubmitButton"
            onClick={handleFormSubmit}
          >
            Submit
          </button>
        </div>
      </form>

      <PreventionTaken
        setTriggerWps={setTriggerWPS}
        data={data}
        showPrevention={showPrevention}
        setFormData={setFormData}
      />
      {triggerWPS && (
        <WPSService
          formData={formData}
          ref={ref}
          setShowPrevention={setShowPrevention}
        />
      )}
    </div>
  );
};

export default RadiationEstimator;
