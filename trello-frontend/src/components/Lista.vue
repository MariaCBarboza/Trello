<template>
    <div class="lista">
      <h3>{{ lista.titulo }}</h3>
      <button @click="remover">Remover</button>
      <button @click="adicionarCard">Adicionar Card</button>
      <div class="cards">
        <Card
          v-for="card in lista.cards"
          :key="card._id"
          :card="card"
          @remover="removerCard"
        />
      </div>
    </div>
  </template>
  
  <script>
  import Card from './Card.vue';
  
  export default {
    props: ['lista'],
    components: { Card },
    methods: {
      async adicionarCard() {
        const texto = prompt('Digite o conteúdo do card');
        if (texto) {
          await axios.post(`/api/listas/${this.lista._id}/adicionarCard`, { texto });
          this.$emit('atualizar');
        }
      },
      async remover() {
        this.$emit('remover', this.lista._id);
      },
    },
  };
  </script>
  