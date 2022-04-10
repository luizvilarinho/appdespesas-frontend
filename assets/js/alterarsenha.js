async function alterar(){

    document.querySelector('.btn-loading').classList.remove('hidden');
 
    base_url_proxy = 'http://localhost:2500'
    const url = `${base_url_proxy}/api/eco/v1/login/user/sendemail`;
    let email = document.querySelector("#email").value;

    var responseData = await fetch(url, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({email})
     });

    data = await responseData.json();

    console.log(data);

    if(data.success){
        showMessage('Uma mensagem foi enviada para o seu e-mail com o link para a alteração da senha', 'success');
    }else{
        showMessage('Algo deu errado, tente novamente mais tarde', 'error');
    }
    
    document.querySelector('.btn-loading').classList.add('hidden');
}

function showMessage(message, type){
    let alertContainer = document.querySelector("#alert-container");

    alertContainer.style.display = 'block';
    alertContainer.classList.add(type);

    document.querySelector("#alert-message").textContent = message;

    setTimeout(()=>{
        alertContainer.style.display = 'none';
        alertContainer.classList.remove(type);
    }, 5000)
}

window.onload = ()=>{
    console.log("... start")
    
}