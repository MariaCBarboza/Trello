<template>
    <div>
      <h1>{{ quadro?.titulo }}</h1>
      <button @click="adicionarLista">Adicionar Lista</button>
      <div class="listas">
        <Lista
          v-for="lista in quadro?.listas"
          :key="lista._id"
          :lista="lista"
          @remover="removerLista"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex';
  import Lista from '@/components/Lista.vue';
  
  export default {
    components: { Lista },
    computed: mapState(['quadroAtual']),
    methods: {
      ...mapActions(['fetchQuadroDetalhes']),
      async adicionarLista() {
        const titulo = prompt('Digite o título da lista');
        if (titulo) {
          await axios.post(`/api/quadros/${this.quadroAtual._id}/adicionarLista`, { titulo });
          this.fetchQuadroDetalhes(this.quadroAtual._id);
        }
      },
      async removerLista(listaId) {
        await axios.delete(`/api/quadros/${this.quadroAtual._id}/removerLista/${listaId}`);
        this.fetchQuadroDetalhes(this.quadroAtual._id);
      },
    },
    created() {
      const quadroId = this.$route.params.id;
      this.fetchQuadroDetalhes(quadroId);
    },
  };
  </script>
  