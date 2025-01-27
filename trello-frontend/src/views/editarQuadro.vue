<template>
    <div class="editar-quadro">
      <h1>Editar Quadro</h1>
      <form @submit.prevent="salvarAlteracoes">
        <div class="form-group">
          <label for="titulo">Título:</label>
          <input v-model="quadro.titulo" type="text" id="titulo" required />
        </div>
  
        <div class="form-group">
          <label for="backgroundColor">Cor de fundo:</label>
          <input v-model="quadro.backgroundColor" type="color" id="backgroundColor" />
        </div>
  
        <div class="form-group">
          <label for="textColor">Cor do texto:</label>
          <input v-model="quadro.textColor" type="color" id="textColor" />
        </div>
  
        <button class="btn" type="submit">Salvar</button>
      </form>
  
      <hr />
  
      <h2>Compartilhar Quadro</h2>
      <form @submit.prevent="compartilharQuadro">
        <div class="form-group">
          <label for="email">Email do usuário:</label>
          <input v-model="email" type="email" id="email" required />
        </div>
  
        <div class="form-group">
          <label for="permissao">Permissão:</label>
          <select v-model="permissao" id="permissao">
            <option value="visualizar">Visualizar</option>
            <option value="editar">Editar</option>
          </select>
        </div>
  
        <button class="btn" type="submit">Compartilhar</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  
  export default {
    data() {
      return {
        quadro: {
          titulo: '',
          backgroundColor: '#ffffff',
          textColor: '#000000',
        },
        email: '',
        permissao: 'visualizar',
      };
    },
    methods: {
      async fetchQuadro() {
        try {
          const response = await axios.get(`/api/quadros/${this.$route.params.id}`);
          this.quadro = response.data;
        } catch (error) {
          console.error('Erro ao carregar quadro:', error);
        }
      },
      async salvarAlteracoes() {
        try {
          await axios.put(`/api/quadros/${this.quadro._id}`, {
            titulo: this.quadro.titulo,
            backgroundColor: this.quadro.backgroundColor,
            textColor: this.quadro.textColor,
          });
          alert('Quadro atualizado com sucesso');
        } catch (error) {
          console.error('Erro ao salvar alterações:', error);
        }
      },
      async compartilharQuadro() {
        try {
          await axios.put(`/api/quadros/${this.quadro._id}/compartilhar`, {
            email: this.email,
            permissao: this.permissao,
          });
          alert('Quadro compartilhado com sucesso');
        } catch (error) {
          console.error('Erro ao compartilhar quadro:', error);
        }
      },
    },
    mounted() {
      this.fetchQuadro();
    },
  };
  </script>
  
  <style scoped>
  .editar-quadro {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    background-color: #f9f9f9;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: 0 auto;
  }
  
  h1,
  h2 {
    color: #333;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
    width: 100%;
  }
  
  label {
    font-size: 1.2em;
    color: #555;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="color"],
  select {
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
  }
  
  input[type="text"]:focus,
  input[type="email"]:focus,
  input[type="color"]:focus,
  select:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  
  button.btn {
    background-color: #007bff;
    color: white;
    padding: 12px 20px;
    font-size: 1.1em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button.btn:hover {
    background-color: #0056b3;
  }
  
  hr {
    width: 100%;
    border: 0;
    border-top: 1px solid #ddd;
    margin: 20px 0;
  }
  </style>
  