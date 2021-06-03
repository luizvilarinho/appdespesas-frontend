function s(seletor){
    return document.querySelector(seletor);
}

function showAlert(message){
    var timer = 5000;
    s("#alert-message").innerText = message;
    s("#alert-container").style.display="block";

    setTimeout(function(){
        s("#alert-container").style.display="none";
    }, timer)
}

var getCookies = function(){
    var cookies={};
    var cookiesArray = document.cookie.split(";");

    for(var i=0; i< cookiesArray.length; i++){

        cookies[cookiesArray[i].split("=")[0]] = cookiesArray[i].split("=")[1]
    }

    return cookies;
}

var setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";" +  "SameSite=None" + ";" + "Secure";
  }

function validarLogin(){
    //var test = true;
    var email = s("#email").value;
    var senha = s("#senha").value;

    return new Promise((resolve, reject) => {
        if(email == "" || senha == ""){
            showAlert("digite o seu email e senha para continuar");
            resolve(false)
        }

        resolve(true)
    });

}

function validarCadastro(){
    var email = s("#email").value;
    var senha = s("#nome").value;
    var senha = s("#senha").value;

    return new Promise((resolve,reject)=>{
        if(email == "" || senha == "" || nome == ""){
            showAlert("digite o seu nome, email e senha para continuar");
            resolve(false)
        }

        resolve(true)
    })
}

async function cadastrarUsuario(){
    var email = s("#email").value;
    var name = s("#nome").value;
    var password = s("#senha").value;

    if(await validarCadastro() == false){
        return;
    }

    var bodyObject = {
        name,
        email,
        password
    }
    //console.log("bodyObject", bodyObject)
    var responseData = await fetch(`${config.baseUrl}/api/eco/v1/login/user/create`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body:JSON.stringify(bodyObject)
    });

    var data = await responseData.json();

    if(data.success == true){
        //console.log("loginpage", 'eco-login.html')
        location.assign('/eco-login.html', "_self");
        //alert("redirect", '/eco-login.html')
    }else{
        showAlert(data.message);
    }
    
}

async function login(){
    var email = s("#email").value;
    var senha = s("#senha").value;
   
    if(await validarLogin() == false){
        return;
    }

    var bodyObject = {
        email,
        password:senha
    }
    //console.log("bodyObject", bodyObject)
    //console.log(`${config.baseUrl}/api/eco/v1/login/user/login`)

    var responseData = await fetch(`${config.baseUrl}/api/eco/v1/login/user/login`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body:JSON.stringify(bodyObject)
    });

    var data = await responseData.json();

    if(!data.success || data.findUser == false || data.correctPassword == false){
        showAlert(data.message)
        return 
    }

    localStorage.setItem("ecoAccessToken", data.token);
    
    window.open('/index.html', "_self");
}