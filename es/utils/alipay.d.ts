export declare function setStorageSync(key: any, data: any): void;
export declare function setStorage(key: any, data: any): void;
export declare function getStorageSync(key: any): any;
export declare function guid(): string;
export declare function setUID(key: any, uid: any): any;
export declare function getUUid(callback: any): void;
export declare function getSessionId(): string;
export declare function getBasicInfo(callback: Function): Promise<void>;
export declare function requestNext(that: any): void;
export declare function request(url: any, msg: any, that: any): void;
export declare function cutUrlSearch(t: any): string;
export declare function checkAPI(t: any, e: any): boolean;
export declare function getPropertyValue(j: any, arr: string[]): string | undefined;
export declare function ext(t: any, ..._: any[]): any;
export declare function isObject(d: any): boolean;
export declare function isString(d: any): boolean;
export declare function isJSON(str: any, pass_object?: boolean): boolean;
export declare function hookRequest(mtr: any): void;
export declare function hookGetLocation(mtr: any): void;
