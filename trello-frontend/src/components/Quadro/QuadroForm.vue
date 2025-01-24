<template>
    <div class="form-container">
      <h2>{{ quadro.id ? 'Editar Quadro' : 'Criar Quadro' }}</h2>
      <form @submit.prevent="saveQuadro">
        <label for="titulo">Título:</label>
        <input v-model="quadro.titulo" id="titulo" type="text" required />
  
        <label for="backgroundColor">Cor de fundo:</label>
        <input v-model="quadro.backgroundColor" id="backgroundColor" type="color" />
  
        <label for="textColor">Cor do texto:</label>
        <input v-model="quadro.textColor" id="textColor" type="color" />
  
        <button type="submit">{{ quadro.id ? 'Atualizar' : 'Criar' }}</button>
        <button @click="closeForm">Cancelar</button>
      </form>
    </div>
  </template>
  
  <script>
  import api from '@/api';
  
  export default {
    props: {
      quadro: {
        type: Object,
        default: () => ({}),
      },
    },
    methods: {
      async saveQuadro() {
        try {
          if (this.quadro.id) {
            // Atualizar quadro existente
            await api.put('/quadro/atualizarQuadro', this.quadro);
            alert('Quadro atualizado com sucesso!');
          } else {
            // Criar novo quadro
            await api.post('/quadro/criarQuadro', this.quadro);
            alert('Quadro criado com sucesso!');
          }
          this.$emit('refresh');
          this.closeForm();
        } catch (error) {
          console.error(error);
          alert('Erro ao salvar quadro!');
        }
      },
      closeForm() {
        this.$emit('close');
      },
    },
  };
  </script>
  
  <style>
  .form-container {
    border: 1px solid #ccc;
    padding: 15px;
    margin: 10px 0;
  }
  </style>
  