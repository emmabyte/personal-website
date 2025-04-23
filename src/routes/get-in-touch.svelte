<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
</script>

<section id="contact" class="w-full py-12 md:py-24 lg:py-32">
	<div class="container px-4 md:px-6">
		<div class="mb-12 text-center">
			<h2 class="bg-gradient-to-r text-4xl font-bold">Contact</h2>
			<p class="mt-2 text-xl text-gray-400">Get in Touch</p>
		</div>

		<Card.Root class="mx-auto max-w-3xl">
			<Card.Content>
				<form class="space-y-6">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<Label for="name">Name</Label>
							<Input
								type="text"
								id="name"
								name="name"
								placeholder="Your full name"
								class="w-full"
							/>
						</div>

						<div>
							<Label for="email">Email</Label>
							<Input
								type="email"
								id="email"
								name="email"
								placeholder="you@example.com"
								class="w-full "
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<Label for="organization">Organization</Label>
							<Input
								type="text"
								id="organization"
								name="organization"
								placeholder="Your company"
								class="w-full "
							/>
						</div>

						<div>
							<Label for="position">Position</Label>
							<Input
								type="text"
								id="position"
								name="position"
								placeholder="Your role"
								class="w-full"
							/>
						</div>
					</div>

					<div>
						<Label for="message">Message</Label>
						<Textarea
							id="message"
							name="message"
							rows={5}
							placeholder="Let us know how we can help"
							class="w-full "
						></Textarea>
					</div>

					<div>
						<Label for="captcha">Verification</Label>
						<Input
							type="text"
							id="captcha"
							name="captcha"
							placeholder="CAPTCHA code"
							class="w-full "
						/>
					</div>

					<Button type="submit" class="w-full">Send Message</Button>
				</form>
			</Card.Content>
		</Card.Root>
	</div>
</section>
