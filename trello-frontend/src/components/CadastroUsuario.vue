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
    };
    },
    methods: {
  async registerUser() {
    this.errorMessage = '';
    this.successMessage = '';
    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        nome: this.nome,
        email: this.email,
        senha: this.senha,
      });
      this.successMessage = response.data.message;
      this.nome = '';
      this.email = '';
      this.senha = ''; // Limpa o formulário após o sucesso
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
  color: #333; /* Cor do texto */
}

.form-group {
  margin-bottom: 15px;
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
  margin-top: auto;
  margin-bottom: auto;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Efeito de foco */
  outline: none; /* Remove o contorno padrão */
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
  background-color: #003d80; /* Cor ao clicar */
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
  