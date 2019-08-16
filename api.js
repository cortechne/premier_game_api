
let access_token;
let result_point;
let user_data;
let ranking;
let user_play_data;

let _getValueFromCookie = function(key){
    var cookies = document.cookie;
    var cookieItem = cookies.split(";");
    var cookieValue = "";

    for (i = 0; i < cookieItem.length; i++) {
        var elem = cookieItem[i].split("=");
        if (elem[0].trim() == key) {
            cookieValue = unescape(elem[1]);
        } else {
            continue;
        }
    }
    return cookieValue;
}


function getAccessToken(member_id, password, get_userdata){
    var formData = new FormData();
    formData.append("username",_getValueFromCookie("id"))
    formData.append("password",_getValueFromCookie("password"))
    formData.append("scope","game")
    formData.append("grant_type","password")
    formData.append("client_secret","game")
    formData.append("client_id","game")
    $.ajax({
        url: 'https://account.4353p-club.com/oauth2/token',
        method: 'POST',
        dataType: 'json',
        data: formData,
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: true
        }
    }).done(function( res ){
        if( res.access_token ){
            access_token = res.access_token
            console.log('アクセストークン:'+access_token)
            if(get_userdata)  getUserData()
            
        }else{
            console.error('['+res.errors[0].message+']'+res.errors[0].detail)
        }
    }).fail(function( jqXHR, textStatus, errorThrown ){
        if( jqXHR.status == 400 ) console.error(errorThrown+'：[LOGIN ERROR] IDとパスワードが一致しません。')
        else console.error(errorThrown+'：[API ERROR] APIに問題が発生しています。開発者にお問い合わせください。 kaori@cortechne.jp')
    });;
}

function getUserData(){
    let data_object = {
        access_token: access_token
    } 
    console.log("以下のデータが送信されます")
    console.log(data_object)
    $.ajax({
        method : 'POST',
        url: 'https://game.4353p-club.com/user/info',
        data : JSON.stringify(data_object),
        contentType: 'application/JSON',
        dataType : 'JSON',
        scriptCharset: 'utf-8'
    }).done(function( res ){
        if( res.status == 1 ){
            user_data = res.user
            console.log("以下のデータを取得しました")
            console.log(user_data)
            getRanking(1, user_data.room, 5, 0)
            getPlayData(1, user_data.room)
            return user_data
        }else{
            console.log(res)
            console.error('['+res.errors[0].message+']'+res.errors[0].detail)
        }
        
    }).fail(function( jqXHR, textStatus, errorThrown ){
        if( jqXHR.status == 400 ) console.error(errorThrown+'：[LOGIN ERROR] IDとパスワードが一致しません。')
        else console.error(errorThrown+'：[API ERROR] APIに問題が発生しています。開発者にお問い合わせください。 kaori@cortechne.jp')
    });;
}

function getRanking(game_id, room, limit, offset){
    let room_id = room ? room.room_id: null
    let fc_id = room ? room.fc_id: null
    let data_object = {
        access_token: access_token,
        data: {
            game_id: game_id,
            limit: limit,
            offset: offset,
            room_id: room_id,
            fc_id: fc_id
        }
    } 
    console.log("以下のデータが送信されます")
    console.log(data_object)
    $.ajax({
        method : 'POST',
        url: 'https://game.4353p-club.com/ranking',
        data : JSON.stringify(data_object),
        contentType: 'application/JSON',
        dataType : 'JSON',
        scriptCharset: 'utf-8'
    }).done(function( res ){
        if( res.status == 1 ){
            ranking = res.ranking
            console.log("以下のデータを取得しました")
            console.log(ranking)
            return ranking
        }else{
            console.log(res)
            console.error('['+res.errors[0].message+']'+res.errors[0].detail)
        }
        
    }).fail(function( jqXHR, textStatus, errorThrown ){
        if( jqXHR.status == 400 ) console.error(errorThrown+'：[LOGIN ERROR] IDとパスワードが一致しません。')
        else console.error(errorThrown+'：[API ERROR] APIに問題が発生しています。開発者にお問い合わせください。 kaori@cortechne.jp')
    });;
}


function getPlayData(game_id, room){
    let room_id = room ? room.room_id: null
    let fc_id = room ? room.fc_id: null
    let data_object = {
        access_token: access_token,
        data: {
            game_id: game_id,
            room_id: room_id,
            fc_id: fc_id
        }
    } 
    console.log("以下のデータが送信されます")
    console.log(data_object)
    $.ajax({
        method : 'POST',
        url: 'https://game.4353p-club.com/info/user',
        data : JSON.stringify(data_object),
        contentType: 'application/JSON',
        dataType : 'JSON',
        scriptCharset: 'utf-8'
    }).done(function( res ){
        if( res.status == 1 ){
            user_play_data = res.user_play_data
            console.log("以下のデータを取得しました")
            console.log(user_play_data)
            return user_play_data
        }else{
            console.log(res)
            console.error('['+res.errors[0].message+']'+res.errors[0].detail)
        }
        
    }).fail(function( jqXHR, textStatus, errorThrown ){
        if( jqXHR.status == 400 ) console.error(errorThrown+'：[LOGIN ERROR] IDとパスワードが一致しません。')
        else console.error(errorThrown+'：[API ERROR] APIに問題が発生しています。開発者にお問い合わせください。 kaori@cortechne.jp')
    });;
}

function postResult(game_id, point, value1, value2, value3){
    let result_object = {
        game_id: +game_id,
        point: +point,
        value1: value1,
        value2: value2,
        value3: value3
    }
    let data_object = {
        access_token: access_token,
        data: result_object
    } 
    console.log("以下のデータが送信されます")
    console.log(data_object)
    $.ajax({
        method: 'POST',
        url: 'https://game.4353p-club.com/info/user/create',
        contentType: 'application/JSON',
    dataType : 'JSON',
    scriptCharset: 'utf-8',
        data : JSON.stringify(data_object)
    }).done(function( res ){
        if( res.status == 1 ) console.info('データが登録されました')
        else console.error('['+res.errors[0].message+']'+res.errors[0].detail)
        
    }).fail(function( jqXHR, textStatus, errorThrown ){
        if( jqXHR.status == 400 ) console.error(errorThrown+'：[LOGIN ERROR] IDとパスワードが一致しません。')
        else console.error(errorThrown+'：[API ERROR] APIに問題が発生しています。開発者にお問い合わせください。 kaori@cortechne.jp')
    });;
}


