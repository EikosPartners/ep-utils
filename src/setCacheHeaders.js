function setCacheHeaders(req, res, next) {
    //disable browser caching
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    next();
}

module.exports = {
    setCacheHeaders: setCacheHeaders
}
