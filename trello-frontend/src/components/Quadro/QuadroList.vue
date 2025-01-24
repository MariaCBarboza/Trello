<template>
    <div>
      <h1>Meus Quadros</h1>
      <button @click="showForm = true">Criar Novo Quadro</button>
  
      <QuadroForm v-if="showForm" @close="showForm = false" @refresh="fetchQuadros" />
      
      <div v-for="quadro in quadros" :key="quadro._id" class="quadro-item">
        <h2>{{ quadro.titulo }}</h2>
        <p style="font-size: 12px;">Criado em: {{ new Date(quadro.createdAt).toLocaleString() }}</p>
        <button @click="editQuadro(quadro)">Editar</button>
        <button @click="deleteQuadro(quadro._id)">Deletar</button>
      </div>
    </div>
  </template>
  
  <script>
  import api from '@/api';
  import QuadroForm from './QuadroForm.vue';
  
  export default {
    components: { QuadroForm },
    data() {
      return {
        quadros: [],
        showForm: false,
      };
    },
    methods: {
      async fetchQuadros() {
        try {
          const { data } = await api.get('/quadro/pegarQuadros');
          this.quadros = data;
        } catch (error) {
          console.error(error);
          alert('Erro ao carregar quadros!');
        }
      },
      editQuadro(quadro) {
        this.$emit('edit', quadro); // Emite evento para abrir o formulário com dados
      },
      async deleteQuadro(id) {
        if (confirm('Tem certeza que deseja deletar?')) {
          try {
            await api.delete('/quadro/deletarQuadro', { data: { id } });
            alert('Quadro deletado com sucesso!');
            this.fetchQuadros();
          } catch (error) {
            console.error(error);
            alert('Erro ao deletar quadro!');
          }
        }
      },
    },
    mounted() {
      this.fetchQuadros();
    },
  };
  </script>
  
  <style>
  .quadro-item {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  </style>
  