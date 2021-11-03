<template>
  <div class="signUp_passenger">
    <div class="container_signUp_passenger">
      <div class="menu">
        <div id="registro">
          <form v-on:submit.prevent="processSignUp">
            <h1>Regístrate</h1>
            <p>Por favor completa este formulario para crear una cuenta.</p>
            <hr />

            <label for="email"><b>E-mail</b></label>
            <input
              type="email"
              v-model="passenger.email"
              placeholder="Correo electrónico"
            />

            <label for="psw"><b>Contraseña</b></label>
            <input
              type="password"
              v-model="passenger.password"
              placeholder="Contraseña"
            />

            <label for="psw-repeat"><b>Nombre</b></label>
            <input type="text" v-model="passenger.name" placeholder="Nombre" />
            <div class="box-register">
              <label for="psw-repeat"><b>Documento</b></label>
              <input
                class="document-input"
                type="number"
                v-model="passenger.document"
                placeholder="Documento"
              />
              <label for="psw-repeat"><b>Fecha de nacimiento</b></label>
              <input
                type="date"
                v-model="passenger.birth_date"
                placeholder="Fecha de nacimiento"
              />
            </div>
            <div class="box-register">
              <label for="psw-repeat" class="cellphone-label"
                ><b>Celular</b></label
              >
              <input
                class="cellphone-input"
                type="number"
                v-model="passenger.cellphone"
                placeholder="Celular"
              />

              <label for="psw-repeat"><b>Género</b></label>
              <select v-model="passenger.gender" placeholder="Género">
                <option disabled value="">Seleccione uno</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            <hr />

            <p>
              Cuando creas tu cuenta aceptas nuestros
              <a href="#">Terminos & Políticas de Privacidad</a>.
            </p>
            <button type="submit" class="registerbtn">Regístrate</button>
          </form>
        </div>
      </div>
    </div>
    <footer>
      <h3>
        Inicia con<br /><br /><i
          class="fa fa-facebook-square fa-2x"
          aria-hidden="true"
        ></i
        ><br />
        <i class="fa fa-instagram fa-2x" aria-hidden="true"></i><br />
        <i class="fa fa-google fa-2x" aria-hidden="true"></i>
      </h3>
    </footer>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SignUp",

  data: function () {
    return {
      passenger: {
        name: "",
        document: 0,
        email: "",
        password: "",
        birth_date: new Date().toJSON().toString(),
        cellphone: 0,
        gender: "",
      },
    };
  },

  methods: {
    processSignUp: function () {
      this.passenger.birth_date += "T00:00:00Z";

      axios
        .post(
          "https://airtic-back-end.herokuapp.com/passenger/",
          this.passenger,
          {
            headers: {},
          }
        )
        .then((result) => {
          let dataSignUp = {
            email: this.passenger.email,
            token_access: result.data.access,
            token_refresh: result.data.refresh,
          };

          this.$emit("completedSignUp", dataSignUp);
        })
        .catch((error) => {
          console.log(error);
          alert("ERROR: Fallo en el registro.");
        });
    },
  },
};
</script>
<style >
.box-register label {
  margin-left: 0%;
}

.box-register {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>