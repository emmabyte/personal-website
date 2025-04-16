<script lang="ts">
	import { keywords } from '$lib/data/keywords.json';
</script>

<!-- Hidden Keywords Section for SEO since keywords display in Three.js Scene and not in the html -->
<section aria-hidden="true" style="display: none;">
	<h2>Keywords</h2>
	<ul>
		{#each keywords as keyword}
			<li>{keyword}</li>
		{/each}
	</ul>
</section>
