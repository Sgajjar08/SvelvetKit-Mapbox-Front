<script>
	/**
	 * @type {any}
	 */
	export let bridgesGeoJson;
	/**
	 * @type {any}
	 */
	export let otherGeoJson;

	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';

	onMount(async () => {
		mapboxgl.accessToken =
			'pk.eyJ1Ijoic2dhamphcjA4IiwiYSI6ImNrMXQxN2xqZjAwMTYzbnA4M2dvN2Vma20ifQ.ZWgvfInk4Dl-90JhQP38gA';

		const filterGroup = document.getElementById('filter-group');

		// create map
		const map = new mapboxgl.Map({
			container: 'map', // container id
			style: 'mapbox://styles/mapbox/dark-v11',
			zoom: 10,
			center: [2.347136, 48.863088]
		});

		await map.on('load', function () {
			map.addSource('other-geojson-data', {
				type: 'geojson',
				data: otherGeoJson,
				tolerance: 3.5,
			});

			// Add a layer to display the OSM data
			map.addLayer({
				id: 'other-geojson-layer-line',
				type: 'line',
				source: 'other-geojson-data',
				paint: {
					'line-width': 1,
					'line-color': '#FCF6F5'
				}
			});

			map.addSource('bridge-data', {
				type: 'geojson',
				data: bridgesGeoJson
			});

			let features = bridgesGeoJson.features

			for (const feature of features) {
				const maxspeed = feature.properties.maxspeed;
				const layerID = maxspeed ? `bridge-${maxspeed}` : `bridge-0`;

				// Add a layer for this symbol type if it hasn't been added already.
				if (!map.getLayer(layerID)) {
					// Add a layer
					map.addLayer({
						id: layerID,
						type: 'line',
						source: 'bridge-data',
						paint: {
							'line-width': 5,
							'line-color': '#89ABE3'
						},
						filter: ['==', 'maxspeed', maxspeed || 0]
					});

					map.on('click', layerID, (e) => {
						const description = e.features[0].properties.maxspeed;
						const coordinates = e.features[0].geometry.coordinates[0];
						map.flyTo({
							center: coordinates,
							zoom: 15
						});

						new mapboxgl.Popup()
							.setLngLat(coordinates)
							.setHTML('<h3>Max speed: </h3><h4>' + description + '</h4>')
							.addTo(map);
					});
					// Change the cursor to a pointer when the mouse is over the places layer.
					map.on('mouseenter', layerID, () => {
						map.getCanvas().style.cursor = 'pointer';
					});

					// Change it back to a pointer when it leaves.
					map.on('mouseleave', layerID, () => {
						map.getCanvas().style.cursor = '';
					});

					if (parseInt(maxspeed) >= 0) {
						const input = document.createElement('input');
						input.type = 'checkbox';
						input.id = layerID;
						input.checked = true;
						const newDiv = document.createElement('div');
						newDiv.appendChild(input);

						const label = document.createElement('label');
						label.setAttribute('for', layerID);
						label.textContent = maxspeed;
						newDiv.appendChild(label);

						filterGroup?.appendChild(newDiv);
						// When the checkbox changes, update the visibility of the layer.
						input.addEventListener('change', (e) => {
							map.setLayoutProperty(layerID, 'visibility', e.target.checked ? 'visible' : 'none');
						});
					}
				}
			}
		});
	});
</script>

<div id="map" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;" />
<nav id="filter-group" class="filter-group">
	<h4 class="p-l-1">Filter by max speed</h4>
</nav>

<style>
	.mapboxgl-popup {
		max-width: 400px;
		font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
	}
	.mapboxgl-popup-content {
		font: 400 15px/22px 'Source Sans Pro', 'Helvetica Neue', sans-serif;
		padding: 0;
		width: 180px;
	}

	.mapboxgl-popup-content h3 {
		background: #91c949;
		color: #fff;
		margin: 0;
		padding: 10px;
		border-radius: 3px 3px 0 0;
		font-weight: 700;
		margin-top: -15px;
	}

	.mapboxgl-popup-content h4 {
		margin: 0;
		padding: 10px;
		font-weight: 400;
	}

	.mapboxgl-popup-anchor-top > .mapboxgl-popup-content {
		margin-top: 15px;
	}

	.mapboxgl-popup-anchor-top > .mapboxgl-popup-tip {
		border-bottom-color: #91c949;
	}
	.filter-group {
		font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
		font-weight: 600;
		position: absolute;
		display: flex;
		flex-direction: column;
		top: 10px;
		right: 10px;
		z-index: 1;
		border-radius: 3px;
		width: 120px;
		color: #000;
		background-color: white;
	}

	.filter-group input[type='checkbox']:first-child + label {
		border-radius: 3px 3px 0 0;
	}

	.filter-group label:last-child {
		border-radius: 0 0 3px 3px;
		border: none;
	}

	.filter-group input[type='checkbox'] {
		display: none;
	}

	.filter-group input[type='checkbox'] + label {
		background-color: white;
		display: block;
		cursor: pointer;
		padding: 10px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.25);
	}

	.filter-group input[type='checkbox'] + label {
		background-color: white;
		text-transform: capitalize;
	}

	.filter-group input[type='checkbox'] + label:hover,
	.filter-group input[type='checkbox']:checked + label {
		background-color: white;
	}
	.p-l-1{
		padding-left: 10px;
	}
</style>
