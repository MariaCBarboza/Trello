<template>
  <div id="home">
    <nav>
      <router-link to="/cadastro" class="nav-button">Cadastro</router-link>
      <router-link to="/login" class="nav-button">Login</router-link>
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
  background: linear-gradient(135deg, #667eea, #764ba2);
  font-family: 'Arial', sans-serif;
}

nav {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.nav-button {
  padding: 15px 40px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  transition: all 0.3s ease-in-out;
  border: 2px solid white;
}

.nav-button:hover {
  background: white;
  color: #764ba2;
}
</style>
