
//frontend
var environment = "prod";

var config = {
  dev:{
    loginPage:"eco-login.html",
    baseUrlEco: "http://localhost:2500/api/eco/v1/data",
    getUser: "http://localhost:2500/api/eco/v1/login/users/getlogueduser"
  },
  prod:{
    loginPage:"https://www.luizvilarinho.com.br/economia/eco-login.html",
    baseUrlEco:"https://economia-webserver.herokuapp.com/api/eco/v1/data",
    getUser: "https://economia-webserver.herokuapp.com/api/eco/v1/login/users/getlogueduser"
  }
}
