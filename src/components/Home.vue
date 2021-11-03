<template>
  <div class="home">
    <div id="reservas">
      <div class="btn-group">
        <button v-on:click="loadBookings">Reservas</button>
        <button v-on:click="loadManageBookings">Gestionar Reservas</button>
        <button v-on:click="loadStatusFlight">Estado de Vuelo</button>
      </div>
      <div class="reservaInput">
        <form action="/action_page.php" v-on:submit.prevent="lookFlight">
          <select v-model="selected.from" placeholder="De">
            <option disabled value="">Seleccione el origen</option>
            <option
              v-for="airport in airports"
              v-bind:value="airport.id_airport"
            >
              {{ airport.cod }}, {{ airport.city }}
            </option>
          </select>
          <select v-model="selected.to" placeholder="A">
            <option disabled value="">Seleccione el destino</option>
            <option
              v-for="airport in airports"
              v-bind:value="airport.id_airport"
            >
              {{ airport.cod }}, {{ airport.city }}
            </option>
          </select>
          <input
            v-model="selected.date_from"
            type="date"
            id="name"
            name="salida"
            placeholder="Salida"
          />
          <button type="submit" class="registerbtn">Buscar Vuelo</button>
        </form>
      </div>
    </div>
    <flights v-if="is_looking" ref="flightComponent"></flights>
    <div id="viaje">
      <h1>Viaje seguro con nosotros</h1>
      <p>
        Puede contar con nosotros para viajar con seguridad, somos una de la
        aerolíneas globales con más experiencia <br />durante la crisis del
        COVID-19. Contamos con expertos para asesorar a nuestros equipos y
        tripulaciones.
      </p>
    </div>

    <div id="pasear">
      <div class="column">
        <img src="../files/camel.jpg" alt="Paseo en camello" />
      </div>
      <div class="column">
        <img src="../files/it.jpg" alt="Comida asiática" />
      </div>
      <div class="column">
        <img src="../files/rest.jpg" alt="Fiebre de futbol" />
      </div>
      <div class="column">
        <img src="../files/app.jpg" alt="Fiebre de futbol" />
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import jwt_decode from "jwt-decode";
import Flights from "./Flights.vue";

export default {
  components: { Flights },
  data: function () {
    return {
      airports: null,
      selected: {
        from: "",
        to: "",
        date_from: new Date().toJSON().toString(),
        month: null,
        year: null,
      },
      is_looking: false,
      a: "",
    };
  },
  created() {
    this.verifyToken();
  },
  mounted() {
    this.updateCities();
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
    updateCities: async function () {
      let token = localStorage.getItem("token_access");
      let userId = jwt_decode(token).user_id.toString();
      axios
        .get(`https://airtic-back-end.herokuapp.com/airports/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          this.airports = result.data;
        })
        .catch((error) => {
          console.log(error);
          alert("ERROR: Fallo carga de información del aeropuertos");
        });
    },
    lookFlight: function () {
      this.is_looking = true;
      this.choiseselected();
      localStorage.setItem("airportsSelected", JSON.stringify(this.selected));
      this.$refs.flightComponent.getFlights();
    },
    choiseselected: function () {
      this.selected.year = this.selected.date_from.substr(0, 4);
      this.selected.month = this.selected.date_from.substr(5, 2);
    },
    loadBookings: function () {
      this.$router.push({ name: "bookings" });
    },
    loadManageBookings: function () {
      this.$router.push({ name: "manageBookings" });
    },
    loadStatusFlight: function () {
      this.$router.push({ name: "statusFlight" });
    },
  },
};
</script>
<style>
#reservas {
  border-radius: 15px;
  display: block;
  overflow: hidden;
  width: 50vw;
  min-height: 35vh;
  height: auto;
  position: relative;
  margin: auto;
  margin-top: -20vh;
  padding: 20px;
  color: black;
  background-color: whitesmoke;
  z-index: 1;
}

.reservaInput input,
select {
  margin: 3px;
}

#reservas a {
  float: left;
  font-size: 16px;
  color: black;
  text-align: center;
  text-decoration: none;
  width: 30%;
  position: relative;
}
#reservas input[type="text"],
input[type="date"],
select {
  width: 28%;
  height: 7vh;
  padding: 12px 20px;
  margin: 8px 8;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-weight: 100;
}

#reservas input[type="submit"]:hover {
  background-color: gold;
}

.btn-group button {
  width: 33.3%;
  background-color: #474747;
  border: 1px solid white;
  color: white;
  padding: 12px 24px;
  cursor: pointer;
  float: left;
  margin-bottom: 20px;
}

/* Clear floats (clearfix hack) */
.btn-group:after {
  content: "";
  clear: both;
  display: table;
}
.btn-group button:not(:last-child) {
  border-right: none; /* Prevent double borders */
}
/* Add a background color on hover */
.btn-group button:hover {
  background-color: #e2c044;
}
</style>