/**
 * Трекер вовлечённости пользователя.
 *
 * Идея: не начинать тяжёлую предзагрузку сразу при заходе на страницу
 * (это конкурирует за сеть с первым, видимым фото), а дождаться, пока станет
 * понятно, что пользователь действительно остался смотреть — скроллит или
 * просто залип на странице. Только после этого «разогреваем» следующие фото.
 *
 * Активным считаем время, проведённое на ВИДИМОЙ вкладке. Если вкладку свернули
 * или ушли в другую — накопление паузится (нет смысла качать фото в фон).
 * Скролл/касание/движение указателя — сильный сигнал намерения смотреть дальше:
 * он может мгновенно «дожать» порог через `scrollEngageMs`.
 *
 * Сервис переиспользуемый — используется на главной (слайдер), позже на /shop и /works.
 */

export interface EngagementOptions {
	/** Сколько активного времени на видимой вкладке нужно набрать до срабатывания. */
	minActiveMs?: number;
	/**
	 * Порог при наличии скролла/жеста: если пользователь начал скроллить,
	 * достаточно набрать всего столько активного времени. Так «активный» зритель
	 * вовлекается ближе к 3с, а пассивный — ближе к верхней границе.
	 */
	scrollEngageMs?: number;
	/** Шаг таймера накопления, мс. */
	tickMs?: number;
	/** Колбэк, срабатывает один раз при достижении порога. */
	onEngaged: () => void;
}

/**
 * Запускает отслеживание. Возвращает функцию очистки (снять слушатели/таймер).
 * Если окружение не браузерное — возвращает no-op.
 */
export function trackEngagement(options: EngagementOptions): () => void {
	const {
		minActiveMs = 3500,
		scrollEngageMs = 1200,
		tickMs = 250,
		onEngaged
	} = options;

	if (typeof window === 'undefined') return () => {};

	let activeMs = 0;
	let hasInteracted = false; // был ли скролл/жест — снижает требуемый порог
	let engaged = false;

	const fire = () => {
		if (engaged) return;
		const threshold = hasInteracted ? scrollEngageMs : minActiveMs;
		if (activeMs >= threshold) {
			engaged = true;
			cleanup();
			onEngaged();
		}
	};

	const interval = window.setInterval(() => {
		if (document.visibilityState === 'visible') {
			activeMs += tickMs;
			fire();
		}
	}, tickMs);

	const onInteract = () => {
		hasInteracted = true;
		fire();
	};

	// passive: не мешаем нативному скроллу
	const opts: AddEventListenerOptions = { passive: true };
	window.addEventListener('scroll', onInteract, opts);
	window.addEventListener('wheel', onInteract, opts);
	window.addEventListener('touchstart', onInteract, opts);
	window.addEventListener('pointermove', onInteract, opts);
	window.addEventListener('keydown', onInteract);

	function cleanup() {
		window.clearInterval(interval);
		window.removeEventListener('scroll', onInteract, opts);
		window.removeEventListener('wheel', onInteract, opts);
		window.removeEventListener('touchstart', onInteract, opts);
		window.removeEventListener('pointermove', onInteract, opts);
		window.removeEventListener('keydown', onInteract);
	}

	return cleanup;
}
