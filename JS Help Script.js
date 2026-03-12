// ==UserScript==
// @name         Discord Token Login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically logs into Discord using a token passed via URL hash (#dtm=TOKEN)
// @author       You
// @match        https://discord.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const hash = window.location.hash;
    if (!hash.startsWith('#dtm=')) return;

    const token = decodeURIComponent(hash.slice(5));
    if (!token) return;

    // Clean the hash from the URL immediately so it doesn't linger
    history.replaceState(null, '', window.location.pathname);

    console.log('[Discord Token Login] Token detected, logging in...');

    function injectToken() {
        try {
            const iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            iframe.contentWindow.localStorage.token = `"${token}"`;
            iframe.remove();
        } catch (e) {
            // iframe not ready yet, will retry
        }
    }

    // Wait for body to exist, then start injecting
    function waitForBody() {
        if (document.body) {
            const interval = setInterval(injectToken, 50);
            setTimeout(() => {
                clearInterval(interval);
                console.log('[Discord Token Login] Reloading...');
                location.reload();
            }, 3000);
        } else {
            requestAnimationFrame(waitForBody);
        }
    }

    waitForBody();
})();
