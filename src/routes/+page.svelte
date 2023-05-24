<script>
	import Mapboxmap from './map/+page.svelte';
	export let data;
</script>

<Mapboxmap bridgesGeoJson={data.bridgesGeoJson} otherGeoJson={data.otherGeoJson} />
