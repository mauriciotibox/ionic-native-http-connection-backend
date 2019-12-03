export function checkExternalRequest(req) {
    return /^(http|https):\/\//.test(req.url);
}
//# sourceMappingURL=check-external-request.js.map