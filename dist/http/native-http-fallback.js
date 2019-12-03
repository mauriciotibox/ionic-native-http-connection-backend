import { Injectable } from '@angular/core';
import { ConnectionBackend } from '@angular/http';
import { checkAvailability } from '@ionic-native/core';
import { NativeHttpBackendD } from './native-http-backend';
/**
 * @deprecated and will be gone. Use NativeHttpFallback instead
 */
var NativeHttpFallbackD = /** @class */ (function () {
    function NativeHttpFallbackD(nativeHttpBackend, fallback) {
        this.nativeHttpBackend = nativeHttpBackend;
        this.fallback = fallback;
        this.nativeIsForced = null;
        this.nativeIsAvailable = null;
    }
    NativeHttpFallbackD.prototype.createConnection = function (request) {
        /**
                 * Native HTTP Cordova plugin doesn't like local requests
                 */
        var isOutgoingRequest = /^(http|https):\/\//.test(request.url);
        if (isOutgoingRequest && this.isNativeHttpAvailable()) {
            return this.nativeHttpBackend.createConnection(request);
        }
        else {
            return this.fallback.createConnection(request);
        }
    };
    /**
     * Enable/disable forced native HTTP usage without preliminary check. Helpful for unit testing
     *
     * @param {boolean} isEnabled
     */
    /**
         * Enable/disable forced native HTTP usage without preliminary check. Helpful for unit testing
         *
         * @param {boolean} isEnabled
         */
    NativeHttpFallbackD.prototype.forceNative = /**
         * Enable/disable forced native HTTP usage without preliminary check. Helpful for unit testing
         *
         * @param {boolean} isEnabled
         */
    function (isEnabled) {
        this.nativeIsForced = isEnabled;
    };
    NativeHttpFallbackD.prototype.isNativeHttpAvailable = function () {
        if (this.nativeIsForced !== null) {
            return this.nativeIsForced;
        }
        if (this.nativeIsAvailable === null) {
            this.nativeIsAvailable =
                checkAvailability('cordova.plugin.http') === true;
        }
        return this.nativeIsAvailable;
    };
    NativeHttpFallbackD.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NativeHttpFallbackD.ctorParameters = function () { return [
        { type: NativeHttpBackendD, },
        { type: ConnectionBackend, },
    ]; };
    return NativeHttpFallbackD;
}());
export { NativeHttpFallbackD };
//# sourceMappingURL=native-http-fallback.js.map