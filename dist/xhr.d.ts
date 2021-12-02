declare module "intoy-xhr"
{
	interface ILoose {
	    [key: string]: any;
	}
	export type IUploadProgress = {
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
	export function ajax(ops: Iajax): Promise<unknown>;
	export {};

	import { Iajax } from ".";
	export function getKeyByUrl(url?: string): string;
	export function ajaxRemoveByUrl(url: string): void;
	export function ajaxCache(se: Iajax, timeOut?: number): Promise<unknown>;

	export function createFormData(obj: any, formDataAppending?: FormData, namespace?: any): FormData;

	import { ajax } from "./ajax";
	import { getObserve } from "./observe";
	export { ajax, getObserve };
	export type { Iajax } from "./ajax";

	type Ilistener = (xhr: XMLHttpRequest) => void;
	interface IObjserveAjax {
	    listen: (xhr: XMLHttpRequest) => void;
	    subscribe: (listener: Ilistener) => string;
	    unSubscribe: (key: string) => void;
	}
	export function getObserve(): IObjserveAjax;
	export {};

	export function serialize(obj?: any, key?: any, list?: any[]): string;

}