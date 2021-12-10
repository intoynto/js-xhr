interface ILoose {
    [key: string]: any;
}
export declare type IUploadProgress = {
    loaded: number;
    total: number;
    percentage: number;
};
export interface Iajax extends ILoose {
    url: string;
    method?: string;
    type?: string;
    headers?: any;
    params?: any;
    formElement?: HTMLFormElement;
    formData?: FormData;
    responseType?: string;
    onResolve?: (xhr: XMLHttpRequest) => void;
    uploadProgress?: (props: IUploadProgress) => void;
}
export interface IajaxException {
    title: string;
    status: number;
    code: number;
    statusText: string;
    message: string;
    description: string;
    xhr: XMLHttpRequest;
    [p: string]: any;
}
export declare function ajax(ops: Iajax): Promise<unknown>;

export declare function getKeyByUrl(url?: string): string;
export declare function ajaxRemoveByUrl(url: string): void;
export declare function ajaxCache(se: Iajax, timeOut?: number): Promise<unknown>;

export declare function createFormData(obj: any, formDataAppending?: FormData, namespace?: any): FormData;

export { ajax, getObserve, ajaxCache, ajaxRemoveByUrl };
export type { Iajax } from "./ajax";

export declare type Ilistener = (xhr: XMLHttpRequest) => void;
interface IObjserveAjax {
    listen: (xhr: XMLHttpRequest) => void;
    subscribe: (listener: Ilistener) => string;
    unSubscribe: (key: string) => void;
}
export declare function getObserve(): IObjserveAjax;

export declare function serialize(obj?: any, key?: any, list?: any[]): string;
