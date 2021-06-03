
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
  //alert("redirect", '/eco-login.html')
  location.assign('/eco-login.html', '_self');
}

var controller = {
  showMonth:false,
  showYear:false,
  itemSelected:function(){
    var itemId= "";
    var blocoId = "";
    document.querySelectorAll("input[type='radio']").forEach((el)=>{
      if(el.checked){
        itemId = el.value;
        blocoId = el.parentElement.parentElement.parentElement.parentElement.id
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
    let id = "#" + s(cardSelector).parentElement.parentElement.attributes.id.value;
    let template = `<div class="card-footer">
        <div class="edit m2 s2" onclick="controller.edit('${id}')">editar</div>
        <div class="delete m2 s2" onclick="controller.delete('${id}')">apagar</div>
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
      ano: parseInt(s(".header-year .selected").textContent)
   };

    s(idBloco + " input")[0].value = "";
    s(idBloco + " input")[1].value = "";

    await addItem(despesa, controller.mes_id)
    
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
    
              deleteData(itemId, controller.mes_id)
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
      await deleteData(itemId, controller.mes_id);
    }
  
  },
  render:async function(mes){
    
    console.log(mes != controller.mes_id)
    if(mes != controller.mes_id){
      s("#dados").classList.add('drop');
      
      setTimeout(function(){
        s("#dados").classList.remove('drop');
      }, 1000)
    }

    s("#despesas-fixas .card-content").innerHTML = "";
    s("#despesas-variaveis .card-content").innerHTML = "";
    s("#entradas .card-content").innerHTML = "";

    render(data.despesasFixas,"#despesas-fixas .card-content");
    render(data.despesasVariaveis,"#despesas-variaveis .card-content");
    render(data.entradas,"#entradas .card-content");

  }
  
  
}

function toggleMonth(showMonth){
  controller.showMonth = !showMonth;

  controller.showMonth ? s("header div.header-month ul").classList.add("show-months") : s("header div.header-month ul").classList.remove("show-months");
  controller.showMonth ? s(".header-month").classList.add("drop") : s(".header-month").classList.remove("drop")
}

function toggleYear(showYear){
  controller.showYear = !showYear;

  controller.showYear ? s("header div.header-year ul").classList.add("show-years") : s("header div.header-year ul").classList.remove("show-years");
  controller.showYear ? s(".header-year").classList.add("drop") : s(".header-year").classList.remove("drop")
}

function render(obj, selector){

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

    //console.log("SELECTPR", s(selector).parentElement.children[1])
    //s(selector).parentElement.innerHTML += controller.card_footer(selector);
    if(!s(selector).parentElement.children[1]){
      s(selector).parentElement.innerHTML += controller.card_footer(selector);
    }
    
   
    var valor = controller.somarValores();

    s('#total-despesas-fixas').innerText = parseFloat(valor.totalDespesasFixas).toLocaleString('pt-br', {style:'currency', currency:'BRL' });
    s('#total-despesas-variaveis').innerText = parseFloat(valor.totalDespesasVariaveis).toLocaleString('pt-br', {style:'currency', currency:'BRL' });
    s('#total-despesas').innerText = parseFloat(valor.despesas).toLocaleString('pt-br', {style:'currency', currency:'BRL' });
    s('#total-entradas').innerText = parseFloat(valor.totalEntradas).toLocaleString('pt-br', {style:'currency', currency:'BRL' });
    s('#receitaMes').innerText = parseFloat(valor.resultado).toLocaleString('pt-br', {style:'currency', currency:'BRL' })
}

s(".header-month .selected").addEventListener("click", function(){
  toggleMonth(controller.showMonth);
});

async function renderListaAnos(lista){
  
  var anoAtual = new Date().getFullYear();

  if(!lista.includes(anoAtual) || lista.length == 0){
    lista.push(anoAtual)
    lista.sort((a,b)=>{
      return b-a;
    })
  }

  for(var i = 0; i< lista.length; i++){
    var template = `<li class="" data-id="${lista[i]}">${lista[i]}</li>`;
    s('.header-year ul').innerHTML += template
  }
  
  document.querySelectorAll('.header-year ul li')[0].classList.add('selected');

  var liAnos = new Array(...document.querySelectorAll('.header-year ul li'))
  liAnos.map((el)=>{
    el.addEventListener('click', async function(){
      var anoSelecionado = parseInt(this.innerText);
      console.log(anoSelecionado)
      //controller.showYear = true;
      toggleYear(controller.showYear);

      if(this.classList.value == 'selected'){
        return false;
      }
      
      s('.header-year li.selected').classList.remove('selected')
      this.classList.add('selected');
      //s('#dados').classList.add('drop');
      await getData(controller.mes_id, anoSelecionado);
      controller.render();
     
    })
  })
}

window.onload = async function(){
  
  getUser();
  
  var mesAtualId = new Date().getMonth() + parseInt(1);
  var anoAtual = new Date().getFullYear();
  await getData(mesAtualId, anoAtual);

  var months = s(".header-month li")
  var listaAnos = await getyears();

  renderListaAnos(listaAnos);

  //open the current month
  s(".header-month li.selected").innerText = s(".header-month li")[controller.mes_id].innerText;

  var monthsArray = new Array(...months);

  monthsArray.map((el, idx)=>{
    if(idx == 0){
      return false;
    }

    //put event on months li
    el.addEventListener("click", async function(month){
      var mes = el.innerText;
      var mesId = el.attributes["data-id"].value;
      var ano = parseInt(s('.header-year li.selected').textContent);
      s(".show-months .selected").innerText = mes;
      s(".show-months").classList.remove("show-months");
      controller.showMonth = false;

      if(controller.mes_id == mesId){
        return false;
      }

      controller.mes_id = mesId;
      await getData(controller.mes_id, ano);
      controller.render();
    })
  })
  
}