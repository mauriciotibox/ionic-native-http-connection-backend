import { HttpBackend, HttpEvent, HttpRequest } from '@angular/common/http';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { NativeHttpBackend } from './native-http-backend';
export declare class NativeHttpFallback implements HttpBackend {
    private platform;
    private cordovaHttpBackend;
    private fallbackBackend;
    constructor(platform: Platform, cordovaHttpBackend: NativeHttpBackend, fallbackBackend: HttpBackend);
    handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
}
