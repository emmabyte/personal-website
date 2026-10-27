<script lang="ts">
	import { profile } from '$lib/data/profile';
</script>

<footer class="border-t border-border">
	<div
		class="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-8"
	>
		<p>© {new Date().getFullYear()} {profile.name}</p>
		<p>Built with SvelteKit, Tailwind CSS & deployed on Vercel.</p>
	</div>
</footer>
