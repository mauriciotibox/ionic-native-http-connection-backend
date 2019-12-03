import { Injectable } from '@angular/core';
import { Headers, RequestMethod, Response, ResponseOptions, } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { Observable } from 'rxjs/Observable';
/**
 * @deprecated and will be gone
 */
var /**
 * @deprecated and will be gone
 */
NativeHttpConnectionD = /** @class */ (function () {
    function NativeHttpConnectionD(req, nativeHttp, baseResponseOptions) {
        var _this = this;
        var allowedRequestMethods = [
            RequestMethod.Get,
            RequestMethod.Post,
            RequestMethod.Put,
            RequestMethod.Delete,
            RequestMethod.Patch,
            RequestMethod.Head,
        ];
        if (allowedRequestMethods.indexOf(req.method) === -1) {
            throw 'Only GET, POST, PUT, PATCH, DELETE and HEAD methods are supported by the current Native HTTP version';
        }
        this.request = req;
        this.response = new Observable(function (responseObserver) {
            var headers = req.headers.toJSON();
            Object.keys(headers).map(function (key) {
                if (headers[key].length > 1) {
                    throw "Header " + key + " contains more than one value";
                }
                headers[key] = headers[key][0];
            });
            var body;
            // 1 stands for ContentType.JSON. Angular doesn't export ContentType
            if (req.detectContentTypeFromBody() === 1) {
                body = req.json();
            }
            else {
                body = _this.getBodyParams(req.getBody());
            }
            var requestMethod = _this.detectRequestMethod(req);
            /**
                             * Request contains either encoded either decoded URL depended on the way
                             * parameters are passed to Http component. Even though XMLHttpRequest automatically
                             * converts unencoded URL, NativeHTTP requires it to be always encoded.
                             */
            var url = encodeURI(decodeURI(req.url)).replace('%252F', '%2F');
            nativeHttp.setDataSerializer(_this.detectDataSerializerType(req));
            nativeHttp[requestMethod](url, body, headers)
                .then(function (response) {
                _this.fireResponse(responseObserver, new ResponseOptions({
                    body: response.data,
                    status: response.status,
                    headers: new Headers(response.headers),
                    url: response.url,
                }), baseResponseOptions);
            })
                .catch(function (error) {
                _this.fireResponse(responseObserver, new ResponseOptions({
                    body: error.error,
                    status: error.status || 599,
                    // https://httpstatuses.com/599
                    headers: new Headers(error.headers),
                    url: null,
                }), baseResponseOptions);
            });
        });
    }
    NativeHttpConnectionD.prototype.detectRequestMethod = function (req) {
        switch (req.method) {
            case RequestMethod.Post:
                return 'post';
            case RequestMethod.Put:
                return 'put';
            case RequestMethod.Delete:
                return 'delete';
            case RequestMethod.Patch:
                return 'patch';
            case RequestMethod.Head:
                return 'head';
            default:
                return 'get';
        }
    };
    NativeHttpConnectionD.prototype.detectDataSerializerType = function (req) {
        if (req.method === RequestMethod.Post ||
            req.method === RequestMethod.Put) {
            // 1 stands for ContentType.JSON. Angular doesn't export ContentType
            if (req.detectContentTypeFromBody() === 1) {
                return 'json';
            }
        }
        return 'urlencoded';
    };
    NativeHttpConnectionD.prototype.fireResponse = function (responseObserver, responseOptions, baseResponseOptions) {
        if (baseResponseOptions) {
            responseOptions = baseResponseOptions.merge(responseOptions);
        }
        var response = new Response(responseOptions);
        response.ok = response.status >= 200 && response.status < 300;
        if (response.ok) {
            responseObserver.next(response);
            responseObserver.complete();
        }
        else {
            responseObserver.error(response);
        }
    };
    NativeHttpConnectionD.prototype.getBodyParams = function (query) {
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
    return NativeHttpConnectionD;
}());
/**
 * @deprecated and will be gone
 */
export { NativeHttpConnectionD };
/**
 * @deprecated and will be gone. Use NativeHttpBackend instead
 */
var NativeHttpBackendD = /** @class */ (function () {
    function NativeHttpBackendD(nativeHttp, baseResponseOptions) {
        this.nativeHttp = nativeHttp;
        this.baseResponseOptions = baseResponseOptions;
    }
    NativeHttpBackendD.prototype.createConnection = function (request) {
        return new NativeHttpConnectionD(request, this.nativeHttp, this.baseResponseOptions);
    };
    NativeHttpBackendD.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NativeHttpBackendD.ctorParameters = function () { return [
        { type: HTTP, },
        { type: ResponseOptions, },
    ]; };
    return NativeHttpBackendD;
}());
export { NativeHttpBackendD };
//# sourceMappingURL=native-http-backend.js.map