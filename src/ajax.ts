/**
 * @author intoy
 * @email intoynto@gmail.com
 * @create date 2020-10-11 22:32:10
 * @modify date 2020-10-22 10:41:12
 * @desc XML Http Request
 */

import { getObserve } from "./observe";
import { createFormData } from "./createFormData";
import {serialize} from "./serialize";

interface ILoose {
    [key: string]: any,
}
export type IUploadProgress = {
    loaded:number
    total:number
    percentage:number
}

export interface Iajax extends ILoose {
    url:string,    
    method?:string,
    type?:string,
    headers?:any,
    params?:any,   
    formElement?:HTMLFormElement,
    formData?:FormData
    responseType?:string,    
    onResolve?:(xhr:XMLHttpRequest)=>void
    uploadProgress?:(props:IUploadProgress)=>void
}

export interface IajaxException {
    title:string
    status:number
    code:number
    statusText:string
    message:string
    description:string
    xhr:XMLHttpRequest
    [p:string]:any,
}


type IrunAjaxResolveOptions={
    xhr:XMLHttpRequest
    formData:FormData
    handleToJson:boolean
}

type IrunAjaxResolve=(props:IrunAjaxResolveOptions)=>void

function runAjax({...ops}:Iajax)
{   
    return new Promise((resolve:IrunAjaxResolve,reject)=>{              
        const mType=(ops.method?ops.method:ops.type?ops.type:"GET").toString().toUpperCase().trim();
        const rspType=ops.responseType||"json"; //default response type of json

        const dataParams=ops.params && typeof ops.params==="object"?ops.params:ops.data && typeof ops.data==="object"?ops.data:null;
        const isDataParams=dataParams!==undefined && dataParams!==null;
        const handleToJson=(rspType||"").toLowerCase().trim()==="json";

        let sendF;
        let toUrl=(ops.url||"").toString().trim();
        
        if(ops.formElement)
        {                
            sendF=new FormData(ops.formElement);

            //remove empty upload
            const inputs=ops.formElement.querySelectorAll('input[type=file]');            
            const removes=[];
            if(inputs.length>0)
            {
                for(let i=0; i<inputs.length; i++)
                {
                    const ii:HTMLInputElement=inputs[i] as HTMLInputElement;
                    let file=ii.files && ii.files.length>0?ii.files[0]:null;
                    if(!file)
                    {
                        removes.push(ii.name);
                    }                   
                }
            }                        
            for(let i=0; i<removes.length; i++)
            {
                ///remove upload empty
                sendF.delete(removes[i]);
            }
        }
        else
        if(ops.formData){            
            sendF=ops.formData;
        }
        
        if(isDataParams){          
            if (sendF){
                createFormData(dataParams, sendF);
            }            
            else {                
                if(mType==="GET") 
                {
                    let ser=serialize(dataParams);
                    if(ser.length>0){
                        if(toUrl.indexOf("?")<0){
                            toUrl+="?";
                        }
                        toUrl+=ser;
                    }
                }  
                else {
                    sendF=createFormData(dataParams);
                }              
            } 
        }


        const xhr=new XMLHttpRequest();  
            
        xhr.open(mType,toUrl);
        
        if(ops.headers)
        {
            for(let p in ops.headers){                
                xhr.setRequestHeader(p,ops.headers[p]);
            }
        }        
        if(handleToJson)
        {
            xhr.setRequestHeader('accept','application/json');
        }

        resolve({
            xhr:xhr,
            formData:sendF as FormData,
            handleToJson:handleToJson
        });
    });
}

export function ajax(ops:Iajax)
{
    const dispatchObserve=(xhr:XMLHttpRequest)=>{
        getObserve().listen(xhr);
    };

    return new Promise((resolve,reject)=>{
        runAjax(ops)
        .then((props:IrunAjaxResolveOptions)=>
        {
            const {handleToJson}=props;
            const onLoadEnd=(ev:ProgressEvent<XMLHttpRequestEventTarget>)=>{
                const t:XMLHttpRequest=ev.target as XMLHttpRequest;
                
                const pe:IajaxException={
                    title:'Throw',
                    status:xhr.status,
                    code:xhr.status,
                    statusText:xhr.statusText,
                    message:xhr.statusText,
                    description:'',
                    xhr:xhr,
                };

                const berhasil=t.status===200;
                let isjson;
                if(t.responseType.toString().toLowerCase()!=='json'){
                    let ct=t.getResponseHeader('content-type');
                    ct=ct?ct.toString().toLowerCase().trim():'';
                    ct.split(';');
                    isjson=ct.indexOf('application/json')>0;                   
                }  
                if(!berhasil)
                {
                    pe.title = 'Throw ' + xhr.status;
                    try {
                        const t = JSON.parse(xhr.responseText);
                        if (typeof t === 'object') {
                            const ce = Array.isArray(t.exception) ? t.exception[0] : null;
                            if (ce) {
                                pe.message = ce.message;
                                pe.description = ce.description ? ce.description : ce.message;
                            }
                            else {
                                pe.message = t.error && t.error.message ? t.error.message
                                    : t.message ? t.message
                                        : pe.message;

                                pe.description = t.error && t.error.description ? t.error.description
                                    : t.description ? t.description
                                        : pe.description;
                            }

                        }
                        dispatchObserve(t);
                        reject(pe);
                    }
                    catch (e) {
                        dispatchObserve(t);
                        reject(pe);
                    }
                    return;
                }               

                if(handleToJson || isjson)
                {
                    let str=(xhr.responseText||"").toString().trim();
                    if(str.length<1)
                    {
                        pe.message='Tidak ada result dari server.';
                        dispatchObserve(t);
                        reject(pe);
                        return;
                    }

                    //try to json
                    try {
                        let data = JSON.parse(xhr.responseText);
                        dispatchObserve(t);
                        resolve(data);
                    }
                    catch (e: any) 
                    {
                        pe.code = 409; //HTTP Conflict
                        pe.message = 'Parse error. ' + (e.message ? e.message : "Unknown error.");
                        dispatchObserve(t);
                        reject(pe);
                    }

                    return;
                }
                dispatchObserve(t);
                resolve(xhr.response);
            };

            const onError=(ev:ProgressEvent<XMLHttpRequestEventTarget>)=>{
                const t:XMLHttpRequest=ev.target as XMLHttpRequest;
                dispatchObserve(t);
                reject({title:"Throw",message:"Unknown error.",xhr:t});
            }

            const {xhr,formData}=props;          
            
            // atach event
            xhr.addEventListener("loadend",onLoadEnd);
            xhr.addEventListener("error",onError);
            if(typeof ops.uploadProgress==='function')
            {
                const upProgres:(newProps:IUploadProgress)=>void=ops.uploadProgress;
                xhr.upload.addEventListener("progress",function(ev:ProgressEvent<XMLHttpRequestEventTarget>){
                    const {loaded,total}=ev;
                    const percentage=(loaded / total) * 100;
                    upProgres({loaded,total,percentage});
                });
            }
            // send data
            xhr.send(formData);
        })
        .catch((e:any)=>{
            reject({title:"Throw",message:e && e.message?e.message:"Unknown error."});
        });
    });
}