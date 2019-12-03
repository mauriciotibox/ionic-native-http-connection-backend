import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { NativeHttpBackend } from './native-http-backend';
var NativeHttpModule = /** @class */ (function () {
    function NativeHttpModule() {
    }
    NativeHttpModule.decorators = [
        { type: NgModule, args: [{
                    imports: [HttpClientModule],
                    providers: [HTTP, NativeHttpBackend],
                },] },
    ];
    return NativeHttpModule;
}());
export { NativeHttpModule };
//# sourceMappingURL=native-http-module.js.map