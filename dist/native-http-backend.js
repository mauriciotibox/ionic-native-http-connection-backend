var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { HttpErrorResponse, HttpHeaders, HttpResponse, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { Observable } from 'rxjs';
var XSSI_PREFIX = /^\)\]\}',?\n/;
var NativeHttpBackend = /** @class */ (function () {
    function NativeHttpBackend(nativeHttp) {
        this.nativeHttp = nativeHttp;
    }
    NativeHttpBackend.prototype.handle = function (req) {
        var _this = this;
        var allowedRequestMethods = [
            'GET',
            'POST',
            'PUT',
            'DELETE',
            'PATCH',
            'HEAD',
        ];
        if (allowedRequestMethods.indexOf(req.method.toUpperCase()) === -1) {
            throw 'Only GET, POST, PUT, DELETE, PATCH and HEAD methods are supported by the current Native HTTP version';
        }
        return new Observable(function (observer) {
            var headers = {};
            req.headers.keys().map(function (key) {
                headers[key] = req.headers.get(key);
            });
            var body;
            // if serializer utf8 it means body content type (text/...) should be string
            if (_this.getSerializerTypeByContentType(req) === 'utf8') {
                body = req.body;
            }
            else if (typeof req.body === 'string') {
                body = _this.getBodyParams(req.body);
            }
            else if (Array.isArray(req.body)) {
                body = req.body;
            }
            else {
                body = __assign({}, req.body);
            }
            var requestMethod = req.method.toLowerCase();
            /**
                         * Request contains either encoded either decoded URL depended on the way
                         * parameters are passed to Http component. Even though XMLHttpRequest automatically
                         * converts not encoded URL, NativeHTTP requires it to be always encoded.
                         */
            var url = encodeURI(decodeURI(req.urlWithParams)).replace(/%253B|%252C|%252F|%253F|%253A|%2540|%2526|%253D|%252B|%2524|%2523/g, // ;,/?:@&=+$#
            // ;,/?:@&=+$#
            function (// ;,/?:@&=+$#
            substring) { return '%' + substring.slice(3); });
            var fireResponse = function (response) {
                // ok determines whether the response will be transmitted on the event or
                // error channel. Unsuccessful status codes (not 2xx) will always be errors,
                // but a successful status code can still result in an error if the user
                // asked for JSON data and the body cannot be parsed as such.
                var ok = response.status >= 200 && response.status < 300;
                var body = response.body;
                var responseContentType = response &&
                    response.headers &&
                    response.headers['content-type'];
                // Check whether the body needs to be parsed as JSON (in many cases the browser
                // will have done that already).
                if (req.responseType === 'json' &&
                    typeof body === 'string' &&
                    (responseContentType || '').indexOf('application/json') ===
                        0) {
                    // Save the original body, before attempting XSSI prefix stripping.
                    var originalBody = body;
                    body = body.replace(XSSI_PREFIX, '');
                    try {
                        // Attempt the parse. If it fails, a parse error should be delivered to the user.
                        body = body !== '' ? JSON.parse(body) : null;
                    }
                    catch (error) {
                        // Since the JSON.parse failed, it's reasonable to assume this might not have been a
                        // JSON response. Restore the original body (including any XSSI prefix) to deliver
                        // a better error response.
                        body = originalBody;
                        // If this was an error request to begin with, leave it as a string, it probably
                        // just isn't JSON. Otherwise, deliver the parsing error to the user.
                        if (ok) {
                            // Even though the response status was 2xx, this is still an error.
                            ok = false;
                            // The parse error contains the text of the body that failed to parse.
                            body = { error: error, text: body };
                        }
                    }
                }
                if (ok) {
                    // A successful response is delivered on the event stream.
                    observer.next(new HttpResponse({
                        body: body,
                        headers: new HttpHeaders(response.headers),
                        status: response.status,
                        url: response.url,
                    }));
                    // The full body has been received and delivered, no further events
                    // are possible. This request is complete.
                    observer.complete();
                }
                else {
                    // An unsuccessful request is delivered on the error channel.
                    observer.error(new HttpErrorResponse({
                        // The error in this case is the response body (error from the server).
                        error: body,
                        headers: new HttpHeaders(response.headers),
                        status: response.status,
                        url: response.url,
                    }));
                }
            };
            _this.nativeHttp.setDataSerializer(_this.detectDataSerializerType(req));
            _this.nativeHttp[requestMethod](url, body, headers)
                .then(function (response) {
                fireResponse({
                    body: response.data,
                    status: response.status,
                    headers: response.headers,
                    url: response.url,
                });
            })
                .catch(function (error) {
                fireResponse({
                    body: error.error,
                    status: error.status || 599,
                    // https://httpstatuses.com/599
                    headers: error.headers,
                    url: error.url,
                });
            });
        });
    };
    NativeHttpBackend.prototype.getSerializerTypeByContentType = function (req) {
        var reqContentType = (req.headers.get('content-type') || '').toLocaleLowerCase();
        if (reqContentType.indexOf('text/') === 0) {
            return 'utf8';
        }
        if (reqContentType.indexOf('application/json') === 0) {
            return 'json';
        }
        return null;
    };
    NativeHttpBackend.prototype.detectDataSerializerType = function (req) {
        var serializerByContentType = this.getSerializerTypeByContentType(req);
        if (serializerByContentType !== null) {
            return serializerByContentType;
        }
        // No Content-Type present try to gess it by method & body
        if (req.method.toLowerCase() === 'post' ||
            req.method.toLowerCase() === 'put' ||
            req.method.toLowerCase() === 'patch') {
            // 1 stands for ContentType.JSON. Angular doesn't export ContentType
            if (typeof req.body !== 'string') {
                return 'json';
            }
        }
        return 'urlencoded';
    };
    NativeHttpBackend.prototype.getBodyParams = function (query) {
        if (!query) {
            return {};
        }
        var paramsObj = (/^[?#]/.test(query) ? query.slice(1) : query).split('&');
        var obj = {};
        for (var i in paramsObj) {
            var param = paramsObj[i].split('=');
            if (obj[param[0]] != undefined && Array.isArray(obj[param[0]])) {
                obj[param[0]][obj[param[0]].length] = decodeURIComponent(param[1]);
            }
            else if (obj[param[0]] != undefined) {
                var n = [];
                n[0] = decodeURIComponent(obj[param[0]]);
                n[1] = decodeURIComponent(param[1]);
                obj[param[0]] = n;
            }
            else {
                obj[param[0]] = decodeURIComponent(param[1]);
            }
        }
        return obj;
    };
    NativeHttpBackend.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NativeHttpBackend.ctorParameters = function () { return [
        { type: HTTP, },
    ]; };
    return NativeHttpBackend;
}());
export { NativeHttpBackend };
//# sourceMappingURL=native-http-backend.js.map