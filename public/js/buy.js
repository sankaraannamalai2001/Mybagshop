// const Item=require('../../models/itemModel');
// const buyBtn=document.querySelectorAll('.buy');
// for(btn of buybtn){
//     btn.addEventListener('click',()=>{
//         // btn.disabled = true;
//         btn.style.backgroundColor='black';
//     })
// }



// function add(id){
//     alert(id);
//     myBag.push(id);
//     buyBtn.disabled = true;
//     buyBtn.innerText = 'Added';
//     console.log("1");
//     alert(myBag);
// }

// buyBtn.addEventListener('click',()=>{
//     buyBtn.disabled = true;
// })
// // alert("Hello");
function add3Dots(string)
{
  var dots = "...";
  if(string.length > 10)
  {
   
    string = string.substring(0,10) + dots;
  }
 
    return string;
}
