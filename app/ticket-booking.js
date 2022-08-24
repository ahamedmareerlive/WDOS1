
//all required validation input feild message element. 
let behaviour={
    'choice-of-ticket':{message:["ticket is required","ok"]},
    'no-of-pass':{message:["number of pass is required","ok"] ,numberCheck:true },
    'duration':{message:["duration is required","ok"]}
};


window.onload =function(){
    //Element 
    let passEle=document.getElementById("choice-of-ticket");
    let noOfPassEle=document.getElementById("no-of-pass");
    let durationEle=document.getElementById("duration");
    let noOfoodToken=document.getElementById("no-of-foodToken");
    let addOrderBtn=document.getElementById('add-order');
    let orderCardRoot=document.getElementById('list-order-card-root');
    let orderSummaryRoot=document.getElementById('order-summary-root');
    let createOrderForm=document.getElementById('create-order-form');
    let placeOrderBtn=document.getElementById('place-order');
    let addFavouriteBtn=document.getElementById("add-favourite");
    let orderFavouriteBtn=document.getElementById("order-favourite");
    let checkLoyaltyBtn=document.getElementById("check-loyalty");
    
    
    
    
    
    //this order array hold all the order in runtime
    let order=[];
    //this orderSummary object hold order summary data.
    let orderSummary={
        totalOrder:0,
        costOfCurrentOrder:0,
        costOfOverallOrder:0,
        loyalty:0,
    }
    
    let specification={
        pass:{
            FOREGIN_ADULT:5000,
            FOREGIN_CHILD:2500,
            LOCAL_ADULT:1000,
            LOCAL_CHILD:500,
            ANNUAL_LOCAL:4500,
            ANNUAL_FOREIGN:15000
        },
        aliases:{
            FOREGIN_ADULT:"Foregin Adult Pass",
            FOREGIN_CHILD:"Foregin Child Pass",
            LOCAL_ADULT:"Local Adult Pass",
            LOCAL_CHILD:"Local Child Pass",
            ANNUAL_LOCAL:"Annual Local Pass",
            ANNUAL_FOREIGN:"Annual Foregin Pass"
        },
        durationAliases:{
            _3_HOUR:"3 Hour",
            HALF_DAY:"½ Day",
            FULL_DAY:"Full Day",
            _2_DAY:"2 Days"
        },
        summaryCardAliases:{
            totalOrder:"Total Order",
            costOfCurrentOrder:"Cost Of Current Order",
            costOfOverallOrder:"Cost Of Overall Order",
            loyalty:"Earned Loyalty "
        },
        perToken:500,
        loyaltyPoint:20
        
    }

    let formData={
        passType:"",
        passAmount:0,
        duration:"",
        extraCharge:0,
        numberOfPass:0,
        extra:{
            foodToken:0,
            foodTokenAmount:0
        }
    }

    

    //Load initial data
    renderOrderSummary();

    //validation code
    let isEmpty=(v)=> v==undefined || v==""?true:false;

    

    function onChangeTicketBookEle(e){
        let key=e.target.id;
        let v=e.target.value;
        switch(key){
            case "choice-of-ticket":{
                required(v,key,(state)=>{
                    state==false&& focus(key);
                });
                break;
            }
            case "no-of-pass":{
                required(v,key,(state)=>{
                   
                    if(state==true){
                        
                        if( v <= 0 ){
                            showMessage("pass must be greater then zero",0,key);
                            focus(key);
                        }
                    }
                    else{
                        state==false&& focus(key);
                    }

                    
                    
                });
                break;
            }
            case "duration":{
                required(v,key,(state)=>{
                    state==false&& focus(key);
                });
                break;
            }
           
        }
    
    }
    function required(v,key,resolve=(state)=>{}){
        let okMessage=behaviour[key]["message"][1]!=undefined?behaviour[key]["message"][1]:"ok";
        let errorMessage=behaviour[key]["message"][0]!=undefined?behaviour[key]["message"][0]:"";
        let ok=0;
        isEmpty(v)?ok=0:ok=1;
        showMessage(ok==1?okMessage:errorMessage,ok,key);
        resolve(ok==1?true:false);
    }

    function showMessage(message="",ok=0,key=""){
        let ele=document.getElementById(`${key}-message`);
        ele.innerText=message;
        if(ok==0){
            ele.classList.remove("ok");
            ele.classList.add("error");
        }
        else{
            ele.classList.remove("error");
            ele.classList.add("ok");
        }
        !ele.classList.contains("show")&&ele.classList.add("show");
       
    }

    function finalRequiredCheck(key={}){
        let finalState=true;
        Object.keys(key).map((v)=>{
            let ele=document.getElementById(v);
            
            if(!ele.disabled ){
                if( isEmpty(ele.value) ){
                    finalState=false;
                }
                
                required(ele.value,v,(state)=>{
                    if(v=="no-of-pass" ){
                        if(state==true){
                            if( ele.value <= 0 ){
                                finalState=false;
                                showMessage("pass must be greater then zero",0,v);
                            }
                        }
                    }
                    
                });
            }
           
            
        });
    
        return finalState;
    }

   

    function calculateExtraCharge(pass="",duration="",noOfPer=1){
        if( (pass=="LOCAL_ADULT" && duration=="HALF_DAY") || (pass=="LOCAL_CHILD" && duration=="HALF_DAY") ){
            return noOfPer*250; 
        }
        else if((pass=="FOREGIN_ADULT" && duration=="HALF_DAY") || (pass=="FOREGIN_CHILD" && duration=="HALF_DAY")){
            return noOfPer*500; 
        }
        else if((pass=="LOCAL_ADULT" && duration=="FULL_DAY") || (pass=="LOCAL_CHILD" && duration=="FULL_DAY")){
            return noOfPer*500; 
        }
        else if((pass=="FOREGIN_ADULT" && duration=="FULL_DAY") || (pass=="FOREGIN_CHILD" && duration=="FULL_DAY")){
            return noOfPer*1000; 
        }
        else if((pass=="LOCAL_ADULT" && duration=="_2_DAY") || (pass=="LOCAL_CHILD" && duration=="_2_DAY")){
            return noOfPer*1000; 
        }
        else if((pass=="FOREGIN_ADULT" && duration=="_2_DAY") || (pass=="FOREGIN_CHILD" && duration=="_2_DAY")){
            return noOfPer*2000; 
        }
    }

    function createOrder(){
        let data={};
        let date=new Date();
        
        const {passAmount,passType,numberOfPass,extraCharge,duration,extra:{foodTokenAmount,foodToken}}=formData;
        const {aliases,perToken,durationAliases}=specification;
        data["passName"]=aliases[passType];
        data["passType"]=passType;
        data["Amount"]=calculateConstAmount();
        data["foodToken"]=foodToken;
        data["foodTokenAmount"]=foodTokenAmount;
        data["perToken"]=perToken;
        data["orderNo"]="#ON"+date.getTime();
        data["numberOfPass"]=numberOfPass;
        data["orderDate"]=date.toLocaleDateString("en-US") +" "+ date.toLocaleString('en-US', { hour: 'numeric', hour12: true,minute:"2-digit" });
        data["extraCharge"]=extraCharge?extraCharge:0;
        data["duration"]=durationAliases[duration];
        data["durationType"]=duration;

        return data
    }

    
    /*Display the orderd item in ui*/
    function renderOrder(){
        let DOM="";
        order.map((v)=>{
            DOM+=`
                <div class="order-card">
                    <div class="order-card-action-btn">
                       
                        <button onclick="document.removeCardItem('${v.orderNo}')" class="remove-order-card">Remove</button>
                    </div> 
                    <div class="order-card-item">
                      <span>Order No : </span>
                      <span>${v.orderNo}</span>
                    </div>
                    <div class="order-card-item">
                      <span>Order Date : </span>
                      <span>${v.orderDate}</span>
                    </div>
                    <div class="order-card-item">
                      <span>Pass Name  : </span>
                      <span>${v.passName}</span>
                    </div>
                    <div class="order-card-item">
                      <span>Duration  : </span>
                      <span>${v.duration==undefined?'no':v.duration }</span>
                    </div>
                    <div class="order-card-item">
                    <span>ExtraCharge  : </span>
                    <span>${v.extraCharge} Rs</span>
                  </div>
                    <div class="order-card-item">
                        <span>Food Token  : </span>
                        <span>${v.foodTokenAmount} Rs (${v.foodToken} x ${v.perToken}) </span>
                    </div>
                    <div class="order-card-item">
                      <span>Total Pass  : </span>
                      <span>${v.numberOfPass}</span>
                    </div>
                    <div class="order-card-item">
                      <span>Total Amount : </span>
                      <span>${v.Amount} Rs</span>
                    </div>
                </div>
            `;
        })
        orderCardRoot.innerHTML=DOM;
    }
    /*Display important 4 order summary*/
    function renderOrderSummary(){
        let DOM="";
        const {summaryCardAliases}=specification;
        Object.keys(orderSummary).forEach(function(k) {
            DOM+=`
            <div class="order-summary-card">
                <span>${summaryCardAliases[k]}</span>
                <span>${orderSummary[k]}</span>
            </div>
            `;
        });
        orderSummaryRoot.innerHTML=DOM;
    }

    function placeOrder(){
       
        if(order.length<=0){
            return "Order doesn't have any items.";
        }
        else{
            localStorage.removeItem("favourite")
            order=[];
            resetFormData();
            renderOrder();
            updateSummary();
            return "Thanks for your order.";
        }

    }
    function getTotalOrder(){
        return order.length;
    }
    function updateSummary(){
        orderSummary.costOfCurrentOrder=calculateConstAmount();
        orderSummary.totalOrder=getTotalOrder();
        orderSummary.costOfOverallOrder=calculateConstOfAllOrder();
        
        
        renderOrderSummary();
    }
    function removeOrderCardData(id){
        order=order.filter((v)=>{
            return v.orderNo != id; 
        });
        return order;
    }
    
    
    function setValueToForm(data){
        passEle.value=data.passType;
        noOfPassEle.value=data.numberOfPass;
        durationEle.value=data.duration;
        noOfoodToken.value=data.extra.foodToken; 

        formData=data;
    }
    function calculateConstAmount(){
        const {passAmount,numberOfPass,extraCharge,extra:{foodTokenAmount} }=formData;
        let amount=(passAmount*numberOfPass)+(extraCharge?extraCharge:0)+(foodTokenAmount?foodTokenAmount:0);
        return amount;
    }
    function calculateConstOfAllOrder(){
        let amount=0;
        order.map(v=> amount+=v.Amount);
        return amount;
    }
    function resetFormData(){
        formData={
            passType:"",
            passAmount:0,
            duration:"",
            extraCharge:0,
            numberOfPass:0,
            extra:{
                foodToken:0,
                foodTokenAmount:0
            }
        }
    }

    function calculateLoyaltyAmount(){
        let orderCount=order.length;
        let loyality=0;
        let prevLoyalty=localStorage.getItem("loyalty")?JSON.parse(localStorage.getItem("loyalty")):0;

       
        
        if(prevLoyalty){
            orderCount?loyality=specification.loyaltyPoint*orderCount:loyality=0;
        }
        else{
            if(orderCount>3){
                loyality=specification.loyaltyPoint*orderCount;
            }
        }
       
        
        return loyality+prevLoyalty;
    }
    
    //all button events
    passEle.addEventListener("change",(e)=>{
        formData.passType=e.target.value;
        if(formData.passType=="ANNUAL_LOCAL" || formData.passType=="ANNUAL_FOREIGN"){
            durationEle.disabled = true;
            noOfoodToken.disabled = true;
            noOfoodToken.value="";
            durationEle.value="";
            formData.extra.foodToken=0;
            formData.extra.foodTokenAmount=0;
            formData.duration="";
        }
        else{
            durationEle.disabled = false;
            noOfoodToken.disabled = false;
        }
        formData.passAmount=specification.pass[formData.passType];
        formData.extraCharge= calculateExtraCharge(formData.passType,formData.duration,formData.numberOfPass);
        updateSummary();
        onChangeTicketBookEle(e);
    });

    noOfPassEle.addEventListener("change",(e)=>{
        formData.numberOfPass=e.target.value!=""&& e.target.value>0?e.target.value:0 ;
        formData.extraCharge= calculateExtraCharge(formData.passType,formData.duration,formData.numberOfPass);
        updateSummary();
        onChangeTicketBookEle(e);
        
    })

    durationEle.addEventListener("change",(e)=>{
        formData.duration=e.target.value;
        formData.extraCharge= calculateExtraCharge(formData.passType,formData.duration,formData.numberOfPass);
        updateSummary();
        onChangeTicketBookEle(e);
    });

    noOfoodToken.addEventListener("change",(e)=>{
        formData.extra.foodToken=e.target.value!=""?parseInt(e.target.value):0;
        formData.extra.foodTokenAmount=formData.extra.foodToken*specification.perToken;
        updateSummary();
    });
    addOrderBtn.addEventListener("click",(e)=>{
        
        e.preventDefault();
        
        if(finalRequiredCheck(behaviour)){
            order.push(createOrder());
            renderOrder();
            createOrderForm.reset();
            resetFormData();
            updateSummary();
        }

        
    })

    placeOrderBtn.addEventListener("click",(e)=>{
        e.preventDefault();
        alert(placeOrder());
    })
    addFavouriteBtn.addEventListener("click",(e)=>{
        e.preventDefault();
        localStorage.setItem("favourite",JSON.stringify(formData));
        
    });
    orderFavouriteBtn.addEventListener("click",(e)=>{
        e.preventDefault();
        if(localStorage.key("favourite")){
            setValueToForm(JSON.parse(localStorage.getItem("favourite")));
            updateSummary();
        }
    });
    checkLoyaltyBtn.addEventListener("click",(e)=>{
        e.preventDefault();
        localStorage.setItem("loyalty",calculateLoyaltyAmount());
        orderSummary.loyalty=JSON.parse(localStorage.getItem("loyalty"));
        updateSummary();
    
    })
    document.removeCardItem=(orderNo)=>{
        removeOrderCardData(orderNo)
        renderOrder();
        updateSummary();
    }
    
    
    
   


    
    


    //code...........



}
