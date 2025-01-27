import { createRouter, createWebHashHistory } from 'vue-router';
import CadastroUsuario from './components/CadastroUsuario.vue';
import HomeComponent from './components/HomeComponent.vue';
import LoginComponent from './components/LoginComponent.vue';
import QuadroDetalhes from './views/QuadroDetalhes.vue';
import Colecoes from './views/Colecoes.vue';
import editarQuadro from './views/editarQuadro.vue';
import Quadro from './components/Quadro.vue';

let isAuthenticated = false;


const routes = [
    { path: '/cadastro', component: CadastroUsuario },
    { path: '/login', component: LoginComponent },
    { path: '', component: HomeComponent },

    // Rota para exibir os quadros do usuário
    {
        path: '/quadros',
        name: 'quadros',
        component: Quadro, // Componente onde os quadros são listados
        beforeEnter: (to, from, next) => {
            if (!localStorage.getItem('authToken')) {
                next('/login'); 
            } else {
                next();
            }
        },
    },

    // Rota para exibir os detalhes do quadro
    {
        path: '/quadros/:id',
        name: 'quadroDetalhes',
        component: QuadroDetalhes,
        beforeEnter: (to, from, next) => {
            if (!isAuthenticated) next('/login');
            else next();
        },
    },

    // Rota para editar o quadro
    {
        path: '/editarQuadro/:id',
        name: 'editarQuadro',
        component: EditarQuadro,
        props: true,
        beforeEnter: (to, from, next) => {
            if (!isAuthenticated) next('/login');
            else next();
        },
    },

    // Rota para coleções
    {
        path: '/colecoes',
        component: Colecoes,
        beforeEnter: (to, from, next) => {
            if (!isAuthenticated) next('/login');
            else next();
        },
    },

];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export function setAuthentication(status) {
    isAuthenticated = status;
}


export default router;
