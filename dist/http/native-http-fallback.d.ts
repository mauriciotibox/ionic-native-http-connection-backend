import { Connection, ConnectionBackend, Request } from '@angular/http';
import { NativeHttpBackendD } from './native-http-backend';
/**
 * @deprecated and will be gone. Use NativeHttpFallback instead
 */
export declare class NativeHttpFallbackD implements ConnectionBackend {
    private nativeHttpBackend;
    private fallback;
    protected nativeIsForced: boolean | null;
    protected nativeIsAvailable: boolean | null;
    constructor(nativeHttpBackend: NativeHttpBackendD, fallback: ConnectionBackend);
    createConnection(request: Request): Connection;
    /**
     * Enable/disable forced native HTTP usage without preliminary check. Helpful for unit testing
     *
     * @param {boolean} isEnabled
     */
    forceNative(isEnabled: boolean): void;
    protected isNativeHttpAvailable(): boolean;
}
