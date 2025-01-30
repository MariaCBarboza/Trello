<template>
  <v-app-bar>
    <v-toolbar-title>Trelle</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-for="(page, index) in pages" :key="index" :to="page.path" @click="setActivePage(index)">
      {{ page.name }}
    </v-btn>
    <v-btn @click="logout">Logout</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      pages: [
        { name: 'Home', path: '/home' },
        { name: 'Boards', path: '/boards' },
        { name: 'Colecao', path: '/colecao'},
        { name: 'Config', path: '/config' }
      
      ],
      activePage: 0,
    };
  },
  methods: {
    setActivePage(index) {
      this.activePage = index;
    },
    logout() {
      localStorage.removeItem('authToken'); // Remova o token armazenado
      this.$router.push('/'); // Redirecione para a página de login
    },
  },
};
</script>

<style scoped>
.btn-hover {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-hover:hover {
  background-color: #1976d2; /* Cor do botão ao passar o mouse */
  color: white;
}

.v-btn {
  margin-right: 20px; /* Espaçamento entre os botões */
}

.v-app-bar {
  background-color: black; /* Cor de fundo preta */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Sombras sutis */
  border-bottom: 2px solid rgba(0, 0, 0, 0.1); /* Borda inferior */
}

.v-toolbar-title {
  font-size: 24px;
  font-weight: bold;
}

.v-btn {
  text-transform: none;
}
</style>
