import { Connection, ConnectionBackend, ReadyState, Request, Response, ResponseOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { Observable } from 'rxjs/Observable';
/**
 * @deprecated and will be gone
 */
export declare class NativeHttpConnectionD implements Connection {
    request: Request;
    response: Observable<Response>;
    readyState: ReadyState;
    constructor(req: Request, nativeHttp: HTTP, baseResponseOptions?: ResponseOptions);
    private detectRequestMethod(req);
    private detectDataSerializerType(req);
    private fireResponse(responseObserver, responseOptions, baseResponseOptions?);
    private getBodyParams(query);
}
/**
 * @deprecated and will be gone. Use NativeHttpBackend instead
 */
export declare class NativeHttpBackendD implements ConnectionBackend {
    private nativeHttp;
    private baseResponseOptions;
    constructor(nativeHttp: HTTP, baseResponseOptions: ResponseOptions);
    createConnection(request: Request): Connection;
}
