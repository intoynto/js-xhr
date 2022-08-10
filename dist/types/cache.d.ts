import { Iajax } from "./ajax";
export declare function getKeyByUrl(url?: string): string | undefined;
export declare function ajaxRemoveByUrl(url: string): void;
export declare function ajaxCache(se: Iajax, timeOutSeconds?: number): Promise<unknown>;
