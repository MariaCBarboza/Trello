<template>
    <div class="app-container">
      <h1 class="text-xl font-bold mb-4"> Trello </h1>
  
      <!-- Criar novo quadro -->
      <div class="new-board-form mb-6">
        <input
          v-model="novoQuadro.titulo"
          type="text"
          placeholder="Título do Quadro"
          class="input"
        />
        <button @click="criarQuadro" class="btn">Criar Quadro</button>
      </div>
  
      <!-- Listagem de quadros -->
      <div class="boards-grid">
        <div
          v-for="quadro in quadros"
          :key="quadro._id"
          class="board"
          :style="{ backgroundColor: quadro.backgroundColor || '#f3f4f6' }"
        >
          <h2 class="board-title">{{ quadro.titulo }}</h2>
          <draggable
            v-model="quadro.listas"
            @end="reordenarListas(quadro._id, quadro.listas)"
          >
            <div
              v-for="lista in quadro.listas"
              :key="lista._id"
              class="lista"
              :style="{ backgroundColor: lista.backgroundColor || '#e5e7eb' }"
            >
              <p>{{ lista.titulo }}</p>
              <button @click="deletarLista(quadro._id, lista._id)">Excluir</button>
            </div>
          </draggable>
          <input
            v-model="novaLista"
            placeholder="Adicionar nova lista"
            class="input"
          />
          <button @click="adicionarLista(quadro._id)">Adicionar Lista</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import draggable from "vuedraggable";
  
  export default {
    components: { draggable },
    data() {
      return {
        quadros: [], // Quadros carregados do backend
        novoQuadro: { titulo: "", backgroundColor: "#ffffff", textColor: "#000000" },
        novaLista: "", // Nome da nova lista a ser adicionada
      };
    },
    methods: {
      // Buscar todos os quadros
      async carregarQuadros() {
        try {
          const res = await axios.get("/api/pegarQuadros");
          this.quadros = res.data;
        } catch (error) {
          console.error("Erro ao carregar quadros:", error);
        }
      },
  
      // Criar um novo quadro
      async criarQuadro() {
        if (!this.novoQuadro.titulo) return alert("Título é obrigatório!");
        try {
          const res = await axios.post("/api/criarQuadro", this.novoQuadro);
          this.quadros.push(res.data);
          this.novoQuadro.titulo = "";
        } catch (error) {
          console.error("Erro ao criar quadro:", error);
        }
      },
  
      // Adicionar uma nova lista ao quadro
      async adicionarLista(quadroId) {
        if (!this.novaLista) return alert("Título da lista é obrigatório!");
        try {
          const res = await axios.put(`/api/quadros/adicionarLista`, {
            quadroId,
            titulo: this.novaLista,
          });
          const quadroAtualizado = this.quadros.find((q) => q._id === quadroId);
          quadroAtualizado.listas = res.data.listas;
          this.novaLista = "";
        } catch (error) {
          console.error("Erro ao adicionar lista:", error);
        }
      },
  
      // Deletar lista do quadro
      async deletarLista(quadroId, listaId) {
        try {
          const res = await axios.put(`/api/quadros/deletarLista`, {
            quadroId,
            listaId,
          });
          const quadroAtualizado = this.quadros.find((q) => q._id === quadroId);
          quadroAtualizado.listas = res.data.listas;
        } catch (error) {
          console.error("Erro ao deletar lista:", error);
        }
      },
  
      // Reordenar as listas do quadro
      async reordenarListas(quadroId, novaOrdemListas) {
        try {
          await axios.put(`/api/quadros/reordenarListas`, {
            quadroId,
            novaOrdemListas: novaOrdemListas.map((l) => l._id),
          });
        } catch (error) {
          console.error("Erro ao reordenar listas:", error);
        }
      },
    },
    mounted() {
      this.carregarQuadros();
    },
  };
  </script>
  
  <style scoped>
  .app-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  .boards-grid {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }
  .board {
    background: #f3f4f6;
    padding: 10px;
    border-radius: 8px;
    width: 300px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
  .board-title {
    font-size: 1.25rem;
    margin-bottom: 10px;
  }
  .lista {
    background: #e5e7eb;
    padding: 8px;
    margin: 5px 0;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .input {
    margin-top: 10px;
    padding: 8px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .btn {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  