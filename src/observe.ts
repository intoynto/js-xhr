type Ilistener=(xhr:XMLHttpRequest)=>void

interface IObjserveAjax {
    listen:(xhr:XMLHttpRequest)=>void
    subscribe:(listener:Ilistener)=>string
    unSubscribe:(key:string)=>void
}


class ObserveAjax implements IObjserveAjax 
{   
    private listenerKeys:string[]=[]; 
    private listenters:any;
    constructor()
    {
        this.listenters={};
        this.subscribe=this.subscribe.bind(this);
        this.unSubscribe=this.unSubscribe.bind(this);
        this.listen=this.listen.bind(this);
    }

    subscribe(listener:Ilistener){
        const key:string=Math.random().toString(36);
        this.listenters[key]=listener;
        return key;
    }

    unSubscribe(key:string){
        const iof=this.listenerKeys.indexOf(key);
        if(iof>=0)
        {
            this.listenerKeys.splice(iof);
            delete this.listenters[key];
        }
    }

    listen(xhr:XMLHttpRequest)
    {
        for(let p in this.listenters)
        {
            const val=this.listenters[p];
            if(typeof val==="function")
            {
                try {
                    val(xhr);
                }
                catch(e)
                {

                }
            }
        }
    }
}


let observe:IObjserveAjax|null=null;

export function getObserve():IObjserveAjax
{
    if(!observe)
    {
        observe=new ObserveAjax();
    }
    return observe;
}