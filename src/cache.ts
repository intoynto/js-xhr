import { ajax, Iajax } from "./ajax";
import { toInt, toStr } from "intoy-utils";


interface IstoreAjax {
    setUrl:(url?:string)=>this
    setMethod:(method?:string)=>this
    setParams:(params?:any)=>this
    setData:(data?:any)=>this
    invalidate:()=>void
    getKey:(useInvalidate?:boolean)=>string

    equalUrl:(url?:string)=>boolean
}

type IstoreAjaxProps = {
    url:string
    method?:string
    params?:any
}

class StoreAjax implements IstoreAjax
{
    private key:string='';
    private method:string='GET';
    private url:string='';
    private params:any={};

    constructor(props:IstoreAjaxProps)
    {
        props=props||{} as IstoreAjaxProps;
        this.setUrl(props.url)
        .setMethod(props.method)
        .setParams(props.params)
        ;
    }

    setUrl=(url?:string)=>{
        this.url=toStr(url).toString().trim();
        return this;
    }

    setMethod=(method?:string)=>
    {
        method=toStr(method).toString().toUpperCase().trim();
        const methods=['GET','POST','PUT','DELETE'];
        const iof=methods.indexOf(method);
        this.method=iof>=0?methods[iof]:'GET';
        return this;        
    }

    setParams=(params?:any)=>{
        this.params={...(params||{})};
        return this;
    }

    setData=(data?:any)=>{
        this.params={...(data||{})};
        return this;
    }    

    invalidate=()=>{
        const obj:any={
            url:this.url,
            method:this.method,
            params:this.params,
        };
        this.key=JSON.stringify(obj);
    }

    getKey=(invalidate?:boolean)=>{
        if(invalidate)
        {
            this.invalidate();
        }
        return this.key;
    }

    equalUrl=(url?:string)=>{
        return this.url===toStr(url).toString().trim();
    }
}

type IlocalCacheProps = {
    limit?:number
}

type IresponseData = {
    response:any
    time:number
}

class LocalCache 
{
    protected keys:any[]=[];
    protected data:any;
    protected limit:number=1000;
    protected expires:number[]=[];
    protected store:IstoreAjax[]=[];

    constructor(props:IlocalCacheProps)
    {
        this.keys=[];
        this.data={};
        if(props.limit)
        {
            this.limit=props.limit>1?props.limit
                       :props.limit===1?2
                       :props.limit<1?2:props.limit;
        }
    }

    protected internalRemove(key:string)
    {
        const iof=this.keys.indexOf(key);
        if(iof>=0)
        {
            this.keys.splice(iof,1);
            this.expires.splice(iof,1);
            this.store.splice(iof,1);
            delete this.data[key];
        }
    }


    getKeyByUrl=(url?:string)=>{
        if(url && this.store.length>0)
        {
            for(let i=0; i<this.store.length; i++)
            {
                if(this.store[i].equalUrl(url))
                {
                    return this.store[i].getKey();
                }                
            }
        }
    }

    removeByUrl=(url?:string)=>{
        this.internalRemove(this.getKeyByUrl(url) as string);
    }

    protected keyFromSe(se:Iajax):IstoreAjax
    {
        se=se||{} as Iajax;
        const p=new StoreAjax({
            url:se.url,
            method:se.method
        });
        
        let params:any={};
        if(se.params)
        {
            params={...se.params};
        }
        else
        if(se.data)
        {
            params={...se.data};
        }

        const page=toInt(se.params && se.params.page?se.params.page:1);
        params.page=page;

        p.setParams(params);
        p.invalidate();
        return p;
    }

    get(se:Iajax, timeOut:number=((new Date()).getTime()))
    {
        return new Promise((resolve,reject)=>
        {
            const p=this.keyFromSe(se);
            const key=p.getKey();
            let next:boolean=true;
            let responseTime:number=(new Date()).getTime();
            if(this.data[key])
            {
                // check is expires
                const iof=this.keys.indexOf(key);
                const expireTime=this.expires[iof] as number;
                const responseDataTime=(this.data[key] as IresponseData).time;
                const currTime=(new Date()).getTime();
                const sisa_waktu = currTime - responseDataTime;
                const isExpire=sisa_waktu > expireTime ;
                const originResponseTime=responseTime;

                responseTime=responseDataTime;


                if(isExpire)
                {
                    next=true;
                    responseTime=originResponseTime;
                    this.internalRemove(key);
                }
                else {
                    next=false;
                    
                    resolve((this.data[key] as IresponseData).response);
                }
            }

            if(next)
            {
                ajax(se)
                .then((n:any)=>
                {   
                    if(this.keys.length>this.limit)
                    {
                        const stop=Math.floor(this.keys.length/2);
                        while(this.keys.length>stop)
                        {
                            this.internalRemove(this.keys[0]);
                        }
                    }
                    this.expires.push(timeOut);
                    this.keys.push(key); // push in array
                    this.store.push(p);
                    const response:IresponseData={
                        response:n,
                        time:responseTime,
                    };
                    this.data[key]={...response};
                    resolve(n);
                })
                .catch(e=>reject(e))
            }
        });
    }


    
}

let cache:any;

function getCache():LocalCache
{
    if(!cache){
        cache=new LocalCache({});
    }
    return cache;
}

export function getKeyByUrl(url?:string)
{
    return getCache().getKeyByUrl(url);
}

export function ajaxRemoveByUrl(url:string)
{
    getCache().removeByUrl(url);
}

export function ajaxCache(se:Iajax, timeOut:number=((new Date()).getTime()))
{
    return getCache().get(se,timeOut);
}