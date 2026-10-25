<script lang="ts">
	import { profile } from '$lib/data/profile';

	const navItems = [
		{ label: 'Work', href: '/#work' },
		{ label: 'Process', href: '/#process' },
		{ label: 'Stack', href: '/#stack' },
		{ label: 'Experience', href: '/#experience' },
		{ label: 'Contact', href: '/#contact' }
	];
</script>

<header class="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
	<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
		<a href="/" class="flex items-center gap-2 font-mono text-sm font-medium">
			<span aria-hidden="true" class="size-2 rounded-full bg-primary"></span>
			{profile.wordmark}
		</a>
		<nav aria-label="Primary">
			<ul class="flex items-center gap-1 text-sm">
				{#each navItems as item (item.href)}
					{@const isContact = item.label === 'Contact'}
					<li class={isContact ? '' : 'hidden sm:block'}>
						<a
							href={item.href}
							class={isContact
								? 'ml-2 inline-flex h-9 items-center rounded-full bg-primary px-4 font-medium text-primary-foreground transition-opacity hover:opacity-90'
								: 'inline-flex h-9 items-center rounded-full px-3 text-muted-foreground transition-colors hover:text-foreground'}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</header>
