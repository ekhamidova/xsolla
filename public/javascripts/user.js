/**
 * Created by lexusrules on 11.06.17.
 */

var MainURL = "https://livedemo.xsolla.com/fe/test-task/baev/users";
var Enable;


var getUser = function(user_id) {
//var link = MainURL+"/"+user_id+"/transactions"
      $.ajax({
        url:MainURL+"/"+user_id,
          success: function (result) {

              var data = {
                  enabled:getStatus(result.enabled),
                  user_id:result.user_id,
                  register_date:getDate(result.register_date),
                  wallet_amount:getWallet(result.wallet_amount,result.wallet_currency),
                  balance: result.balance,
                  user_name:result.user_name,
                  user_custom: result.user_custom,
                  email:result.email

              };
              var inputs= $(".form-horizontal").find("[name]");
              for (var i=0;i<inputs.length;i++){
                  var input = $(inputs[i]);
                  if (input.is("p")){
                      var name = input.attr("name");
                      input.text(data[name]);
                  }
                  else if (input.is("input")){
                      var name = input.attr("name");
                      input.val(data[name]);
                  }
              }

              Enable = result.enabled;

              $("[name='email']").bind('input', function() {
                  isEmail($(this));
              });

              $("[name='amount']").bind('input', function() {
                  isDigit($(this));
              });
              $("[name='comment']").bind('input', function() {
                  isEmpty($(this));
              });
          }
    });
};

var getStatus = function(isActive){
    return isActive?"Активен": "Неактивен";
};
var getDate = function(regDate){
    var date = new Date(regDate);
    return date.format("dd.mm.yyyy HH:MM");
};
var getWallet = function(wallet_amount,wallet_currency){
    var result= "0";
    if (wallet_amount) result= wallet_amount;
    if (wallet_currency) result+=" "+ wallet_currency;
    return result;
};
var isDigit = function(obj){

    if (obj.val() ==""){
        obj.siblings(".help-block").show();
        obj.parent().removeClass("has-success");
        obj.parent().addClass("has-error");
    }
    else{
        obj.siblings(".help-block").hide();
        obj.parent().addClass("has-success");
        obj.parent().removeClass("has-error");
    }

    var regex = /^[0-9]+\.*[0-9]*$/;
    if (!regex.test(obj.val())) {
        obj.val('');
        obj.siblings(".help-block").show();
        obj.parent().removeClass("has-success");
        obj.parent().addClass("has-error");
    }

}
var isEmpty = function(obj){
    if (obj.val() ==""){
        obj.siblings(".help-block").show();
        obj.parent().removeClass("has-success");
        obj.parent().addClass("has-error");
    }
    else{
        obj.siblings(".help-block").hide();
        obj.parent().addClass("has-success");
        obj.parent().removeClass("has-error");
    }
}
var isEmail = function(obj) {
    if (obj.val()=="") return 0;
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (regex.test(obj.val())){
        obj.siblings(".help-block").text("Email введен корректно");
         obj.parent().addClass("has-success");
        obj.parent().removeClass("has-error");
    }
    else{
        obj.siblings(".help-block").show();
          obj.siblings(".help-block").text("Email введен некорректно");
       obj.parent().removeClass("has-success");
        obj.parent().addClass("has-error");
    }
    return regex.test(obj.val());
}

var editUser = function(form,user_id) {

    if (!isEmail($("[name='email']"))) return 0;

   // e.preventDefault();
    var dataForm =form.serializeArray();
    var data = {};
    data.enabled = Enable;
    for (var i=0;i<dataForm.length;i++){
        var name = dataForm[i].name;
        var value =dataForm[i].value;
        data[name]=value;
    }
    buttonDisabled(form);
 //    data = {"enabled":Enable, "user_custom":"Update custom name1"};
    data = JSON.stringify(data);
    $.ajax({
        url: MainURL+"/"+user_id,
        type: 'PUT',
        data:data,
        complete: function() {
            buttonEnabled(form,"Сохранено!");
        },
        statusCode: {
            200: function() {
                $("[name='email']").siblings(".help-block").hide();
                $("[name='email']").parent().removeClass("has-success");
            },
            403: function(jqXHR) {

            }
        }
    });
};
var buttonDisabled = function(form){
    form.find("[type='submit']").prop("disabled", true);
}
var hideSuccess = function(form){
    form.find(".success-label.text-success.m-l-small").remove();
}
var buttonEnabled = function(form, text){
    form.find("[type='submit']").prop("disabled", false);
    form.find("[type='submit']").after('<span class="success-label text-success m-l-small">'+text+'</span>');
    setTimeout(function() {hideSuccess(form)},5000);

}
var editBalance = function(form,user_id) {
    //if (!isComment()){
    //    return false;
    //}
    var dataForm =form.serializeArray();

    var data = {};
    for (var i=0;i<dataForm.length;i++){
        var name = dataForm[i].name;
        var value =dataForm[i].value;
        data[name]=value;
    }
 //   var data = {'amount':10, 'comment':'Incoming payment1'};
    data = JSON.stringify(data);
    buttonDisabled(form);
    var url  = MainURL+"/"+user_id+"/recharge";
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function (result) {
            var input= $(".form-horizontal").find("[name='balance']");
            if (input && result.amount) input.text(result.amount);
            $("#balanceForm [name]").val('');
            buttonEnabled(form,"Баланс успешно изменён");



        },


    });
};
var isComment = function(){
    return ($("#balanceForm [name='comment']").val()!="");
}
var createUser =function(form){
    var dataForm =form.serializeArray();
    var data = {};
    for (var i=0;i<dataForm.length;i++){
        var name = dataForm[i].name;
        var value =dataForm[i].value;
        data[name]=value;
    }
   //   var data = {user_id:'qqqq'};
    buttonDisabled(form);
    data = JSON.stringify(data);
    $.ajax({
        url: MainURL,
        type: 'POST',
        data: data,
        statusCode: {
            200: function () {
                $("[name='email']").siblings(".help-block").hide();
                $("[name='email']").parent().removeClass("has-success");
                buttonEnabled(form,"Сохранено!");
            },
            204: function () {
            }
        },
        success: function (result) {
            buttonEnabled(form,"Сохранено!");
        }
    });
}
var findTransaction = function($table,user_id,start,end){
    $("#usersContent").hide();
    $(".loading-container").show();
    $table.bootstrapTable('removeAll');

    var data={};
    data.datetime_from = start.format("yyyy-mm-dd'T'HH:MM:ss'Z'");
    data.datetime_to = end.format("yyyy-mm-dd'T'HH:MM:ss'Z'");
    var url = MainURL+"/"+user_id+"/transactions";
  //  data = JSON.stringify(data);
    $.ajax({
        url: url,
        type: 'GET',
        data: data,
        success: function (result) {

            $table.bootstrapTable('append', getDataTransaction(result));
            $("#usersContent").show();
            $(".loading-container").hide();
            //$(tableID).scrollTop($("#button").position().top);

        }
    });
}
var getDataTransaction = function (data){
    var results = [];
    for (var i=0;i<data.length;i++){

    var result = {};
    result.date = getDate( data[i].date);
    result.status = getStatusTransaction(data[i].status);
    result.operation_id = data[i].operation_id;
    result.user_id = data[i].user_id;
    result.transaction_type = getTypeTransaction(data[i].transaction_type, data[i].coupon_code, data[i].transaction_id);
    result.amount = getBalance(data[i].amount ,data[i].user_balance);
    result.sum = getSum(data[i].sum, data[i].currency);
    result.comment = data[i].comment;
        results[i] = result;
    }
    return results;
};
var getBalance = function(amount,user_balance ){
    return amount+" ("+user_balance+")";
}
var getStatusTransaction = function(status){
    var result;
    switch (status){
        case "notified" : result = "Заявка"; break;
        case "completed": result = "Завершена"; break;
        default : result="";
    }
    return result;
}
var getTypeTransaction = function(transaction_type,coupon_code,transaction_id){
    if (!coupon_code) coupon_code = "";
    if (!transaction_id) transaction_id = "";
    var result;
    switch (transaction_type){
        case "coupon" : result = "Купоны "+coupon_code ; break;
        case "payment": result = "Заявка "+transaction_id; break;
        case "inGamePurchase": result = "Покупка в игре"; break;
        case "internal": result = "Внутренняя"; break;
        case "cancellation": result = "Отклонено"; break;
        default : result="";
    }
    return result;
}
var getSum = function(sum, currency){
    var result = "0";
    if (sum) result = sum;
    if (currency) result +=" "+ currency;
    return result;
}
