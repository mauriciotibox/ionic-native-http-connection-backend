import { Injectable } from '@angular/core';
import {
    Connection,
    ConnectionBackend,
    Headers,
    ReadyState,
    Request,
    RequestMethod,
    Response,
    ResponseOptions,
} from '@angular/http';
import { HTTP, HTTPResponse } from '@ionic-native/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { HTTPError } from '../http-error';

type HTTPRequestMethod =
    | 'get'
    | 'post'
    | 'post'
    | 'put'
    | 'delete'
    | 'patch'
    | 'head';

type DataSerializerType = 'json' | 'urlencoded';

/**
 * @deprecated and will be gone
 */
export class NativeHttpConnectionD implements Connection {
    request: Request;
    response: Observable<Response>;
    readyState: ReadyState;

    constructor(
        req: Request,
        nativeHttp: HTTP,
        baseResponseOptions?: ResponseOptions,
    ) {
        const allowedRequestMethods = [
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
        this.response = new Observable<Response>(
            (responseObserver: Observer<Response>) => {
                const headers = req.headers.toJSON();
                Object.keys(headers).map(function(key) {
                    if (headers[key].length > 1) {
                        throw `Header ${key} contains more than one value`;
                    }
                    headers[key] = headers[key][0];
                });

                let body;

                // 1 stands for ContentType.JSON. Angular doesn't export ContentType
                if (req.detectContentTypeFromBody() === 1) {
                    body = req.json();
                } else {
                    body = this.getBodyParams(req.getBody());
                }

                const requestMethod = this.detectRequestMethod(req);

                /**
                 * Request contains either encoded either decoded URL depended on the way
                 * parameters are passed to Http component. Even though XMLHttpRequest automatically
                 * converts unencoded URL, NativeHTTP requires it to be always encoded.
                 */
                const url = encodeURI(decodeURI(req.url)).replace(
                    '%252F',
                    '%2F',
                );

                nativeHttp.setDataSerializer(
                    this.detectDataSerializerType(req),
                );

                nativeHttp[requestMethod](url, body, headers)
                    .then((response: HTTPResponse) => {
                        this.fireResponse(
                            responseObserver,
                            new ResponseOptions({
                                body: response.data,
                                status: response.status,
                                headers: new Headers(response.headers),
                                url: response.url,
                            }),
                            baseResponseOptions,
                        );
                    })
                    .catch((error: HTTPError) => {
                        this.fireResponse(
                            responseObserver,
                            new ResponseOptions({
                                body: error.error,
                                status: error.status || 599, // https://httpstatuses.com/599
                                headers: new Headers(error.headers),
                                url: null,
                            }),
                            baseResponseOptions,
                        );
                    });
            },
        );
    }

    private detectRequestMethod(req: Request): HTTPRequestMethod {
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
    }

    private detectDataSerializerType(req: Request): DataSerializerType {
        if (
            req.method === RequestMethod.Post ||
            req.method === RequestMethod.Put
        ) {
            // 1 stands for ContentType.JSON. Angular doesn't export ContentType
            if (req.detectContentTypeFromBody() === 1) {
                return 'json';
            }
        }

        return 'urlencoded';
    }

    private fireResponse(
        responseObserver: Observer<Response>,
        responseOptions: ResponseOptions,
        baseResponseOptions?: ResponseOptions,
    ) {
        if (baseResponseOptions) {
            responseOptions = baseResponseOptions.merge(responseOptions);
        }

        const response = new Response(responseOptions);
        response.ok = response.status >= 200 && response.status < 300;

        if (response.ok) {
            responseObserver.next(response);
            responseObserver.complete();
        } else {
            responseObserver.error(response);
        }
    }

    private getBodyParams(query: string) {
        if (!query) {
            return {};
        }

        let paramsObj = (/^[?#]/.test(query) ? query.slice(1) : query).split('&');
        let obj = {};
        for (let i in paramsObj) {
            let param = paramsObj[i].split('=');
            if (obj[param[0]] != undefined && Array.isArray(obj[param[0]])) {
                obj[param[0]][obj[param[0]].length] = decodeURIComponent(param[1])
            } else if (obj[param[0]] != undefined) {
                let n = [];
                n[0] = decodeURIComponent(obj[param[0]]);
                n[1] = decodeURIComponent(param[1]);
                obj[param[0]] = n
            } else {
                obj[param[0]] = decodeURIComponent(param[1])
            }
        }
        
        return obj;
    }
}

/**
 * @deprecated and will be gone. Use NativeHttpBackend instead
 */
@Injectable()
export class NativeHttpBackendD implements ConnectionBackend {
    constructor(
        private nativeHttp: HTTP,
        private baseResponseOptions: ResponseOptions,
    ) {}

    createConnection(request: Request): Connection {
        return new NativeHttpConnectionD(
            request,
            this.nativeHttp,
            this.baseResponseOptions,
        );
    }
}
