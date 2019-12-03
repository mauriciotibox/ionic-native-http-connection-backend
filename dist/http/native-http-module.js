import { NgModule } from '@angular/core';
import { HttpModule, XHRBackend } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { NativeHttpBackendD } from './native-http-backend';
import { NativeHttpFallbackD } from './native-http-fallback';
/**
 * @deprecated and will be gone. Use NativeHttpModule instead
 */
var NativeHttpModuleD = /** @class */ (function () {
    function NativeHttpModuleD() {
    }
    NativeHttpModuleD.decorators = [
        { type: NgModule, args: [{
                    imports: [HttpModule],
                    providers: [
                        HTTP,
                        NativeHttpBackendD,
                        {
                            provide: NativeHttpFallbackD,
                            useClass: NativeHttpFallbackD,
                            deps: [NativeHttpBackendD, XHRBackend],
                        },
                    ],
                },] },
    ];
    return NativeHttpModuleD;
}());
export { NativeHttpModuleD };
//# sourceMappingURL=native-http-module.js.map