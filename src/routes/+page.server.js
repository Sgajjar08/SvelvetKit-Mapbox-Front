// @ts-ignore
export async function load({ fetch }) {
	try {
		const response = await fetch('ile-de-france.geojson');
		const geojsonData = await response.json();

        // @ts-ignore
		const bridgesGeoJson = {
			type: 'FeatureCollection',
			// @ts-ignore
			features: geojsonData.features.filter((gd) => gd.properties.bridge)
		};
		const otherGeoJson = {
			type: 'FeatureCollection',
			// @ts-ignore
			features: geojsonData.features.filter((gd) => !gd.properties.bridge)
		};
		return { bridgesGeoJson: bridgesGeoJson, otherGeoJson };
	} catch (error) {
		console.error('Error:', error);
		return {
			status: 500,
			error: 'Failed to load GeoJSON data'
		};
	}
}
