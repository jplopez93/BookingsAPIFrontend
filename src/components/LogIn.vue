<template>
  <div class="logIn_passenger">
    <div class="container_logIn_passenger">
      <div class="menu">
        <div id="registro" style="margin-bottom: 80vh">
          <h1>Iniciar sesión</h1>
          <hr />
          <form v-on:submit.prevent="processLogInPassenger">
            <input type="email" v-model="passenger.email" placeholder="Email" />
            <br />
            <input
              type="password"
              v-model="passenger.password"
              placeholder="Password"
            />
            <br />
            <hr />
            <button type="submit" class="registerbtn">Iniciar Sesion</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LogIn",

  data: function () {
    return {
      passenger: {
        email: "",
        password: "",
      },
    };
  },

  methods: {
    processLogInPassenger: function () {
      axios
        .post("https://airtic-back-end.herokuapp.com/login/", this.passenger, {
          headers: {},
        })
        .then((result) => {
          let dataLogIn = {
            email: this.passenger.email,
            token_access: result.data.access,
            token_refresh: result.data.refresh,
          };

          this.$emit("completedLogIn", dataLogIn);
        })
        .catch((error) => {
          if (error.response.status == "401")
            alert("ERROR 401: Credenciales Incorrectas.");
        });
    },
  },
};
</script>