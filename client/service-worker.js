self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1').then(cache => {
            return cache.addAll([
                '/',
                '/styles.css',
                '/app.js',
                '/images/icons/icon-192x192.png',
                '/images/icons/icon-512x512.png'
            ]).catch(error => {
                console.error('Failed to cache:', error);
            });
        })
    );
});