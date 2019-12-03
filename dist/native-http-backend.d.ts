import { HttpBackend, HttpEvent, HttpRequest } from '@angular/common/http';
import { HTTP } from '@ionic-native/http';
import { Observable } from 'rxjs';
export declare class NativeHttpBackend implements HttpBackend {
    private nativeHttp;
    constructor(nativeHttp: HTTP);
    handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
    private getSerializerTypeByContentType(req);
    private detectDataSerializerType(req);
    private getBodyParams(query);
}
