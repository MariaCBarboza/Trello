import { createRouter, createWebHashHistory } from 'vue-router';
import CadastroUsuario from './components/CadastroUsuario.vue';
import HomeComponent from './components/HomeComponent.vue';
import LoginComponent from './components/LoginComponent.vue';

const routes = [
    { path: '/cadastro', component: CadastroUsuario },
    { path: '/login', component: LoginComponent },
    {path: '', component: HomeComponent},
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
