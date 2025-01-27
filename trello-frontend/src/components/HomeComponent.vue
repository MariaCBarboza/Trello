<template>
    <div id="home">
      <nav>
        <router-link to="/cadastro">Cadastro</router-link>
        <router-link to="/login">Login</router-link>
      </nav>
      <router-view></router-view>
    </div>
  </template>

<script>
export default {
  name: 'App',
};
</script>
<style scoped>
#home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f9f9f9;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

nav a {
  padding: 30px 50px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;
  font-size: x-large;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: #0056b3;
}
</style>

  