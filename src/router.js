import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import EditPassenger from './components/EditPassenger'
import LogIn from './components/LogIn'
import SignUp from './components/SignUp'
import Home from './components/Home'
import Flights from './components/Flights'
import Bookings from './components/Bookings.vue'
import ManageBookings from './components/ManageBookings.vue'
import StatusFlight from './components/StatusFlight.vue'

const routes = [{
  path: '/',
  name: 'root',
  component: App
},
{
  path: '/user/logIn',
  name: "logIn",
  component: LogIn
},
{
  path: '/user/signUp',
  name: "signUp",
  component: SignUp
},
{
  path: '/user/editPassenger',
  name: "editPassenger",
  component: EditPassenger
},
{
  path: '/home',
  name: 'home',
  component: Home
},
{
  path: '/flights',
  name: 'flights',
  component: Flights
},
{
  path: '/bookings',
  name: 'bookings',
  component: Bookings
},
{
  path: '/manageBookings',
  name: 'manageBookings',
  component: ManageBookings
},
{
  path: '/statusFlight',
  name: 'statusFlight',
  component: StatusFlight
}

]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router