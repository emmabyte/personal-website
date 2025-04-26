<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import { faEnvelope, faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';

	import Fa from 'svelte-fa';
	import type { SocialLink } from '$lib/types/social-link';

	interface Props {
		email: string;
		socialLinks: SocialLink[];
		copyEmail: () => void | Promise<void>;
		emailCopied: boolean;
	}

	let {
		email,
		socialLinks = [],
		copyEmail = () => {},
		emailCopied = $bindable()
	}: Props = $props();
</script>

<!-- Let's Connect Card -->
<div>
	<Card.Root class="">
		<Card.Content class="p-6">
			<h3 class="mb-4 text-2xl font-semibold">Let's Connect</h3>
			<p class="mb-6 text-muted-foreground">
				I'm currently open to new opportunities and would love to hear from recruiters and potential
				employers.
			</p>

			<div class="mb-6 flex flex-col gap-3 rounded-lg bg-muted p-4 sm:flex-row sm:items-center">
				<Fa icon={faEnvelope} class="h-6 w-6 shrink-0 text-violet-500" />
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-medium text-muted-foreground">Email me at</p>
					<p class="break-all font-medium">{email}</p>
				</div>
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger onclick={copyEmail} class="h-8 w-8 shrink-0">
							{#if emailCopied}
								<Fa icon={faCheck} class="h-4 w-4" />
							{:else}
								<Fa icon={faCopy} class="h-4 w-4" />
							{/if}
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>{emailCopied ? 'Copied!' : 'Copy email'}</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			</div>

			<div class="space-y-4">
				<h4 class="font-medium">Find me on social media</h4>
				<div class="flex flex-wrap gap-3">
					{#each socialLinks as link}
						<Tooltip.Provider>
							<Tooltip.Root>
								<Tooltip.Trigger>
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80"
									>
										<Fa icon={link.icon} size="lg" />
									</a>
								</Tooltip.Trigger>
								<Tooltip.Content>
									<p>{link.name}</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.Provider>
					{/each}
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
