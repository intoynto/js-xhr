export function createFormData(obj:any,formDataAppending?:FormData,namespace?:any){
    const formData=formDataAppending?formDataAppending:new FormData();
    for(let property in obj){
        const formKey=namespace?`${namespace}[${property}]`:property;
        if(obj[property] instanceof Date){
            formData.append(formKey,obj[property].toString());
        }
        else if(Array.isArray(obj[property]) && obj[property].length>0){
            const args=obj[property];
            for(let i=0; i<args.length; i++){               
                if(typeof args[i]==="object"){
                    createFormData(args[i],formData,`${formKey}[${i}]`)
                }
                else {
                   formData.append(`${formKey}[]`,args[i]); 
                }
            }
        }
        else if(typeof obj[property]==="object" && !(obj[property] instanceof File))
        {            
            createFormData(obj[property],formData,formKey);
        }
        else{            
            const val=obj[property];
            if(val!==null && val!==undefined)
            {               
                formData.append(formKey,val);
            }
        }
    }
    return formData;
}