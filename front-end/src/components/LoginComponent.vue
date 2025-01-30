<template>
  <div class="login-container">
    <h1>Login de Usuário</h1>
    <form @submit.prevent="loginUser">
      <label for="email">Email:</label>
      <input type="email" v-model="email" id="email" required />

      <label for="senha">Senha:</label>
      <input type="password" v-model="senha" id="senha" required />

      <button type="submit">Login</button>
    </form>
    <button @click="forgotPassword" class="forgot-password">Esqueceu a Senha?</button>
    <p class="register-link">Não tem uma conta? <router-link to="/cadastro">Cadastre-se</router-link></p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginUsuario',
  data() {
    return {
      email: '',
      senha: '',
      errorMessage: '',
      successMessage: '',
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async loginUser() {
      this.errorMessage = '';
      this.successMessage = '';
      try {
        const response = await axios.post('http://localhost:4331/api/auth/login', {
          email: this.email,
          senha: this.senha,
        });

        localStorage.setItem('authToken', response.data.token);
        this.successMessage = 'Login realizado com sucesso!';
        this.errorMessage = '';

        this.router.push('/home');
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message || 'Erro no login';
        } else {
          this.errorMessage = 'Erro ao conectar ao servidor';
        }
        this.successMessage = '';
      }
    },
    async forgotPassword() {
      this.errorMessage = '';
      this.successMessage = '';
      try {
        const response = await axios.post('http://localhost:4331/api/auth/forgot-password', {
          email: this.email,
        });
        this.successMessage = response.data.message;
        this.errorMessage = '';
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message || 'Erro ao enviar token de recuperação';
        } else {
          this.errorMessage = 'Erro ao conectar ao servidor';
        }
        this.successMessage = '';
      }
    },
  },
};
</script>

<style scoped>
.login-container {
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
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}

button:active {
  background-color: #003d80;
}

.forgot-password {
  background-color: transparent;
  color: #007bff;
  text-decoration: underline;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  font-size: 0.9em;
}

.forgot-password:hover {
  color: #fdfefe;
}

.register-link {
  text-align: center;
  margin-top: 15px;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.success {
  color: green;
  margin-top: 10px;
  text-align: center;
}
</style>
