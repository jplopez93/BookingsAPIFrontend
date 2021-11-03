<template>
  <div class="vuelos">
    <div id="listFlight" class="tables">
      <h1>Reserva tu vuelo</h1>
      <table highlight-current-row>
        <thead>
          <tr>
            <th>No. vuelo</th>
            <th>Fecha de salida</th>
            <th>Fecha de llegada</th>
            <th>De</th>
            <th>A</th>
            <th>Precio Economica</th>
            <th>Precio Ejecutiva</th>
            <th>Avión</th>
          </tr>
        </thead>
        <tbody v-on:click="flightSelected = flight.id_flight">
          <tr
            ref="flight"
            class="flight"
            v-for="flight in flights"
            :key="flight.id_flight"
            :class="selectedFlight == flight.id_flight ? 'current-update' : ''"
          >
            <td ref="flight">{{ flight.id_flight }}</td>
            <td>
              {{ flight.departure.substr(0, 10) }},
              {{ flight.departure.substr(11, 5) }}
            </td>
            <td>
              {{ flight.arrival.substr(0, 10) }},
              {{ flight.arrival.substr(11, 5) }}
            </td>
            <td>{{ flight.route.from }}</td>
            <td>{{ flight.route.to }}</td>
            <td
              v-on:click="
                (flightSelected = flight.id_flight), (classSelected = 'E')
              "
              class="select-flight"
            >
              USD {{ flight.route.routeType[0].fare }}
            </td>
            <td
              v-on:click="
                (flightSelected = flight.id_flight), (classSelected = 'J')
              "
              class="select-flight"
            >
              USD {{ flight.route.routeType[1].fare }}
            </td>
            <td>{{ flight.plane }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="flightSelected != ''" class="selected-flight">
        <h1>
          Seleccionaste el Vuelo {{ flightSelected }} con la clase

          {{ classSelected == "J" ? "Ejecutiva" : "Turista" }}. <br />
          Valor : USD
          {{
            classSelected == "J"
              ? flights[0].route.routeType[1].fare
              : flights[0].route.routeType[0].fare
          }}
        </h1>
        <button v-on:click="makeBooking" type="submit" class="registerbtn">
          Reservar
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import jwt_decode from "jwt-decode";
export default {
  data: function () {
    return {
      flights: null,
      flightSelected: "",
      classSelected: "",
    };
  },
  mounted() {
    this.getFlights();
  },
  methods: {
    getFlights: function () {
      let flightToSearch = JSON.parse(localStorage.getItem("airportsSelected"));

      let token = localStorage.getItem("token_access");
      let userId = jwt_decode(token).user_id.toString();
      axios
        .get(
          `https://airtic-back-end.herokuapp.com/flights/filter/${userId}/${flightToSearch.from}/${flightToSearch.to}/${flightToSearch.month}/${flightToSearch.year}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((result) => {
          this.flights = result.data;
        })
        .catch((error) => {
          console.log(error);
          alert("ERROR: Fallo en el registro.");
        });
    },
    makeBooking: function () {
      let token = localStorage.getItem("token_access");
      let userId = jwt_decode(token).user_id.toString();

      let new_booking = {
        date_booking: new Date().toJSON().toString(),
        id_passenger: parseInt(userId, 10),
        coupon: 1,
        id_flight: this.flightSelected,
        category: this.classSelected,
      };
      axios
        .post(`https://airtic-back-end.herokuapp.com/booking/`, new_booking, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          alert(result.data);
          this.loadBookings();
        })
        .catch((error) => {
          console.log(error);
          alert("ERROR: Fallo en la generación de la reserva.");
        });
    },
    loadBookings: function () {
      this.$router.push({ name: "bookings" });
    },
  },
};
</script>
<style>
.vuelos {
  margin: 0 auto;
}

#listFlight {
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

.selected-flight h1 {
  border-radius: 10px;
  padding: 15px 0 15px 0;
  background: #d3d0cb;
  margin-top: 40px;
}

.select-flight {
  cursor: pointer;
}

.select-flight:hover {
  background: lightgrey;
}

.current-update {
  background-color: slateblue;
  font-weight: bold;
}
</style>