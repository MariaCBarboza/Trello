<template>
  <div class="cadastro-container">
    <h1>Cadastro de Usuário</h1>
    <form @submit.prevent="registerUser">
      <label for="nome">Nome:</label>
      <input type="text" v-model="nome" id="nome" required />

      <label for="email">Email:</label>
      <input type="email" v-model="email" id="email" required />

      <label for="senha">Senha:</label>
      <input type="password" v-model="senha" id="senha" required />

      <button type="submit">Registrar</button>
    </form>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p class="login-link">Já tem uma conta? <router-link to="/login">Faça login</router-link></p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CadastroUsuario',
  data() {
    return {
      nome: '',
      email: '',
      senha: '',
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    async registerUser() {
      this.errorMessage = '';
      this.successMessage = '';
      try {
        const response = await axios.post('http://localhost:4331/api/auth/register', {
          nome: this.nome,
          email: this.email,
          senha: this.senha,
        });
        this.successMessage = "Cadastro realizado com sucesso! Redirecionando para o Login..." ;
        this.nome = '';
        this.email = '';
        this.senha = '';
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message || 'Erro no cadastro';
        } else {
          this.errorMessage = 'Erro ao conectar ao servidor';
        }
      }
    },
  },
};
</script>

<style scoped>
.cadastro-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 1.1em;
  color: #444;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

button:active {
  background-color: #003d80;
}

.success {
  color: green;
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
}

.login-link {
  text-align: center;
  margin-top: 15px;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
