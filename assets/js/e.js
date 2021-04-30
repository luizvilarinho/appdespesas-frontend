
function s(selector){
  if(document.querySelectorAll(selector).length === 1){
    return document.querySelector(selector);
  }else{
    return document.querySelectorAll(selector);
  }
}

var getCookies = function(){
  var cookies={};
  var cookiesArray = document.cookie.split(";");

  for(var i=0; i< cookiesArray.length; i++){

      cookies[cookiesArray[i].split("=")[0]] = cookiesArray[i].split("=")[1]
  }

  return cookies;
}

var logout=function(){
  localStorage.removeItem("ecoAccessToken");
  location.assign(config[environment].loginPage);
}

var controller = {
  showMonth:false,
  itemSelected:function(){
    var itemId= "";
    var blocoId = "";
    document.querySelectorAll("input[type='radio']").forEach((el)=>{
      if(el.checked){
        itemId = el.value;
        blocoId = el.parentElement.parentElement.parentElement.id
      }
    });
    
    return {
      blocoId:blocoId,
      itemId:itemId
    }
  },
  mes_id: new Date().getMonth() + 1,
  templateItem:function(nome, valor, id){
    var valor = parseFloat(valor).toLocaleString('pt-br', {style:'currency', currency:'BRL' });
    let template = `<div class="e-card__item m1">
        <input type="radio" onchange="controller.itemSelected()" name="itens" value="${id}" />
        <div class="m2">${nome}</div> 
        <div class="m2">${valor}</div>
        </div>`;

    return template;
  },
  card_footer:function(cardSelector){
    let template = `<div class="card-footer">
        <div class="edit m2 s2" onclick="controller.edit('${cardSelector}')">editar</div>
        <div class="delete m2 s2" onclick="controller.delete('${cardSelector}')">apagar</div>
        </div>`;

        return template;
  },
  somarValores:function(){
    var totalDespesasFixas = 0;
    var totalDespesasVariaveis = 0;
    var totalEntradas = 0;

    if(data.despesasFixas.length > 0){
      totalDespesasFixas = data.despesasFixas.filter((el)=>el.mes == controller.mes_id)
      
      if(totalDespesasFixas.length == 0){
        totalDespesasFixas = 0;
      }
      if(totalDespesasFixas.length > 0){
        totalDespesasFixas = totalDespesasFixas.map(el=> el.valor)
        .reduce((acc, val)=> parseFloat(acc) + parseFloat(val));
      }
    }

    if(data.despesasVariaveis.length > 0){
      totalDespesasVariaveis = data.despesasVariaveis.filter((el)=>el.mes == controller.mes_id)
      
      if(totalDespesasVariaveis.length == 0){
          totalDespesasVariaveis = 0;
      }
      if(totalDespesasVariaveis.length > 0){
        totalDespesasVariaveis = totalDespesasVariaveis.map(el=> el.valor)
        .reduce((acc, val)=> parseFloat(acc) + parseFloat(val));
      }
    }
    
    if(data.entradas.length > 0){
      totalEntradas = data.entradas.filter((el)=>el.mes == controller.mes_id);
      
      if(totalEntradas.length == 0){
        totalEntradas = 0;
      }

      if(totalEntradas.length > 0){
        totalEntradas = totalEntradas.map(el=> el.valor)
        .reduce((acc, val)=> parseFloat(acc) + parseFloat(val));
      }
    }
    
    return {
      totalDespesasFixas:totalDespesasFixas,
      totalDespesasVariaveis:totalDespesasVariaveis,
      totalEntradas:totalEntradas,
      despesas: parseFloat(totalDespesasFixas)  +parseFloat(totalDespesasVariaveis),
      resultado:parseFloat(totalEntradas) - (parseFloat(totalDespesasFixas) + parseFloat(totalDespesasVariaveis))

    }
  },
  addItem:async function(idBloco, blocoObject){
    if(s(idBloco + " input")[0].value == '' || s(idBloco + " input")[1].value ==''){
      return false;
    }


    var despesa={
      bloco:blocoObject,
      nome:s(idBloco + " input")[0].value,
      valor:s(idBloco + " input")[1].value,
      mes:controller.mes_id,
   };

    s(idBloco + " input")[0].value = "";
    s(idBloco + " input")[1].value = "";

    await addItem(despesa)
    
  },
  edit: function(cardSelector){
    var bloco = controller.itemSelected().blocoId;
    var itemId = controller.itemSelected().itemId;

    var isCorrectEntrie = document.querySelector(`${cardSelector} input[type='radio'][value='${itemId}']`).checked
    
    if(isCorrectEntrie){
      for(let bl in data){
        if(Array.isArray(data[bl])){
          data[bl].forEach(function(item){
            if (item.id == itemId){
              s(`#${bloco} input`)[0].value = item.nome;
              s(`#${bloco} input`)[1].value = item.valor;
    
              deleteData(itemId)
            }
          })
        }
      }
    }
  },
  delete:async function(cardSelector){
    var itemId = controller.itemSelected().itemId;

    var isCorrectEntrie = document.querySelector(`${cardSelector} input[type='radio'][value='${itemId}']`).checked
    
    if(isCorrectEntrie){
      await deleteData(itemId);
    }
  
  },
  render:function(){
    
    s("#dados").classList.add('drop');
    
    setTimeout(function(){
      s("#dados").classList.remove('drop');
    }, 1000)

    s("#despesas-fixas .e-cards-item__container").innerHTML = "";
    s("#despesas-variaveis .e-cards-item__container").innerHTML = "";
    s("#entradas .e-cards-item__container").innerHTML = "";

    render(data.despesasFixas,"#despesas-fixas .e-cards-item__container");
    render(data.despesasVariaveis,"#despesas-variaveis .e-cards-item__container");
    render(data.entradas,"#entradas .e-cards-item__container");

  }
  
  
}

function toggleMonth(showMonth){
  controller.showMonth = !showMonth;

  controller.showMonth ? s("header ul").classList.add("show-months") : s("header ul").classList.remove("show-months");
  controller.showMonth ? s(".header-month").classList.add("drop") : s(".header-month").classList.remove("drop")
}

function render(obj, selector){
  gravarDados(data);

  if(obj == undefined){
    return false;
  }
    obj.filter(el=>{
        if(el.mes == controller.mes_id){
          return el;
        };
    }).forEach(el=>{
      s(selector).innerHTML += controller.templateItem(el.nome, el.valor,el.id);
    })

    console.log("SELECTPR", selector)
    s(selector).innerHTML += controller.card_footer(selector);
   
    var valor = controller.somarValores();

    s('#total-despesas-fixas').innerText = parseFloat(valor.totalDespesasFixas).toLocaleString('pt-br', {style:'currency', currency:'BRL' });
    s('#total-despesas-variaveis').innerText = parseFloat(valor.totalDespesasVariaveis).toLocaleString('pt-br', {style:'currency', currency:'BRL' });
    s('#total-despesas').innerText = parseFloat(valor.despesas).toLocaleString('pt-br', {style:'currency', currency:'BRL' });
    s('#total-entradas').innerText = parseFloat(valor.totalEntradas).toLocaleString('pt-br', {style:'currency', currency:'BRL' });
    s('#receitaMes').innerText = parseFloat(valor.resultado).toLocaleString('pt-br', {style:'currency', currency:'BRL' })
}

s(".selected").addEventListener("click", function(){
  toggleMonth(controller.showMonth);
});

function gravarDados(data){
  void(0);
}


window.onload = async function(){
  
  getUser();
  
  await getData();

  var months = s(".header-month li")

  //open the current month
  s(".header-month li.selected").innerText = s(".header-month li")[controller.mes_id].innerText;

  var monthsArray = new Array(...months);

  monthsArray.map((el, idx)=>{
    if(idx == 0){
      return false;
    }

    //put event on months li
    el.addEventListener("click", function(month){
      var mes = el.innerText;
      var mesId = el.attributes["data-id"].value;
      s(".show-months .selected").innerText = mes;
      s(".show-months").classList.remove("show-months");
      controller.showMonth = false;
      controller.mes_id = mesId;
      controller.render();
    })
  })
  
}