<template>
  <div class="quadro">
    <h1>{{ quadro.titulo }}</h1>
    <div class="actions">
      <button @click="editarQuadro">Editar Quadro</button>
      <button @click="marcarFavorito">{{ quadro.isFavorite ? 'Remover Favorito' : 'Marcar como Favorito' }}</button>
      <button @click="deletarQuadro">Deletar Quadro</button>
    </div>

    <div v-for="(lista, index) in quadro.listas" :key="lista._id" class="lista">
      <h3>{{ lista.titulo }}</h3>
      <button @click="removerLista(lista._id)">Remover Lista</button>

      <div class="cartoes">
        <div v-for="card in lista.cartoes" :key="card._id" class="card">
          <p>{{ card.texto }}</p>
          <button @click="moverCard(card, lista, index)">Mover para outra lista</button>
          <button @click="removerCard(card._id)">Remover Cartão</button>
        </div>
      </div>
      <button @click="adicionarCard(lista._id)">Adicionar Cartão</button>
    </div>

    <div class="adicionar-lista">
      <input v-model="novaListaTitulo" placeholder="Novo título da lista" />
      <button @click="adicionarLista">Adicionar Lista</button>
    </div>
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
        isFavorite: false,
        listas: [],
      },
      novaListaTitulo: '',
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
   
    async marcarFavorito() {
      try {
        const response = await axios.put(`/api/quadros/${this.quadro._id}/favorito`);
        this.quadro.isFavorite = response.data.isFavorite;
      } catch (error) {
        console.error('Erro ao marcar quadro como favorito:', error);
      }
    },
    async deletarQuadro() {
      try {
        await axios.delete(`/api/quadros/${this.quadro._id}`);
        this.$router.push('/quadros'); // Redireciona para a lista de quadros
      } catch (error) {
        console.error('Erro ao deletar quadro:', error);
      }
    },
    async adicionarLista() {
      if (this.novaListaTitulo) {
        try {
          const response = await axios.post(`/api/quadros/${this.quadro._id}/listas`, {
            titulo: this.novaListaTitulo,
          });
          this.quadro.listas.push(response.data);
          this.novaListaTitulo = '';
        } catch (error) {
          console.error('Erro ao adicionar lista:', error);
        }
      }
    },
    async removerLista(listaId) {
      try {
        await axios.delete(`/api/quadros/${this.quadro._id}/listas/${listaId}`);
        this.quadro.listas = this.quadro.listas.filter((lista) => lista._id !== listaId);
      } catch (error) {
        console.error('Erro ao remover lista:', error);
      }
    },
    async adicionarCard(listaId) {
      const textoCard = prompt('Digite o texto do cartão:');
      if (textoCard) {
        try {
          const response = await axios.post(`/api/cards`, {
            texto: textoCard,
            listaId: listaId,
          });
          // Atualiza a lista com o novo cartão
          const lista = this.quadro.listas.find((lista) => lista._id === listaId);
          lista.cartoes.push(response.data);
        } catch (error) {
          console.error('Erro ao adicionar cartão:', error);
        }
      }
    },
    async removerCard(cardId) {
      try {
        await axios.delete(`/api/cards/${cardId}`);
        // Atualiza as listas removendo o cartão deletado
        this.quadro.listas.forEach((lista) => {
          lista.cartoes = lista.cartoes.filter((card) => card._id !== cardId);
        });
      } catch (error) {
        console.error('Erro ao remover cartão:', error);
      }
    },
    async moverCard(card, lista, index) {
      const novaListaId = prompt('Digite o ID da nova lista para mover este cartão:');
      if (novaListaId && novaListaId !== lista._id) {
        try {
          await axios.put(`/api/quadros/${this.quadro._id}/listas/${lista._id}/moverCard`, {
            cardId: card._id,
            novaListaId: novaListaId,
          });

          // Atualiza localmente os cartões e listas após a movimentação
          lista.cartoes = lista.cartoes.filter((c) => c._id !== card._id);
          const novaLista = this.quadro.listas.find((l) => l._id === novaListaId);
          novaLista.cartoes.push(card);
        } catch (error) {
          console.error('Erro ao mover cartão:', error);
        }
      }
    },
  },
  onMounted() {
    this.fetchQuadro();
  },
};
</script>

<style scoped>
.quadro {
  padding: 20px;
}

.actions button {
  margin: 5px;
}

.lista {
  margin-top: 20px;
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 8px;
}

.cartoes {
  margin-top: 10px;
}

.card {
  background-color: #e2e2e2;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
}

.adicionar-lista {
  margin-top: 20px;
}

button {
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #0056b3;
}
</style>
