export function serialize(obj?:any,key?:any,list?:any[]){
    list=list || [];    
    if(typeof(obj)==="object"){
        for(let idx in obj){
            const val=obj[idx];
            if(val!==null && val!==undefined){
                serialize(val,key?key+'['+idx+']':idx,list);
            }           
        }
    }
    else{
        if(typeof obj==='string')
        {
            if(obj.toString().trim().length>0)
            {
                list.push(key+='='+encodeURIComponent(obj));
            }
        }
        else {
            list.push(key+='='+encodeURIComponent(obj));
        }
    }
    return list.join('&');
}