export const proxyWithUser = (targetUrl) => {
    return async (req, res, next) => {
        try {
            const headers = new Headers();
            Object.entries(req.headers).forEach(([key, val]) => {
                const lowKey = key.toLowerCase();
                if (lowKey !== 'host' && lowKey !== 'expect') {
                    if (Array.isArray(val)) {
                        val.forEach(v => headers.append(key, v));
                    } else if (val !== undefined) {
                        headers.append(key, val);
                    }
                }
            });

            if (req.user) {
                headers.set("x-user-id", req.user.userID || req.user.userId || req.user._id);
                headers.set("x-user-email", req.user.email);
                headers.set("x-user-avatar", req.user.avatar);
            }

            const options = {
                method: req.method,
                headers: headers,
                duplex: 'half'
            };

            if (req.method !== 'GET' && req.method !== 'HEAD') {
                options.body = req;
            }

            const response = await fetch(`${targetUrl}${req.url}`, options);

            const excludeHeaders = [
                'connection',
                'keep-alive',
                'transfer-encoding',
                'content-encoding',
                'content-length',
                'access-control-allow-origin',
                'access-control-allow-credentials',
                'access-control-allow-headers',
                'access-control-allow-methods',
                'access-control-expose-headers'
            ];

            res.status(response.status);
            response.headers.forEach((val, key) => {
                if (!excludeHeaders.includes(key.toLowerCase())) {
                    res.setHeader(key, val);
                }
            });

            const arrayBuffer = await response.arrayBuffer();
            res.send(Buffer.from(arrayBuffer));
        } catch (err) {
            console.error("Proxy Error:", err);
            if (!res.headersSent) {
                res.status(500).json({ message: "Proxy error", error: err.message });
            }
        }
    };
};

export const customProxy = (targetUrl) => {
    return async (req, res, next) => {
        try {
            const headers = new Headers();
            Object.entries(req.headers).forEach(([key, val]) => {
                const lowKey = key.toLowerCase();
                if (lowKey !== 'host' && lowKey !== 'expect') {
                    if (Array.isArray(val)) {
                        val.forEach(v => headers.append(key, v));
                    } else if (val !== undefined) {
                        headers.append(key, val);
                    }
                }
            });

            const options = {
                method: req.method,
                headers: headers,
                duplex: 'half'
            };

            if (req.method !== 'GET' && req.method !== 'HEAD') {
                options.body = req;
            }

            const response = await fetch(`${targetUrl}${req.url}`, options);

            const excludeHeaders = [
                'connection',
                'keep-alive',
                'transfer-encoding',
                'content-encoding',
                'content-length',
                'access-control-allow-origin',
                'access-control-allow-credentials',
                'access-control-allow-headers',
                'access-control-allow-methods',
                'access-control-expose-headers'
            ];

            res.status(response.status);
            response.headers.forEach((val, key) => {
                if (!excludeHeaders.includes(key.toLowerCase())) {
                    res.setHeader(key, val);
                }
            });

            const arrayBuffer = await response.arrayBuffer();
            res.send(Buffer.from(arrayBuffer));
        } catch (err) {
            console.error("Proxy Error:", err);
            if (!res.headersSent) {
                res.status(500).json({ message: "Proxy error", error: err.message });
            }
        }
    };
};