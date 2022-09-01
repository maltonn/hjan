import { Send } from './functions.js'
loader.style.display = 'none'



let params = {'sid':7}
try {
  (decodeURI(location.href).split('?')[1]).split('&').forEach(e => params[e.split('=')[0]] = e.split('=')[1])
} catch (e) {
  console.log(e)
}


let keys = Object.keys(params)
let num = 1

/*
while (true) {
  let hn = 'h' + num
  if (!keys.includes(hn)) {
    break
  }
  dic[params[hn]] = params[hn + 'v']
  num += 1
}
*/

let q_input_ids=['elm','degree','vote_num']
document.getElementById('send_btn').addEventListener('click', () => {
  let dic = {
    'elm':'',
    'degree':1,
    'warning':'',
    'vote_num':1,
  }
  let check_boxes=document.querySelectorAll('input[type=checkbox]')
  let tmp_dic={}
  for(let i=0;i<check_boxes.length;i++){
    let box=check_boxes[i]
    if(box.checked){
      let tmp_lst=box.id.split('-')
      if(tmp_dic[tmp_lst[1]]){
        tmp_dic[tmp_lst[1]]+=','+tmp_lst[2]
      }else{
        tmp_dic[tmp_lst[1]]=tmp_lst[2]  
      }
    }
  }
  let checking_keys=Object.keys(tmp_dic)
  for(let i=0;i<checking_keys.length;i++){
    let key=checking_keys[i]
    dic[key]=tmp_dic[key]
  }

  for (let id of q_input_ids) {
    let tmp = document.getElementById(id)
    dic[id] = tmp.value || dic[id]
    if(id!='user'){
      tmp.value = ''
    }
  }
  console.log(dic)
  dic['method']='add'


  if(!dic['elm']){
    return
  }

  Send(dic,CallBack)
})

function CallBack(){
  UIkit.notification({
    message: 'Success',
    status: 'success',
    pos: 'bottom-center',
    timeout: 1000,
  });
  let loader=document.getElementById('loader')
  if(loader){
    loader.style.display='None'
  }
}