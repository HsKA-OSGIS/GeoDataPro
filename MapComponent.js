/*
 Radiation Estimator is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

// MapComponent.js

import React, { useEffect, useState, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Draw from "ol/interaction/Draw";
import { fromLonLat } from "ol/proj";
import "./MapComponent.css"; // Import the CSS file
import RadiationEstimator from "./RadiationEstimator";
import olGeocoder from "ol-geocoder";
import GeoJSON from "ol/format/GeoJSON";

const MapComponent = () => {
  const [globalMap, setGlobalMap] = useState();
  // const [globalMapmap, setMap] = useState();
  // const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = globalMap;
  const [geoJson, setGeoJson] = useState({});

  const source = new VectorSource({ wrapX: false });

  const draw = new Draw({
    source: source,
    type: "LineString",
  });

  draw.on("drawend", (e) => {
    const feature = e.feature.clone();
    const data = createLineStringFeatureCollection(
      feature.getGeometry().transform("EPSG:3857", "EPSG:4326").flatCoordinates
    );
    setGeoJson(data);
  });

  const geocoderStart = new olGeocoder("nominatim", {
    provider: "osm",
    lang: "pt-BR", //en-US, fr-FR
    placeholder: "Start Destination",
    targetType: "text-input",
    limit: 5,
    keepOpen: true,
  });

  geocoderStart.on("addresschosen", (evt) => {
    localStorage.setItem("startCoord", [evt.place.lon, evt.place.lat]);
  });

  const geocoderEnd = new olGeocoder("nominatim", {
    provider: "osm",
    lang: "pt-BR", //en-US, fr-FR
    placeholder: "End Destination",
    targetType: "text-input",
    limit: 5,
    keepOpen: true,
  });

  geocoderEnd.on("addresschosen", async (evt) => {
    const startCoords = localStorage.getItem("startCoord");
    const res = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62487a57908baa1848cd9383922cf01275fe&start=${startCoords}&end=${evt.place.lon},${evt.place.lat}`,
      {
        headers: {
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        },
      }
    );

    const data = await res.json();

    const customGeoJson = {
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: {
          name: "EPSG:3857",
        },
      },
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: data.features[0].geometry.coordinates,
          },
        },
      ],
    };

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(customGeoJson, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }),
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    mapRef.current.addLayer(vectorLayer);

    const geocodeData = createLineStringFeatureCollectionFromGeocode(
      data.features[0].geometry.coordinates
    );
    setGeoJson(geocodeData);
  });

  function createLineStringFeatureCollection(coordinates) {
    // Ensure that coordinates is an array with an even number of elements
    if (
      !Array.isArray(coordinates) ||
      coordinates.length < 4 ||
      coordinates.length % 2 !== 0
    ) {
      throw new Error(
        "Invalid coordinates. LineString requires an even number of [latitude, longitude] pairs."
      );
    }

    const coordinatesPairs = [];
    for (let i = 0; i < coordinates.length; i += 2) {
      const latitude = coordinates[i];
      const longitude = coordinates[i + 1];
      coordinatesPairs.push([latitude, longitude]);
    }

    const lineStringFeature = {
      type: "Feature",
      id: "feature-10",
      geometry: {
        type: "LineString",
        coordinates: coordinatesPairs,
      },
      properties: {},
    };

    const featureCollection = {
      type: "FeatureCollection",
      features: [lineStringFeature],
    };

    return featureCollection;
  }

  function createLineStringFeatureCollectionFromGeocode(coordinates) {
    // Ensure that coordinates is an array with an even number of elements
    if (
      !Array.isArray(coordinates) ||
      coordinates.length < 4 ||
      coordinates.length % 2 !== 0
    ) {
      throw new Error(
        "Invalid coordinates. LineString requires an even number of [latitude, longitude] pairs."
      );
    }

    const lineStringFeature = {
      type: "Feature",
      id: "feature-10",
      geometry: {
        type: "LineString",
        coordinates,
      },
      properties: {},
    };

    const featureCollection = {
      type: "FeatureCollection",
      features: [lineStringFeature],
    };

    return featureCollection;
  }

  useEffect(() => {
    const karlsruheCenter = fromLonLat([9.389026875765198, 52.04599428906067]);

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: karlsruheCenter,
        zoom: 13,
      }),
    });

    const vector = new VectorLayer({
      source: source,
    });

    map.addLayer(vector);
    map.addInteraction(draw);

    map.addControl(geocoderStart);
    map.addControl(geocoderEnd);

    setGlobalMap(map);

    return () => {
      map.dispose();
    };
  }, []);

  return (
    <div>
      <div id="map"></div>
      <RadiationEstimator data={geoJson} />
    </div>
  );
};

export default MapComponent;
