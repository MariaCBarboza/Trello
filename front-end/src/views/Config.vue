<template>
    <div class="config-container">
      <h1>Configurações</h1>
      <form @submit.prevent="changePassword">
        <label for="currentPassword">Senha Atual:</label>
        <input type="password" v-model="currentPassword" id="currentPassword" required />
        
        <label for="newPassword">Nova Senha:</label>
        <input type="password" v-model="newPassword" id="newPassword" required />
        
        <button type="submit">Alterar Senha</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Config',
    data() {
      return {
        currentPassword: '',
        newPassword: '',
        errorMessage: '',
        successMessage: ''
      };
    },
    methods: {
      async changePassword() {
        this.errorMessage = '';
        this.successMessage = '';
        
        const token = localStorage.getItem('authToken'); // Pega o token do localStorage
        if (!token) {
          this.errorMessage = 'Token de autenticação não encontrado. Faça login novamente.';
          return;
        }

        try {
          await axios.post('http://localhost:4331/api/auth/change-password', {
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
          }, {
            headers: {
              Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
            }
          });
          
          this.successMessage = 'Senha alterada com sucesso! Você será deslogado...';
          setTimeout(() => {
            localStorage.removeItem('authToken');
            this.$router.push('/login');
          }, 2000);
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'Erro ao alterar senha';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .config-container {
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
  