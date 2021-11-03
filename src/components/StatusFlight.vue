<template>
  <div>
    <div class="box-select-flight">
      <div>
        <form>
          <label for=""> Elija el numero de vuelo </label>
          <select
            v-model="selected"
            placeholder="Seleccione el vuelo"
            v-on:change="selectedFlight"
            class="select-flight"
          >
            <option disabled value="">Seleccione el vuelo</option>
            <option v-for="flight in flights" v-bind:value="flight.id_flight">
              {{ flight.id_flight }}, Origen: {{ flight.route.from }}, Destino:
              {{ flight.route.to }}
            </option>
          </select>
        </form>
      </div>
    </div>
    <div class="flights" v-if="is_seleted">
      <div id="statusFlight" class="tables">
        <table>
          <thead>
            <tr>
              <th>No. vuelo</th>
              <th>Fecha de salida</th>
              <th>Fecha de llegada</th>
              <th>De</th>
              <th>A</th>
              <th>Avión</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ flight.id_flight }}</td>
              <td>
                {{ flight.departure.substr(0, 10) }}
                {{ flight.departure.substr(11, 5) }}
              </td>
              <td>
                {{ flight.arrival.substr(0, 10) }}
                {{ flight.arrival.substr(11, 5) }}
              </td>
              <td>{{ flight.route.from }}</td>
              <td>{{ flight.route.to }}</td>
              <td>{{ flight.plane }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import jwt_decode from "jwt-decode";

export default {
  name: "StatusFlight",

  data: function () {
    return {
      flights: [],
      selected: "",
      flight: "",
      is_seleted: false,
    };
  },
  created() {
    this.verifyToken();
  },
  mounted() {
    this.showflights();
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
    selectedFlight: function () {
      for (const flight of this.flights) {
        if (flight.id_flight === this.selected) {
          this.flight = flight;
          this.is_seleted = true;
        }
      }
    },
    showflights: function () {
      let token = localStorage.getItem("token_access");
      let userId = jwt_decode(token).user_id.toString();

      axios
        .get(`https://airtic-back-end.herokuapp.com/flights/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          this.flights = result.data;
        })
        .catch((error) => {
          console.log(error);
          alert("ERROR: Fallo al cargar los vuelos");
        });
    },
  },
};
</script>
<style>
tr:nth-child(even) {
  background-color: #e2c044; /* si lo quieres en gris como la foto #dddddd*/
}
.flights {
  margin: 0 auto;
}

#statusFlight {
  width: 80%;
  position: center;
  display: block;
  margin: inherit;
  background-color: whitesmoke;
  border-radius: 25px;
  padding: 30px;
  margin-top: 5vh;
  align-items: center;
}

.select-flight {
  width: 100%;
  margin-top: 3%;
}

.box-select-flight {
  border-radius: 15px;
  display: block;
  overflow: hidden;
  width: 50vw;
  min-height: 25vh;
  height: fit-content;
  position: relative;
  margin: auto;
  margin-top: -20vh;
  padding: 20px;
  color: black;
  background-color: whitesmoke;
  z-index: 1;
}

.world-image {
  margin-top: 0%;
}
</style>

