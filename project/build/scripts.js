/**
 * Created by lexusrules on 07.06.17.
 */
var limit = 10;
var offset = 0;
var tableID = '#usersTable';
var loadTable = function($table){
    offset += 10;
    var data = {offset: offset, limit: limit};
    $.ajax({
        url: MainURL,// "https://livedemo.xsolla.com/fe/test-task/baev/users",
        data: data,
        success: function (result) {
            $(tableID).bootstrapTable({data: getDataUser(result.data)});
            $(tableID).scrollTop($("#button").position().top);

        }
    });
}

$(function () {


    $('#button').click(function () {

        offset += 10;
        var data = {offset: offset, limit: limit};
        $.ajax({
            url: "https://livedemo.xsolla.com/fe/test-task/baev/users",
            data: data,
            success: function (result) {
                $(tableID).bootstrapTable('append', getDataUser(result.data));
               $(tableID).scrollTop($("#button").position().top);

             }
        });

    });

    var options = $(tableID).bootstrapTable('getOptions');
    options.height='100%';
    $(tableID).bootstrapTable('refreshOptions',options);


});

var resizeTable = function(){
         $(tableID).bootstrapTable('resetView');
        var clientW = $(window).width();
        var clientH = $(window).height()-230;

        $("#usersContent").height(clientH);
};

$(window).on("load resize",function(e){
    resizeTable();
});
var LinkFormatter = function(value, row, index){
    return "<a href='/users/"+value+"'>"+value+"</a>";
}
var getDataUser = function (data){
    var results = [];
    for (var i=0;i<data.length;i++){

        var result = {};
        result.register_date = getDate( data[i].register_date);
        result.enabled = getStatus(data[i].enabled);
        result.user_name = data[i].user_name;
        result.user_id = data[i].user_id;
        result.user_custom = data[i].user_custom;
        result.email = data[i].email;
        result.balance = result.balance;
        result.wallet_amount = getSum(data[i].wallet_amount, data[i].wallet_currency);
        results[i] = result;
    }
    return results;
};

function getData(data) {
    var rows = [];

    for (var i = 0; i < data.length; i++) {
        var columns = {};

        for (var key in data[i])
        { if (!data[i].hasOwnProperty(key))
        { continue; }
            columns[key] = data[i][key];
            console.log(key + ' -> ' +  data[i][key]);
        };

        rows.push(columns);
        //    id: startId + i,
        //    name: 'test' + (startId + i),
        //    price: '$' + (startId + i)
        //});
    }
    return rows;
}
function queryParams() {
    return {
        limit: limit,
        offset: 0
    };
}
var resize = function(){

}

var showUser = function() {
    $.ajax({
        url: "https://livedemo.xsolla.com/fe/test-task/baev/users/1",
        //  data: 1,
        success: function (result) {
            alert(result);
        }
    });
};



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

var editUser = function(user_id) {
    if (!isEmail($("[name='email']"))) return 0;

   // e.preventDefault();
    var dataForm =$("#userForm").serializeArray();
    var data = {};
    data.enabled = Enable;
    for (var i=0;i<dataForm.length;i++){
        var name = dataForm[i].name;
        var value =dataForm[i].value;
        data[name]=value;
    }
 //    data = {"enabled":Enable, "user_custom":"Update custom name1"};
    data = JSON.stringify(data);
    $.ajax({
        url: MainURL+"/"+user_id,
        type: 'PUT',
        data:data,
        complete: function() {
          //  $(":submit", form).button("reset");
            alert("complete");
        },
        statusCode: {
            200: function() {
                //form.html("Вы вошли в сайт").addClass('alert-success');
            //    window.location.href = MainURL+user_id;
                $("[name='email']").siblings(".help-block").hide();
                $("[name='email']").parent().removeClass("has-success");
            },
            403: function(jqXHR) {

            }
        }
    });
};
var editBalance = function(user_id) {
    //if (!isComment()){
    //    return false;
    //}
    var dataForm =$("#balanceForm").serializeArray();

    var data = {};
    for (var i=0;i<dataForm.length;i++){
        var name = dataForm[i].name;
        var value =dataForm[i].value;
        data[name]=value;
    }
 //   var data = {'amount':10, 'comment':'Incoming payment1'};
    data = JSON.stringify(data);
    var url  = MainURL+"/"+user_id+"/recharge";
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function (result) {
            var input= $(".form-horizontal").find("[name='balance']");
            if (input && result.amount) input.text(result.amount);
            $("#balanceForm [name]").val('');

        }
    });
};
var isComment = function(){
    return ($("#balanceForm [name='comment']").val()!="");
}
var createUser =function(){
    var dataForm =$("#newUserForm").serializeArray();
    var data = {};
    for (var i=0;i<dataForm.length;i++){
        var name = dataForm[i].name;
        var value =dataForm[i].value;
        data[name]=value;
    }
   //   var data = {user_id:'qqqq'};
    data = JSON.stringify(data);
    $.ajax({
        url: MainURL,
        type: 'POST',
        data: data,
        statusCode: {
            200: function () {
                //form.html("Вы вошли в сайт").addClass('alert-success');
                //    window.location.href = MainURL+user_id;
                $("[name='email']").siblings(".help-block").hide();
                $("[name='email']").parent().removeClass("has-success");
            },
            403: function (jqXHR) {
                //var  error = "";
                //var split = jqXHR.responseText.split(':');
                //if (split.length>0)
                //    error = split[split.length-1];
                ////   var text =JSON.stringify(jqXHR.responseText);
                //// var error = JSON.parse(jqXHR.responseText);
                //$('.error', form).html(error);
                //$('.error', form).parent().addClass("has-error")
            },
            204: function () {
                alert("ggg");
                //form.html("Вы вошли в сайт").addClass('alert-success');
                //    window.location.href = MainURL+user_id;

            }
        },
        success: function (result) {
            alert(result);
        }
    });
}
var findTransaction = function($table,user_id,start,end){
    var data={};
    data.datetime_from = start.format("yyyy-mm-dd'T'HH:MM:ss'Z'");
    data.datetime_to = end.format("yyyy-mm-dd'T'HH:MM:ss'Z'");
 //   data.datetime_from = start;
  //    data.datetime_to = end;
    var url = MainURL+"/"+user_id+"/transactions";
  //  data = JSON.stringify(data);
    $.ajax({
        url: url,
        type: 'GET',
        data: data,
        success: function (result) {

            $table.bootstrapTable('append', getDataTransaction(result));
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