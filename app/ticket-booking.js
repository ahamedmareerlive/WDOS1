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
    
    
    
    
    
    
    let order=[];
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
                      <span>${v.duration}</span>
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
            return "Order doe'nt have any items.";
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
        if(orderCount>3){
            loyality=specification.loyaltyPoint*orderCount;
        }
        return loyality;
    }
    
    document.removeCardItem=(orderNo)=>{
        removeOrderCardData(orderNo)
        renderOrder();
        updateSummary();
    }
    
    
    
   
    passEle.addEventListener("change",(e)=>{
        formData.passType=e.target.value;
        if(formData.passType=="ANNUAL_LOCAL" || formData.passType=="ANNUAL_FOREIGN"){
            durationEle.disabled = true;
            noOfoodToken.disabled = true;
        }
        else{
            durationEle.disabled = false;
            noOfoodToken.disabled = false;
        }
        formData.passAmount=specification.pass[formData.passType];
        formData.extraCharge= calculateExtraCharge(formData.passType,formData.duration,formData.numberOfPass);
        updateSummary();
    });

    noOfPassEle.addEventListener("change",(e)=>{
        formData.numberOfPass=e.target.value!=""&& e.target.value>0?e.target.value:1;
        formData.extraCharge= calculateExtraCharge(formData.passType,formData.duration,formData.numberOfPass);
        updateSummary();
    })

    durationEle.addEventListener("change",(e)=>{
        formData.duration=e.target.value;
        formData.extraCharge= calculateExtraCharge(formData.passType,formData.duration,formData.numberOfPass);
        updateSummary();
    });

    noOfoodToken.addEventListener("change",(e)=>{
        formData.extra.foodToken=e.target.value!=""?parseInt(e.target.value):0;
        formData.extra.foodTokenAmount=formData.extra.foodToken*specification.perToken;
        updateSummary();
    });
    addOrderBtn.addEventListener("click",(e)=>{
        e.preventDefault();
        order.push(createOrder());
        renderOrder();
        createOrderForm.reset();
        resetFormData();
        updateSummary();
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
        updateSummary();
        orderSummary.loyalty=calculateLoyaltyAmount();
    
    })




    //code...........



}