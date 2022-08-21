window.onload =function(){

    let donateForm=document.getElementById("donate-form"); 
    let amount=document.getElementById("amount");   
    donateForm.addEventListener("submit",(e) => {
        e.preventDefault();
        if(amount.value==""){
            alert("amount must be select!");
        }
        else{
            alert("Thanks for yor donation.")
            donateForm.reset()
        }
        
    });



}
