import {Send} from './functions.js'

let params = {}
try {
    (decodeURI(location.href).split('?')[1]).split('&').forEach(e => params[e.split('=')[0]] = e.split('=')[1])
} catch (e) {
    console.log(e)
}


function MakeTable(res) {
    let loader=document.getElementById('loader')
    if (loader){
        loader.style.display='none'
    }
    let data = res
    /*
    let tmp = []
    for (let d of data) {
        for (let key of Object.keys(d)) {
            if (key != 'primary_key' && key != 'sid' && key!='warns') {
                tmp.push(key)
            }
        }
    }
    let st = new Set(tmp)
    let keys_lst = [...st.values()]
    */
    let keys_lst=['elm','degree','vote','uv']
    keys_lst.push('edit')
    for (let key of keys_lst) {
        let th = document.createElement('th')
        th.innerText = key
        th.classList.add('uk-text-left')
        table_keys.appendChild(th)
    }
    for (let d of data) {
        let tr = document.createElement('tr')
        tr.setAttribute('data-primary_key',d['elm'])
        for (let key of keys_lst) {
            let td = document.createElement('td')
            if (key=='edit'){
                let icon=document.createElement('button')
                icon.setAttribute('uk-icon','icon: pencil')
                icon.setAttribute('data-status','waiting')
                icon.style.color='black'
                icon.classList.add('pointer','uk-button','uk-button-link')
                icon.addEventListener('click',function(){
                    let tr=this.parentNode.parentNode
                    if (this.getAttribute('data-status')=='waiting'){
                        this.setAttribute('data-status','editing')
                        let tds=tr.getElementsByTagName('td')
                        for(let i=0;i<tds.length-1;i++){
                            let input=document.createElement('input')
                            input.classList.add('uk-input','uk-width-1-3')
                            input.value=tds[i].innerText
                            tds[i].innerHTML=''
                            tds[i].append(input)
                        }
                        this.setAttribute('uk-icon','icon: cloud-upload; ratio: 1.2')
                    }else if(this.getAttribute('data-status')=='editing'){
                        this.setAttribute('data-status','done')
                        this.style.display='None'
                        let inputs=[...tr.getElementsByTagName('input')]
                        let dic1={
                            'method':'fix',
                        }
                        
                        for(let i=0;i<inputs.length;i++){
                            dic1[keys_lst[i]]=inputs[i].value
                            inputs[i].parentNode.innerHTML=inputs[i].value
                        }
                        console.log(dic1)
                        Send(dic1,null)

                        let dic2={
                            'method':'delete',
                            'primary_key':tr.getAttribute('data-primary_key')
                        }
                        Send(dic2,null)
                        this.outerHTML=''
                    }
                })
                td.appendChild(icon)
                
            }else{
                td.innerText = d[key] || ''
            }
            tr.appendChild(td)
        }
        
        main_body.appendChild(tr)
    }
}

params['method']='pick'
Send(params,MakeTable)
