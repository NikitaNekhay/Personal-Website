<script lang="ts">
	import { t } from 'svelte-i18n';
	import { base } from '$app/paths';
	import { fade, fly } from 'svelte/transition';

	export let isOpen = false;
	export let title: string = 'Confirm action';
	export let message: string = 'Are you sure you want to continue?';
	export let confirmText: string = 'Delete';
	export let cancelText: string = 'Cancel';
	export let isLoading = false;
	export let confirmfunction: () => void | Promise<void>;

	async function confirm() {
		await confirmfunction?.();
	}

	function close() {
		if (isLoading) return;
		isOpen = false;
	}
</script>

{#if isOpen}
	<div class="confirm-backdrop" transition:fade={{ duration: 160 }}>
		<div
			in:fly={{ y: -160, duration: 360 }}
			out:fade={{ duration: 140 }}
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="confirm-title"
			class="confirm-card"
		>
			<div class="flex items-start gap-4">
				<img class="place-self-center" src="{base}/media/alert.svg" alt="alert icon" />

				<div class="flex-1">
					<strong id="confirm-title" class="block font-medium text-gray-900">
						{$t(title)}
					</strong>
					<p class="mt-1 text-sm text-gray-700">
						{$t(message)}
					</p>

					<div class="mt-4 flex flex-wrap gap-2">
						<button
							type="button"
							class="confirm-danger"
							disabled={isLoading}
							onclick={confirm}
						>
							{#if isLoading}
								<span class="button-spinner"></span>
							{/if}
							<span class="text-sm">{$t(confirmText)}</span>
						</button>
						<button
							type="button"
							class="confirm-cancel"
							disabled={isLoading}
							onclick={close}
						>
							<span class="text-sm">{$t(cancelText)}</span>
						</button>
					</div>
				</div>

				<button
					type="button"
					class="text-gray-500 transition hover:text-gray-600"
					disabled={isLoading}
					onclick={close}
				>
					<span class="sr-only">{$t('Dismiss popup')}</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.confirm-backdrop {
		position: fixed;
		inset: 0;
		z-index: 70;
		background: rgba(255, 255, 255, 0.35);
	}

	.confirm-card {
		position: fixed;
		top: 10%;
		left: 25%;
		right: 25%;
		z-index: 71;
		margin-top: 1.5rem;
		margin-bottom: 4rem;
		border: 1px solid #f3f4f6;
		border-radius: 0.75rem;
		background: #ffffff;
		padding: 1rem;
		box-shadow: 0 20px 45px rgba(36, 30, 78, 0.16);
	}

	.confirm-danger,
	.confirm-cancel {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		border-radius: 0.5rem;
		padding: 0.5rem 1rem;
		transition:
			background 180ms ease,
			color 180ms ease,
			opacity 180ms ease;
	}

	.confirm-danger {
		background: #c53030;
		color: #ffffff;
	}

	.confirm-danger:hover {
		background: #9b2c2c;
	}

	.confirm-cancel {
		background: #f3f4f6;
		color: #241e4e;
	}

	.confirm-cancel:hover {
		background: #e5e7eb;
	}

	.confirm-danger:disabled,
	.confirm-cancel:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.button-spinner {
		width: 0.9rem;
		height: 0.9rem;
		border: 2px solid currentColor;
		border-right-color: transparent;
		border-radius: 999px;
		animation: spin 700ms linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 768px) {
		.confirm-card {
			left: 2.5rem;
			right: 2.5rem;
		}
	}
</style>
