/**
 * Svelte-action: плавное появление картинки при загрузке.
 *
 * Универсальная замена ручному классу is-loaded: вешается прямо на <img>,
 * сама ставит начальную прозрачность и проявляет картинку по событию load.
 * Работает и в старых компонентах (Options API), и в новых (runes) — это
 * обычный action, не зависящий от версии Svelte.
 *
 * Используется там, где нет системы thumbs (shop, works). В главном слайдере
 * остаётся свой вариант с размытым превью (blur-up).
 *
 * Учитывает кэш (img.complete) и prefers-reduced-motion.
 */

export interface FadeInOptions {
	/** Длительность проявления, мс. */
	duration?: number;
}

export function fadeInImage(node: HTMLImageElement, options: FadeInOptions = {}) {
	const duration = options.duration ?? 500;

	// Уважаем системную настройку «меньше движения» — тогда без анимации.
	const prefersReduced =
		typeof window !== 'undefined' &&
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

	if (prefersReduced) {
		return {};
	}

	node.style.opacity = '0';
	node.style.transition = `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`;
	node.style.willChange = 'opacity';

	const reveal = () => {
		node.style.opacity = '1';
	};

	if (node.complete && node.naturalWidth > 0) {
		// уже в кэше — событие load не придёт, проявляем на следующем кадре
		requestAnimationFrame(reveal);
	} else {
		node.addEventListener('load', reveal, { once: true });
		// при ошибке тоже снимаем прозрачность, чтобы битая картинка не «висела» невидимой
		node.addEventListener('error', reveal, { once: true });
	}

	return {
		destroy() {
			node.removeEventListener('load', reveal);
			node.removeEventListener('error', reveal);
		}
	};
}
