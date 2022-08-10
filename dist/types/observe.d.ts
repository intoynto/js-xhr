declare type Ilistener = (xhr: XMLHttpRequest) => void;
interface IObjserveAjax {
    listen: (xhr: XMLHttpRequest) => void;
    subscribe: (listener: Ilistener) => string;
    unSubscribe: (key: string) => void;
}
export declare function getObserve(): IObjserveAjax;
export {};
