// Tiny helper to build query strings with nested objects using bracket notation
// Usage: qp('/path', { merge: { filter: { search: 'a' }, page: 1 } })
// Options: { merge?: any; remove?: Array<string> | Record<string, any>; reset?: boolean }

type QpOpts = {
    merge?: Record<string, any>;
    remove?: Array<string> | Record<string, any>;
    reset?: boolean;
};

function toUrl(basePath: string): URL {
    try {
        // Absolute or relative
        return new URL(
            basePath,
            typeof window !== 'undefined'
                ? window.location.origin
                : 'http://localhost',
        );
    } catch {
        return new URL('http://localhost');
    }
}

function setParam(url: URL, key: string, value: any) {
    if (value === undefined || value === null || value === '') {
        url.searchParams.delete(key);
        return;
    }
    if (Array.isArray(value)) {
        url.searchParams.set(key, value.join(','));
        return;
    }
    if (typeof value === 'object') {
        // Flatten one level: key[a]=... key[b]=...
        Object.entries(value).forEach(([k, v]) =>
            setParam(url, `${key}[${k}]`, v),
        );
        return;
    }
    url.searchParams.set(key, String(value));
}

function applyMerge(url: URL, obj: Record<string, any>) {
    Object.entries(obj || {}).forEach(([key, value]) =>
        setParam(url, key, value),
    );
}

function applyRemove(url: URL, remove?: Array<string> | Record<string, any>) {
    if (!remove) return;
    if (Array.isArray(remove)) {
        remove.forEach((k) => url.searchParams.delete(k));
        return;
    }
    // Nested remove object: { filter: ['search','type'], page: true }
    Object.entries(remove).forEach(([key, val]) => {
        if (val === true) {
            url.searchParams.delete(key);
        } else if (Array.isArray(val)) {
            val.forEach((inner) => url.searchParams.delete(`${key}[${inner}]`));
        } else if (typeof val === 'object' && val) {
            Object.keys(val).forEach((inner) =>
                url.searchParams.delete(`${key}[${inner}]`),
            );
        }
    });
}

export function qp(basePath: string, opts: QpOpts = {}): string {
    const url = toUrl(basePath);

    // If not resetting, merge current page query first (for same-origin flows)
    if (!opts.reset && typeof window !== 'undefined') {
        const current = new URL(window.location.href);
        // Only copy over if same path to avoid leaking unrelated params
        if (current.pathname === url.pathname) {
            current.searchParams.forEach((v, k) => {
                if (!url.searchParams.has(k)) {
                    url.searchParams.set(k, v);
                }
            });
        }
    }

    if (opts.remove) applyRemove(url, opts.remove);
    if (opts.merge) applyMerge(url, opts.merge);

    // Return path + query (preserve relative path for Inertia/Wayfinder)
    const qs = url.searchParams.toString();
    return url.pathname + (qs ? `?${qs}` : '');
}

export default qp;
