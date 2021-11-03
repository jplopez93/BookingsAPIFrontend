<template>
  <div>
    <h1>Gestiona tus reservas</h1>
    <h1>Cambia tu vuelo</h1>
    <div id="registro">
      <div class="block-two">
        <form>
          <hr />
          <br />
          <div>
            <label for="psw-repeat"
              ><b style="font-size: 22px; color: black"
                >Elija la reserva que quiere cambiar</b
              ></label
            >
            <br />
            <br />
            <select
              v-model="new_booking.id_booking"
              placeholder="Elija la reserva que quiere cambiar"
              v-on:change="selected"
            >
              <option disabled value="">
                Elija la reserva que quiere cambiar
              </option>
              <option
                v-for="booking in bookings"
                v-bind:value="booking.id_booking"
              >
                PNR: {{ booking.pnr }}, No Vuelo {{ booking.flight.id_flight }},
                Origen: {{ booking.flight.route.from }}, Destino:
                {{ booking.flight.route.to }}
              </option>
            </select>
          </div>
          <button class="registerbtn" v-on:click.prevent="deleteBooking">
            Eliminar reserva
          </button>
          <hr />
          <h2 style="font-size: 22px; color: black">
            Por favor completa este formulario para cambiar tu vuelo.
          </h2>
          <label id="label-from" for="psw-repeat">Fecha de Salida</label>
          <input
            v-model="dateSelected"
            type="date"
            id="name"
            name="salida"
            placeholder="Salida"
            v-on:change="getFlights"
          />
          <label id="label-from" for="psw-repeat">Clase</label>
          <select v-model="new_booking.category" placeholder="Clase">
            <option disabled value="">Clase</option>
            <option value="E">Economica</option>
            <option value="J">Ejecutiva</option>
          </select>

          <label id="label-from" for="psw-repeat">Elije el vuelo</label>
          <select v-model="new_booking.id_flight" placeholder="Elije el vuelo">
            <option disabled value="">Elije el vuelo</option>
            <option v-for="flight in flights" v-bind:value="flight.id_flight">
              Origen: {{ flight.route.from }}, Destino {{ flight.route.to }},
              Hora de Salida {{ flight.departure.substr(0, 10) }},
              {{ flight.departure.substr(11, 5) }} Hora de llegada
              {{ flight.arrival.substr(0, 10) }},
              {{ flight.arrival.substr(11, 5) }}
            </option>
          </select>
          <hr />
          <button class="registerbtn" v-on:click.prevent="updateBooking">
            Actualizar reserva
          </button>
        </form>
      </div>
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
      new_booking: {
        date_booking: new Date().toJSON().toString(),
        id_passenger: "",
        coupon: 1,
        id_flight: "",
        category: "",
        id_booking: "",
      },

      bookings: [],
      flights: null,
      bookingSelected: null,
      dateSelected: null,
    };
  },
  created() {
    this.verifyToken();
  },
  mounted() {
    this.showBooking();
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
    selected: function () {
      this.bookings.forEach((booking) => {
        if (booking.id_booking === this.new_booking.id_booking) {
          this.bookingSelected = booking;
        }
      });
    },
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
    getFlights: function () {
      let token = localStorage.getItem("token_access");
      let userId = jwt_decode(token).user_id.toString();
      let from = this.bookingSelected.flight.route.id_from;
      let to = this.bookingSelected.flight.route.id_to;
      let year = this.dateSelected.substr(0, 4);
      let month = this.dateSelected.substr(5, 2);

      axios
        .get(
          `https://airtic-back-end.herokuapp.com/flights/filter/${userId}/${from}/${to}/${month}/${year}`,
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
    updateBooking: function () {
      let token = localStorage.getItem("token_access");
      let userId = jwt_decode(token).user_id.toString();
      this.new_booking.id_passenger = parseInt(userId, 10);
      axios
        .put(
          `https://airtic-back-end.herokuapp.com/booking/update/${userId}/${this.new_booking.id_booking}`,
          this.new_booking,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((result) => {
          alert(`Se actualizo correctamente, nuevo PNR ${result.data.pnr}`);
          this.loadBookings();
        })
        .catch((error) => {
          console.log(error);
          alert("ERROR: Fallo al actualizar registro.");
        });
    },
    loadBookings: function () {
      this.$router.push({ name: "bookings" });
    },
    deleteBooking: function () {
      var resultado = window.confirm(
        `¿Estas seguro que quieres eliminar la reserva ${this.bookingSelected.pnr}?`
      );
      if (resultado === true) {
        let token = localStorage.getItem("token_access");
        let userId = jwt_decode(token).user_id.toString();

        axios
          .delete(
            `https://airtic-back-end.herokuapp.com/booking/remove/${userId}/${this.new_booking.id_booking}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((result) => {
            alert(`${result.data}`);
            this.loadBookings();
          })
          .catch((error) => {
            console.log(error);
            alert("ERROR: Fallo al actualizar registro.");
          });
      }
    },
  },
};
</script>
<style>
.block-two label,
.block-two input[type="date"],
.block-two select {
  width: 100%;
  margin-left: 0%;
  margin: 10px 0 10px 0;
}

#label-from {
  font-size: 20px;
  color: black;
  font-weight: bold;
  text-align: center;
}
</style>