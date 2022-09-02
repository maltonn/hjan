import {Send} from './functions.js'
let cookie = {}

if(document.cookie){
    document.cookie.split(';').forEach(e => cookie[decodeURIComponent(e.split('=')[0])] = Number(e.split('=')[1]))
}


let data = [{ 'elm': 'オフラインです','vote_num':'1','degre':'0'}]

let vote_weight_mode=true


/*
data = [
    { 'elm': '要素1','vote':1,'degree':1,'warn':{'a':true,'b':false,'c':false},'uv':1},
    ...
]
*/


function randint(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//アニメーション起動＆要素の追加
let black_triangles_flag=false
let degree=0
let element=''
let vote_num=0

function VoteToScore(vote){
    return Math.sqrt(vote)
}

function Lounch(data) {
    let counter=0
    while (true) {
        counter+=1
        if(counter>10000){
            window.alert('条件に合う要素が存在しません')
            return
        }

        let chosen=null
        if(vote_weight_mode){
            
            let sum_vote=0
            for(let i=0;i<data.length;i++){
                sum_vote+=VoteToScore(data[i]['vote'])
            }
            let r=randint(sum_vote)
            for(let i=0;i<data.length;i++){
                r-=VoteToScore(data[i]['vote'])
                if(r<0){
                    chosen=data[i]
                    break
                }
            } 
        }else{
            chosen = data[randint(data.length)]
        }
        element=chosen['elm']
        degree=Number(chosen['degree'])
        vote_num=Number(chosen['vote'])

        
        /*
        let flag=false
        for(i=0;i<ng_warning.length;i++){
            if (chosen['warning'] && chosen['warning'].includes(ng_warning[i])){
                flag=true
                break
            }
        }
        if(flag){
            continue
        }
        */

        if(! degree==undefined || !((max_deg==-1 || degree<=max_deg) && (min_deg==-1 || min_deg<=degree))){
            continue
        }
        
        //「複数ターンにわたって毎回○○が登場する」みたいなのを避けたい処理  
        if(true){//レア度は関係ない
            if (cookie[element]==undefined) {
                cookie[element]=0
                break
            }else{

                cookie[element]+=1
                if(2**Math.floor(Math.log2(cookie[element]))==cookie[element] && cookie[element]>=4){
                    console.log(cookie)
                    break
                }
            }
        }
        
        /*レアな奴ほど出にくく
        else{
            if (cookie[element]==undefined) {
                if(degree<=3){
                    cookie[element] = 0
                    break
                }else{
                    cookie[element] = -1
                }
            } else {
                cookie[element] += 1
                if (cookie[element] % (degree<=3?5:7) == 0) {
                    break
                }
            }
        }
        */
    }
    
    let stars=document.getElementsByClassName('star')
    for(i=0;i<stars.length;i++){
        if(i<degree){
            stars[i].style.display='block'
        }else{
            stars[i].style.display='none'
        }
    }

    let box_col='#00FFDD'//水色 
    let timeout=7700

    if(degree==3){
        box_col='#ff9900'//金
        timeout=8300
    }
    if(degree>=4){
        timeout=8900
        box_col='#884499'//紫
        SetTriangles(['BB6588','CCAA87','8889CC','DDAACB'])
        circle1.style.backgroundColor='#BB6588'
        circle3.style.backgroundColor='#CCAA87'
        circle5.style.backgroundColor='#8889CC'
        black_triangles_flag=true
    }else{
        if(black_triangles_flag){
            SetTriangles(['33AAEE','EE6666','BBDE22','FFDB42'])
            circle1.style.backgroundColor='#33AAEE'
            circle3.style.backgroundColor='#EE6666'
            circle5.style.backgroundColor='#BBDE22'
            black_triangles_flag=false
        }
    }
    
    box_main.style.backgroundColor=box_col
    box_border.style.border='3px solid '+box_col

    animation.style.display = 'block'
    setTimeout(() => {
        animation.style.opacity = '0'
        setTimeout(() => {
            animation.style.display = 'none'
            animation.style.opacity = '1'
        }, 1000)
    }, timeout)

    let tr = document.createElement('tr')
    element_h1.innerText = element

    let td = document.createElement('td')
    td.innerText = element

    let td2 = document.createElement('td')
    td2.innerText = ('★'.repeat(degree)+'　'.repeat(5)).slice(0,5)

    let td3 = document.createElement('td')
    td3.innerText = vote_num

    let td_close = document.createElement('td')
    td_close.classList.add('uk-text-right')
    let span = document.createElement('span')
    span.setAttribute('uk-icon', 'icon:close')
    span.classList.add('pointer')
    span.addEventListener('click', function () {
        this.parentNode.parentNode.outerHTML = ''
    })
    td_close.appendChild(span)
    
    tr.appendChild(td)
    tr.appendChild(td3)
    tr.appendChild(td2)
    tr.appendChild(td_close)
    

    main_body.appendChild(tr)
    /*
    for (key of Object.keys(cookie)) {
        document.cookie = encodeURIComponent(key.trim()) + '=' + cookie[key]
    }
    */
   now_covered_number.innerText='（うち未開封'+(data.length-Object.keys(cookie).length)+'個）'
}

let params = {}
try {
    (decodeURI(location.href).split('?')[1]).split('&').forEach(e => params[e.split('=')[0]] = e.split('=')[1])
} catch (e) {
    console.log(e)
}

params['method']='pick'
Send(params,CallBack)

function CallBack(res){
    data=res
    now_number.innerText = '現在登録されている属性は' + data.length + '個です！'
    now_covered_number.innerText='（うち未開封'+(data.length-Object.keys(cookie).length+2)+'個）'/*なんかデフォルトで変な値が2個ある */
    let loader=document.getElementById('loader')
    if(loader){
      loader.style.display='None'
    }
}

//キーボードショートカット
document.addEventListener('keydown', (e) => {
    console.log(e.code)
    if (e.code == 'Space' || e.code == 'Enter') {
        Lounch(data)
    }else if (e.code == 'Backspace') {
        main_body.children[main_body.children.length - 1].outerHTML = ''
    }else if (e.code == 'KeyR') {
        Refresh()
    }else if(e.code=='KeyS'){
        tmp=document.getElementById('settings')
        tmp.style.display=tmp.style.display=='block'?'none':'block'
    }
})

//ダイスを振る
document.getElementById('get_btn').addEventListener('click', () => {
    Lounch(data)
})
document.getElementById('reload_btn').addEventListener('click', () => {
    Send(params,CallBack)
    Refresh()
})

//リフレッシュ
let NowNo = 1
function Refresh() {
    let li = document.createElement('li')
    li.innerHTML = '<table  class="uk-table uk-table-striped"><tbody></tbody></table>'
    li.children[0].children[0].innerHTML = main_body.innerHTML
    let icons = [...li.getElementsByTagName('span')]//close iconを消す
    for (let icon of icons) {
        icon.outerHTML = ''
    }
    switcher_contents.appendChild(li)

    let li2 = document.createElement('li')
    li2.innerHTML = '<a>No.' + NowNo + '</a>'
    NowNo++
    switcher.appendChild(li2)
    main_body.innerHTML = ''
}

document.getElementById('settings_btn').addEventListener('click', () => {
    document.getElementById('settings').style.display = 'block'
})

let max_deg=-1
let min_deg=-1
document.getElementById('close_settings').addEventListener('click', () => {
    document.getElementById('settings').style.display = 'none'
})
document.getElementById('max_degree_input').addEventListener('change',function(){
    max_deg=this.value
})
document.getElementById('max_degree_input').addEventListener('change',function(){
    max_deg=this.value
})
document.getElementById('min_degree_input').addEventListener('change',function(){
    min_deg=this.value
})
