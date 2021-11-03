<template>
  <div id="app" class="app">
    <div class="Header">
      <head>
        <title>AirTic Inicio</title>
        <title>{% block title %}Air Tic{% endblock %}</title>
        <link href="stylesheet.css" rel="main.css" type="text/css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@200&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />

        <link rel="icon" type="image/png" href="./files/logo.png" />
      </head>

      <div id="wrapper">
        <div id="bar1">
          <p>Información sobre Covid-19. Requerimientos para viajar.</p>
        </div>
        <div id="bar2">
          <p style="color: white">Check in</p>
        </div>

        <div class="menu">
          <ul>
            <li>
              <a v-on:click="loadHome" style="cursor: pointer"
                ><img src="./files/logo.png" class="logo" /><img
                  src="./files/letraslogo.png"
                  class="logo-letter"
              /></a>
            </li>
            <div class="nave">
              <button v-if="is_auth" v-on:click="loadHome">Home</button>
              <button v-if="is_auth" v-on:click="loadPerfil">Perfil</button>
              <button v-if="is_auth" v-on:click="logOut">Cerrar Sesión</button>
              <button v-if="!is_auth" v-on:click="loadSignUp">Registro</button>
              <i
                v-if="!is_auth"
                class="fa fa-user fa-2x"
                aria-hidden="true"
              ></i>
            </div>
          </ul>
        </div>

        <div class="banner">
          <img src="./files/2.jpeg" alt="Avion con logo de AirTic" />
        </div>
      </div>

      <div id="nav"></div>
    </div>
    <div class="main-component">
      <router-view
        v-on:completedLogIn="completedLogIn"
        v-on:completedSignUp="completedSignUp"
        v-on:logOut="logOut"
        v-on:verifyToken="verifyToken"
        v-on:completedEditPassenger="completedEditPassenger"
      >
      </router-view>
    </div>
    <footer>
      <img
        src="./files/map.png"
        alt="imagen de fondo mapa del mundo"
        class="world-image"
      />
      <img src="./files/wave.png" alt="Olas suaves" class="waves" />
      <h2>
        Diseñado por el grupo Nosotros del Profe Jhon<br />
        All Rights reserved 2022
      </h2>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",

  data: function () {
    return {
      is_auth: false,
    };
  },

  components: {},

  methods: {
    verifyAuth: function () {
      this.is_auth = localStorage.getItem("isAuth") || false;
      if (this.is_auth == false) this.loadLogIn();
      else this.loadHome();
    },

    loadLogIn: function () {
      this.$router.push({ name: "logIn" });
    },

    loadSignUp: function () {
      this.$router.push({ name: "signUp" });
    },

    loadPerfil: function () {
      this.$router.push({ name: "editPassenger" });
    },

    completedLogIn: function (data) {
      localStorage.setItem("isAuth", true);
      localStorage.setItem("email", data.email);
      localStorage.setItem("token_access", data.token_access);
      localStorage.setItem("token_refresh", data.token_refresh);
      alert("Autenticación Exitosa");
      this.verifyAuth();
    },

    completedSignUp: function (data) {
      alert("Registro Exitoso");
      this.completedLogIn(data);
    },

    completedEditPassenger: function (data) {
      localStorage.setItem("email", data.email);
      alert("Actualización Exitosa");
    },

    loadHome: function () {
      this.$router.push({ name: "home" });
    },

    logOut: function () {
      localStorage.clear();
      alert("Sesión Cerrada");
      this.verifyAuth();
    },
    verifyToken: function () {
      return axios
        .post(
          "https://airtic-back-end.herokuapp.com/refresh/",
          { refresh: localStorage.getItem("token_refresh") },
          { headers: {} }
        )
        .then((result) => {
          localStorage.setItem("token_access", result.data.access);
        })
        .catch(() => {
          this.logOut();
        });
    },
  },

  created: function () {
    this.verifyAuth();
  },
};
</script>

<style>
* {
  font-family: "Nunito", sans-serif;
  box-sizing: border-box;
}
#wrapper {
  width: 100%;
  color: white;
}
body {
  width: 100%;
  margin: auto;
  background-color: white;
  text-align: center;
  font-weight: 700;
}
.banner {
  height: auto;
  padding-top: 30px;
  margin-top: -30px;
}
img {
  width: 100vw;
  height: 450px;
  margin-bottom: 0;
  z-index: -900;
}
#bar1 {
  display: block;
  background-color: white;
  color: #474747;
  margin: 0;
  text-align: left;
  padding: 1px;
  padding-left: 30px;
}
#bar2 {
  display: block;
  background-color: #e41b23;
  color: white;
  margin: 0;
  text-align: left;
  padding: 1px;
  padding-left: 30px;
}

.nave button {
  background-color: white;
  color: #000000;
  padding: 16px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 14 0px;
  opacity: 0.9;
  font-size: 16px;
}

nav a {
  display: block;
  background-color: none;
  color: black;
  font-weight: 300;
  text-align: center;
  width: 100%;
  margin: 5px 0;
  font-size: 22px;
  padding: 12px 0;
  text-decoration: none;
  outline: none;
}
nav a:link,
nav a:visited {
  background-color: whitesmoke;
  color: black;
  font-weight: 500;
}
nav a:hover,
nav a:active {
  background-color: #4f4f4f;
  color: black;
  font-size: 24px;
}
ul {
  height: 10vh;
  list-style-type: none;
  margin: 0;
  padding-left: 5vw;
  overflow: hidden;
  background-color: white;
  align-items: center;
}
.logo {
  width: 30px;
  height: 30px;
}
.logo-letter {
  width: 90px;
  height: 30px;
}

li {
  float: left;
}
li a,
.dropbtn {
  display: inline-block;
  color: black;
  text-align: center;
  padding: 15px 0 0 30px;
  margin: 0;
  text-decoration: none;
}
li a:hover,
.dropdown:hover .dropbtn {
  /* estoy corrigiendo el hover*/
  display: inline-block;
  color: black;
  text-align: center;
  text-decoration: none;
}
li.dropdown {
  display: contents;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: whitesmoke;
  width: 33vw; /*ancho del panel debajo del menu inicial*/
  margin-left: 34vw;
  z-index: 1;
  top: 25vh;
}
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}
.dropdown-content a:hover {
  background-color: aqua;
}
.dropdown:hover .dropdown-content {
  display: block;
  margin-top: 35px;
}

.subnav {
  float: left;
  overflow: hidden;
  color: black;
}
.subnav .subnavbtn {
  font-size: 16px;
  border: none;
  outline: none;
  color: black;
  padding: 14px 16px;
  background-color: whitesmoke;
  font-family: inherit;
  margin: 0;
  width: 20vw;
}
.fa {
  color: red;
  padding-right: 10px;
  padding-top: 6px;
  font-size: 30px;
}
.fa:hover {
  color: #e2c044;
}

footer {
  clear: both;
  height: 35px;
  padding: 5px;
}
.world-image {
  display: block;
  height: 700px;
  margin-top: -20vh;
  margin-bottom: -10vh;
  margin-left: -2;
  opacity: 0.5;
  z-index: -100;
}
.waves {
  display: block;
  height: 700px;
  margin-left: -2;
  opacity: 0.5;
  z-index: -100;
}
.container {
  display: inline-block;
  margin-top: 50wh;
  position: relative;
  width: 60vw;
  height: 100vh;
  vertical-align: middle;
  overflow: hidden;
  z-index: -1;
}

#pasear img {
  width: 18vw;
  height: auto;
  margin: 0;
  padding: 0;
  border-radius: 6px;
}

#pasear {
  width: 80%;
  margin-left: 9vw;
  margin-top: 5vh;
  height: 100px;
}

#pasear .column {
  float: left;
  width: 25%;
  padding: 10px;
  margin-bottom: 3vh;
  text-align: center;
}
/* Clear floats after image containers */
.pasear::after {
  content: "";
  clear: both;
  display: block;
}
footer h2 {
  padding-bottom: 15vh;
}

/*Registro*/
#registro {
  width: 60vw;
  position: relative;
  margin-left: 20vw;
  margin-bottom: 20vh;
  height: 10vh;
  z-index: auto;
  margin-bottom: 110vh;
}

#registro h1,
p {
  color: #474747;
}
#registro p {
  color: #474747;
  text-align: left;
}
#registro b,
h2 {
  color: #474747;
  font-weight: 700;
  font-size: 16px;
  z-index: 1;
}

/* Add padding to containers */
.container {
  padding: 16px;
  background-color: white;
  height: 120vh;
  color: #474747;
}

/* Full-width input fields */
input[type="text"],
input[type="password"],
input[type="email"],
input[type="date"],
select {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}

/* Overwrite default styles of hr */
hr {
  border: 1px solid gold;
  margin-bottom: 25px;
}

/* Set a style for the submit button */
.registerbtn {
  background-color: #e2c044;
  border-radius: 10px;
  color: #474747;
  padding: 16px 20px;
  margin: 20px 0;
  border: none;
  cursor: pointer;
  width: 300px;
  opacity: 0.9;
  height: 70px;
  font-size: 20px;
  font-weight: bold;
}

.registerbtn:hover {
  opacity: 1;
  background-color: gold;
}

/* Add a blue text color to links */
a {
  color: dodgerblue;
}

/* Set a grey background color and center the text of the "sign in" section */
.container signing {
  background-color: #f1f1f1;
  text-align: right;
}
.container button {
  color: #474747;
  font-size: 16px;
}
/*Fin fromulario de registro*/
footer h3 {
  position: fixed;
  color: #474747;
  top: 52vh;
  left: 5vw;
  z-index: 100;
  background-color: #f1f1f1;
  padding: 6px;
  border-radius: 10px;
}
footer .fa {
  color: #474747;
  text-align: left;
  padding: 12px;
  background-color: #e2c044;
  border-radius: 12px;
  margin: 4px;
}

footer .fa:hover {
  color: deepskyblue;
}
#viaje {
  margin-top: 10vh;
  text-align: left;
  padding-top: 1vh;
  margin-left: 14vw;
  padding-right: 60px;
}
#viaje p {
  font-size: 20px;
}
#slogan {
  position: relative;
  display: inline-block;
  top: 5vh;
  margin-left: -50vw;
  padding: 0;
  text-align: left;
}
#slogan h1 {
  font-size: 40px;
}
.registerbtn:hover {
  background-color: gold;
}
.cellphone-input {
  width: 200px;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}
.cellphone-label {
  margin-left: 100px;
}
.document-input {
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}
label {
  margin-left: 20px;
}

.tables table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  border-radius: 25px;
}

.tables td,
.tables th {
  border: 1px solid darkgray;
  text-align: left;
  padding: 8px;
  width: 8%;
  height: 5vh;
}

tr:nth-child(even) {
  background-color: lightgrey;
}
</style>
