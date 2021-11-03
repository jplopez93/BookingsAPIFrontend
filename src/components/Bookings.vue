<template>
  <div class="bookings">
    <div id="listbookings" class="tables">
      <h1>Reservas</h1>

      <table>
        <thead>
          <tr>
            <th>PNR</th>
            <th>Fecha de reserva</th>
            <th>Pasajero</th>
            <th>Documento</th>
            <th>Cupon</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Hora de salida</th>
            <th>Hora de llegada</th>
            <th>Clase</th>
            <th>Avión</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in bookings" :key="booking.id_booking">
            <td>{{ booking.pnr }}</td>
            <td>{{ booking.date_booking.substr(0, 10) }}</td>
            <td>{{ booking.passenger.name }}</td>
            <td>{{ booking.passenger.document }}</td>
            <td>{{ booking.coupon }}</td>
            <td>{{ booking.flight.route.from }}</td>
            <td>{{ booking.flight.route.to }}</td>
            <td>
              {{ booking.flight.departure.substr(0, 10) }},
              {{ booking.flight.departure.substr(11, 5) }}
            </td>
            <td>
              {{ booking.flight.arrival.substr(0, 10) }},
              {{ booking.flight.arrival.substr(11, 5) }}
            </td>
            <td>{{ booking.flight.route.routeType[0].category }}</td>
            <td>{{ booking.flight.plane }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import jwt_decode from "jwt-decode";

export default {
  name: "Booking",

  data: function () {
    return {
      bookings: [],
    };
  },
  mounted() {
    this.showBooking();
  },
  methods: {
    showBooking: function () {
      let token = localStorage.getItem("token_access");
      let userId = jwt_decode(token).user_id.toString();

      axios
        .get(`https://airtic-back-end.herokuapp.com/bookings/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          this.bookings = result.data;
        })
        .catch((error) => {
          console.log(error);
          alert("ERROR: Fallo al cargar reservas");
        });
    },
  },
};
</script>
<style>
.bookings {
  margin: 0 auto;
}

#listbookings {
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
</style>
