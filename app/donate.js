window.onload =function(){
    let cardNumber = document.getElementById("cardNum").value;
    let donateForm=document.getElementById("donate-form"); 
    let amount=document.getElementById("amount");   

    var card_pattern = /^[0-9]{16,16}$/;

    donateForm.addEventListener("submit",(e) => {
        e.preventDefault();
        if(amount.value==""){
            alert("amount must be select!");
            return
        }

        if(!cardNumber.match(card_pattern)){
            alert("Please enter a valid cardnumber");
            document.getElementById("cardNum").focus();
            return false;
        }

        else{
            alert("Thanks for yor donation.")
            donateForm.reset()
        }
        
    });



}
