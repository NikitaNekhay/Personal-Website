/**
 * Svelte-экшен `smoothDetails` — плавное, «motion-design» раскрытие/сворачивание
 * нативного <details>.
 *
 * Зачем: нативный <details> открывается/закрывается мгновенно (рывком). Класс
 * animate-fadeIn давал только проявление контента на открытии, а закрытие
 * схлопывалось скачком, и стрелка-шеврон крутилась рассинхронно.
 *
 * Что делает экшен:
 *  - перехватывает клик по <summary>;
 *  - анимирует высоту самого <details> (Web Animations API) — плавно в обе стороны;
 *  - параллельно подкручивает контент (лёгкий fade + сдвиг по Y);
 *  - синхронно вращает шеврон, причём СРАЗУ в начале клика (и на закрытии тоже);
 *  - уважает prefers-reduced-motion (тогда просто переключает open без анимации).
 *
 * Переиспользуемо: вешается через use:smoothDetails на любой <details>,
 * у которого первый дочерний элемент — <summary>, а следом идёт контент.
 */

const DURATION = 420; // мс — заметно, но не вяло
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'; // easeOutQuint — мягкий «дорогой» выкат

export function smoothDetails(node: HTMLDetailsElement) {
	const summary = node.querySelector<HTMLElement>('summary');
	const content = summary?.nextElementSibling as HTMLElement | null;
	if (!summary || !content) return {};

	// шеврон: span-обёртка вокруг svg внутри summary (если есть)
	const chevron = summary.querySelector('svg')?.parentElement as HTMLElement | null;

	const prefersReduced =
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	let animation: Animation | null = null;
	let isClosing = false;
	let isExpanding = false;

	function setChevron(open: boolean) {
		if (!chevron || prefersReduced) return; // в reduced-motion даём классу group-open рулить
		chevron.style.transition = `transform ${DURATION}ms ${EASE}`;
		chevron.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
	}

	function onClick(event: MouseEvent) {
		event.preventDefault();
		node.style.overflow = 'hidden';

		if (isClosing || !node.open) {
			openDetails();
		} else if (isExpanding || node.open) {
			closeDetails();
		}
	}

	function openDetails() {
		setChevron(true);
		if (prefersReduced) {
			node.open = true;
			node.style.overflow = '';
			return;
		}
		// фиксируем текущую (свёрнутую) высоту, затем реально открываем для замера
		node.style.height = `${node.offsetHeight}px`;
		node.open = true;
		window.requestAnimationFrame(expand);
	}

	function expand() {
		isExpanding = true;
		const startHeight = `${node.offsetHeight}px`;
		const endHeight = `${node.scrollHeight}px`; // полная высота контента

		if (animation) animation.cancel();

		animation = node.animate(
			{ height: [startHeight, endHeight] },
			{ duration: DURATION, easing: EASE }
		);
		content!.animate(
			{ opacity: [0, 1], transform: ['translateY(-8px)', 'translateY(0)'] },
			{ duration: DURATION, easing: EASE }
		);

		animation.onfinish = () => finish(true);
		animation.oncancel = () => {
			isExpanding = false;
		};
	}

	function closeDetails() {
		setChevron(false);
		if (prefersReduced) {
			node.open = false;
			node.style.overflow = '';
			return;
		}
		isClosing = true;
		const startHeight = `${node.offsetHeight}px`;
		const endHeight = `${summary!.offsetHeight}px`; // только высота заголовка

		if (animation) animation.cancel();

		animation = node.animate(
			{ height: [startHeight, endHeight] },
			{ duration: DURATION, easing: EASE }
		);
		content!.animate(
			{ opacity: [1, 0], transform: ['translateY(0)', 'translateY(-8px)'] },
			{ duration: DURATION, easing: EASE }
		);

		animation.onfinish = () => finish(false);
		animation.oncancel = () => {
			isClosing = false;
		};
	}

	function finish(open: boolean) {
		node.open = open;
		animation = null;
		isClosing = false;
		isExpanding = false;
		node.style.height = '';
		node.style.overflow = '';
	}

	summary.addEventListener('click', onClick);

	return {
		destroy() {
			summary.removeEventListener('click', onClick);
			if (animation) animation.cancel();
		}
	};
}
