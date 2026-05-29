/**
 * Хелпер «тёплой» предзагрузки изображений в кэш браузера.
 *
 * Грузим через `new Image()` — это кладёт файл в HTTP-кэш, поэтому когда секция
 * реально доскроллится и появится в DOM, картинка отрисуется мгновенно.
 *
 * Дедуп: один и тот же URL не качаем дважды за сессию (модульный Set).
 * Очередь: грузим ПОСЛЕДОВАТЕЛЬНО с ограничением параллелизма, чтобы фоновая
 * предзагрузка не конкурировала с тем, что пользователь смотрит прямо сейчас.
 *
 * Переиспользуемый сервис — главная (слайдер), позже /shop и /works.
 */

const requested = new Set<string>(); // уже запрошенные URL (дедуп)

/** Предзагрузить один URL. Повторный вызов с тем же URL — no-op. */
function prefetchOne(url: string): Promise<void> {
	if (typeof window === 'undefined' || requested.has(url)) {
		return Promise.resolve();
	}
	requested.add(url);

	return new Promise<void>((resolve) => {
		const img = new Image();
		// decoding=async + низкий приоритет: фоновая задача, не срочная
		img.decoding = 'async';
		// fetchPriority поддержан не везде — присваиваем мягко
		try {
			(img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = 'low';
		} catch {
			/* старый браузер — игнорируем */
		}
		img.onload = () => resolve();
		img.onerror = () => {
			// при ошибке снимаем из дедупа — вдруг получится позже
			requested.delete(url);
			resolve();
		};
		img.src = url;
	});
}

/**
 * Предзагрузить список URL последовательно, не более `concurrency` за раз.
 * Возвращает промис, который резолвится по завершении всей пачки.
 */
export async function prefetchImages(urls: string[], concurrency = 2): Promise<void> {
	const queue = urls.filter((u) => !requested.has(u));
	if (queue.length === 0) return;

	let cursor = 0;
	const worker = async () => {
		while (cursor < queue.length) {
			const url = queue[cursor++];
			await prefetchOne(url);
		}
	};

	const workers = Array.from({ length: Math.min(concurrency, queue.length) }, worker);
	await Promise.all(workers);
}
