/**
 * @author intoy
 * @email intoynto@gmail.com
 * @create date 2020-10-11 22:32:10
 * @modify date 2020-10-22 10:41:12
 * @desc XML Http Request
 */
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
export {};
