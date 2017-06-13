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


