<template>
  <div class="editPassenger">
    <div class="container_editPassenger">
      <div class="menu">
        <div id="registro">
          <form action="/action_page.php" v-on:submit.prevent="updatePassenger">
            <h1>Actualiza tu perfil</h1>
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
                class="cellphone-input"
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

            <button type="submit" class="registerbtn">Guardar cambios</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import jwt_decode from "jwt-decode";

export default {
  name: "EditPassenger",

  data: function () {
    return {
      passenger: {
        name: "",
        document: 0,
        password: null,
        email: "",
        birth_date: new Date().toJSON().toString(),
        cellphone: 0,
        gender: "",
      },
    };
  },
  created() {
    this.verifyToken();
  },
  mounted() {
    this.dataPassenger();
  },
  methods: {
    verifyToken: function () {
      if (
        localStorage.getItem("token_access") === null ||
        localStorage.getItem("token_refresh") === null
      ) {
        this.$emit("logOut");
      }
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
          this.$emit("logOut");
        });
    },
    dataPassenger: function () {
      let token = localStorage.getItem("token_access");
      let userId = jwt_decode(token).user_id.toString();
      axios
        .get(`https://airtic-back-end.herokuapp.com/passenger/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          this.passenger.email = result.data.email;
          this.passenger.name = result.data.name;
          this.passenger.document = result.data.document;
          this.passenger.cellphone = result.data.cellphone;
          this.passenger.birth_date = this.validateDate(result.data.birth_date);
          this.passenger.gender = result.data.gender;
        })
        .catch((error) => {
          console.log(error);
          alert("ERROR: Fallo carga de información del pasajero");
        });
    },
    updatePassenger: function () {
      let token = localStorage.getItem("token_access");
      let userId = jwt_decode(token).user_id.toString();

      this.passenger.birth_date += "T00:00:00Z";
      axios
        .put(
          `https://airtic-back-end.herokuapp.com/passenger/update/${userId}`,
          this.passenger,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((result) => {
          this.passenger.email = result.data.email;
          this.passenger.name = result.data.name;
          this.passenger.document = result.data.document;
          this.passenger.birth_date = this.validateDate(result.data.birth_date);
          this.passenger.cellphone = result.data.cellphone;
          this.passenger.gender = result.data.gender;
          alert("Datos Actualizados");
        })
        .catch((error) => {
          console.log(error);
          this.passenger.birth_date = this.validateDate(
            this.passenger.birth_date
          );
          alert("ERROR: Fallo en la actualización.");
        });
    },
    validateDate: function (birth_date) {
      let fix_birth_date = "";
      if (birth_date != null) {
        fix_birth_date = birth_date.substr(0, 10);
      } else {
        fix_birth_date = birth_date;
      }
      return fix_birth_date;
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