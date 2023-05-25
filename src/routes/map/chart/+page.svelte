<script>
	export let bridgesGeoJson;

	import Chart from 'svelte-frappe-charts';
	import { lineString, point } from '@turf/helpers';
	import lineDistance from '@turf/distance';

	var groupBy = (features) => {
		return features.reduce((accumulator, current) => {
			(accumulator[current['properties']['maxspeed']] =
				accumulator[current['properties']['maxspeed']] || []).push(current);
			return accumulator;
		}, {});
	};

	const grouped = groupBy(bridgesGeoJson.features);
	const groupedObject = {};

	for (const property in grouped) {
		let totalDistance = 0;
		grouped[property].forEach((feature) => {
			var line = lineString(feature['geometry']['coordinates']);
			var from = point(line.geometry.coordinates[0]);
			var to = point(line.geometry.coordinates[1]);
			var distance = lineDistance(from, to, 'kilometers');
			totalDistance += distance;
		});
		Object.assign(groupedObject, { [property]: Math.abs(totalDistance) });
	}

	let data = {
		labels: Object.keys(groupedObject),
		datasets: [
			{
				values: Object.values(groupedObject)
			}
		],
		yMarkers: [{ label: 'Distance(km)/Max-speed', value: 120, options: { labelPos: 'left' } }]
	};
</script>

<figure class="charts-figure">
	<Chart
		{data}
		type="bar"
		height={200}
		colors={['light-blue']}
		axisOptions={{
			xAxisMode: 'tick',
			xIsSeries: true
		}}
		barOptions={{
			stacked: true,
			spaceRatio: 0
		}}
	/>
</figure>

<style>
	.charts-figure {
		min-width: 400px;
		max-height: 200px;
		margin: 1em auto;
		background-color: white;
		position: absolute;
		right: 10px;
		bottom: 30px;
	}
</style>
