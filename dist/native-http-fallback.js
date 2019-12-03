import { HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { checkAvailability } from '@ionic-native/core';
import { Platform } from 'ionic-angular';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { switchMap } from 'rxjs/operators/switchMap';
import { NativeHttpBackend } from './native-http-backend';
import { checkExternalRequest } from './utils/check-external-request';
var NativeHttpFallback = /** @class */ (function () {
    function NativeHttpFallback(platform, cordovaHttpBackend, fallbackBackend) {
        this.platform = platform;
        this.cordovaHttpBackend = cordovaHttpBackend;
        this.fallbackBackend = fallbackBackend;
    }
    NativeHttpFallback.prototype.handle = function (req) {
        var _this = this;
        return fromPromise(this.platform.ready()).pipe(switchMap(function () {
            /**
                             * Native HTTP Cordova plugin doesn't like local requests
                             */
            var isExternalRequest = checkExternalRequest(req);
            if (isExternalRequest &&
                checkAvailability('cordova.plugin.http') === true) {
                return _this.cordovaHttpBackend.handle(req);
            }
            else {
                return _this.fallbackBackend.handle(req);
            }
        }));
    };
    NativeHttpFallback.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NativeHttpFallback.ctorParameters = function () { return [
        { type: Platform, },
        { type: NativeHttpBackend, },
        { type: HttpBackend, },
    ]; };
    return NativeHttpFallback;
}());
export { NativeHttpFallback };
//# sourceMappingURL=native-http-fallback.js.map