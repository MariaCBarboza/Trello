import { createRouter, createWebHistory } from 'vue-router';
import Auth from '../views/Auth.vue';
import Home from '../views/Home.vue';
import Boards from '../views/Boards.vue';
import Board from '../views/Board.vue';
import Login from '../components/LoginComponent.vue';
import Cadastro from '../components/CadastroUsuario.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';
import ChangePassword from '../views/ChangePassword.vue';
import Config from '@/views/Config.vue';

const routes = [
  { path: '/', name: 'Auth', component: Auth, meta: { hideNavbar: true } },
  { path: '/home', name: 'Home', component: Home },
  { path: '/boards', name: 'Boards', component: Boards },
  { path: '/board/:id', name: 'Board', component: Board },
  { path: '/login', name: 'Login', component: Login, meta: { hideNavbar: true } },
  { path: '/cadastro', name: 'Cadastro', component: Cadastro, meta: { hideNavbar: true } },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/change-password', name: 'ChangePassword', component: ChangePassword },
  { path: '/config', name: 'Config', component: Config}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;