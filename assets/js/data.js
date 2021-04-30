var data = {}

const url = config[environment].baseUrlEco;
const urlGetUser = config[environment].getUser;

async function getUser(){
    var token = localStorage.getItem('ecoAccessToken');
    console.log("urlGetUser", urlGetUser)
    var responseData = await fetch(urlGetUser, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
    });

    data = await responseData.json();
    
    console.log("USER", data)
    s("#userName").innerText = data.userName;
}

async function getData(){
    var token = localStorage.getItem('ecoAccessToken');
    //alert("TOKEN", token);
    var responseData = await fetch(url, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
    });

    data = await responseData.json();

    if(data.redirect){
        //alert("REDIRECT")
        location.assign(data.redirect, "_self");
    }
    
    controller.render();
}

async function addItem(bodyObject){
    console.log("BODY", bodyObject);
    var token = localStorage.getItem('ecoAccessToken');
    var responseData = await fetch(url, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          },
        body:JSON.stringify(bodyObject)
    });

    data = await responseData.json();
    getData();
}


async function deleteData(id){
    let urlDelete =  `${url}/${id}`;
    var token = localStorage.getItem('ecoAccessToken');

    var resp =  await fetch(urlDelete, {
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          },
    });
    
    respJson = await resp.json();

    getData();
}

async function editItem(objectItem){
    let urlPut =  `${url}/${objectItem.id}`;
    var token = localStorage.getItem('ecoAccessToken');

    var responseData = await fetch(urlPut, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          },
        body:JSON.stringify(objectItem)
    });

    getData();
}

/*var data = {
    despesasFixas:[
        {
            nome:"Aluguel",
            valor:"10",
            mes:"1",
            id:5
         },
         {
            nome:"gasolina",
            valor:"15",
            mes:"1",
            id:parseInt(Math.random() * 1000)
         }
        
    ],
    despesasVariaveis:[
        {
            nome:"Mercado",
            valor:"590",
            mes:"1",
            id:parseInt(Math.random() * 1000)
         }
    ],
    entradas:[
        {
            nome:"Salário",
            valor:"5000",
            mes:"2",
            id:parseInt(Math.random() * 1000)
         }
    ],
      
    
}
*/