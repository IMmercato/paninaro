self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1').then(cache => {
            return cache.addAll([
                '/',
                '/app.js',
                '../styles.css',
                '../images/icons/icon-192x192.png',
                '../images/icons/icon-512x512.png'
            ]).catch(error => {
                console.error('Failed to cache:', error);
            });
        })
    );
});