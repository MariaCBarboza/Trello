<template>
  <div class="list">
    <h3 @dblclick="editMode = true">
      <!-- Exibe o título da lista ou o input de edição -->
      <span v-if="!editMode">{{ list.title }}</span>
      <input
        v-else
        v-model="tempTitle"
        @keyup.enter="saveTitle"
        @blur="saveTitle"
      />
    </h3>

    <!-- Exibir os cards da lista -->
    <div class="cards-container">
      <div v-for="card in list.cards" :key="card._id" class="card">
        <p>{{ card.nome }}</p>
        <div class="button-group">
        <button class="action-btn delete" @click="deleteCard(card._id)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="icon">
        <path d="M3 6h18M9 6v12M15 6v12M19 6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14z" />
        </svg>
        Deletar
        </button>
      <button class="action-btn move" @click="moveCard(card._id)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="icon">
        <path d="M12 19l-7-7 7-7M5 12h14" />
        </svg>
        Mover
      </button>
    </div>

      </div>
    </div>

    <!-- Botão para remover a lista -->
    <button @click="removeList">Remover Lista</button>
  </div>
</template>

<script>
import api from '@/services/api'; // Importando a instância configurada do Axios

export default {
  name: 'List',
  props: {
    list: {
      type: Object,
      required: true,
    },
    boardId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      editMode: false,
      tempTitle: this.list.title,
    };
  },
  methods: {
    /**
     * Salva o título da lista no banco de dados via API
     */
    async saveTitle() {
      this.editMode = false;
      const newTitle = this.tempTitle.trim();

      // Se o título mudou, faz a chamada à API
      if (newTitle !== '' && newTitle !== this.list.title) {
        try {
          const response = await api.put(`/api/lists/${this.list._id}`, {
            title: newTitle,
          });
          // Atualiza o título localmente
          this.list.title = response.data.title;
        } catch (error) {
          console.error('Erro ao atualizar título da lista:', error);
        }
      }
    },

    /**
     * Remove a lista via API e avisa o componente pai para retirá-la do array
     */
    async removeList() {
      try {
        const listId = this.list._id;
        const listTitle = this.list.title;

        await api.delete(`/api/lists/${listId}`, {
          data: { boardId: this.boardId, title: listTitle },
        });

        // Emitimos um evento para que o pai possa remover a lista do array `lists`
        this.$emit('listRemoved', listId);
      } catch (error) {
        console.error('Erro ao remover lista:', error);
      }
    },

    /**
     * Remove um card via API e atualiza a lista localmente
     */
    async deleteCard(cardId) {
      try {
        await api.delete(`/api/cards/${cardId}`);
        this.list.cards = this.list.cards.filter(card => card._id !== cardId);
      } catch (error) {
        console.error('Erro ao remover card:', error);
      }
    },
    async moveCard(cardId) {
      const newColumnTitle = prompt("Digite o título da nova coluna:");
      if (!newColumnTitle) return;

      try {
        // Buscar a coluna pelo título
        const response = await api.get(`/api/lists/board/${this.boardId}`);
        const newColumn = response.data.find(list => list.title === newColumnTitle);

        if (!newColumn) {
          alert("Coluna não encontrada.");
          return;
        }

        const newColumnId = newColumn._id;

        // Mover o card para a nova coluna
        await api.put(`/api/cards/move/${cardId}`, { newColumnId });

        // Atualize a lista localmente removendo o card
        this.list.cards = this.list.cards.filter(card => card._id !== cardId);
      } catch (error) {
        console.error('Erro ao mover card:', error);
      }
    },

  },
};
</script>

<style scoped>
.list {
  background-color: #f4f5f7;
  border-radius: 3px;
  width: 272px;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.list h3 {
  margin: 0 0 8px;
  cursor: pointer;
}

.list input {
  width: 90%;
}

.cards-container {
  display: flex;
  flex-direction: column;
}

.card {
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9,30,66,.25);
  margin-bottom: 8px;
  padding: 8px;
  cursor: pointer;
}

.card:hover {
  background-color: #f0f0f0;
}
.button-group {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #f4f5f7;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.action-btn .icon {
  width: 16px;
  height: 16px;
}

.action-btn:hover {
  background-color: #e2e6ea;
  transform: translateY(-2px);
}

.action-btn.delete {
  color: #e63946;
  border-color: #e63946;
}

.action-btn.delete:hover {
  background-color: #fddcdc;
}

.action-btn.move {
  color: #007bff;
  border-color: #007bff;
}

.action-btn.move:hover {
  background-color: #cce5ff;
}

</style>