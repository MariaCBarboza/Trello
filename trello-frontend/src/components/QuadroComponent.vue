<template>
  <div>
    <h2>Quadros</h2>
    <div>
      <!-- Formulário para criar um quadro -->
      <h3>Criar Quadro</h3>
      <form @submit.prevent="criarQuadro">
        <input type="text" v-model="titulo" placeholder="Título" required />
        <input type="color" v-model="backgroundColor" placeholder="Cor de fundo" />
        <input type="color" v-model="textColor" placeholder="Cor do texto" />
        <button type="submit">Criar Quadro</button>
      </form>
    </div>

    <!-- Lista de quadros -->
    <div>
      <h3>Quadros Criados</h3>
      <ul>
        <li v-for="quadro in quadros" :key="quadro._id">
          <span :style="{ backgroundColor: quadro.backgroundColor, color: quadro.textColor }">
            {{ quadro.titulo }}
          </span>
          <button @click="editarQuadro(quadro)">Editar</button>
          <button @click="deletarQuadro(quadro._id)">Deletar</button>
        </li>
      </ul>
    </div>

    <!-- Formulário para editar um quadro -->
    <div v-if="quadroEmEdicao">
      <h3>Editar Quadro</h3>
      <form @submit.prevent="atualizarQuadro">
        <input type="text" v-model="quadroEmEdicao.titulo" placeholder="Novo Título" required />
        <input type="color" v-model="quadroEmEdicao.backgroundColor" />
        <input type="color" v-model="quadroEmEdicao.textColor" />
        <button type="submit">Atualizar Quadro</button>
        <button @click="cancelarEdicao">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script>
import apiClient from "@/config/axiosConfig";

export default {
  data() {
    return {
      titulo: "",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      quadros: [],
      quadroEmEdicao: null,
    };
  },
  methods: {
    // Função para obter o token de autorização
    getAuthToken() {
      const token = localStorage.getItem('token');
      console.log('Token recuperado do localStorage:', token);
      return token;
    },
    // Função para criar um quadro
    async criarQuadro() {
      const token = this.getAuthToken();
      if (!token) {
        console.error("Token de autorização não encontrado");
        return;
      }

      try {
        const response = await apiClient.post(
          "/criarQuadro",
          {
            titulo: this.titulo,
            backgroundColor: this.backgroundColor,
            textColor: this.textColor,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
            },
          }
        );

        console.log("Quadro criado com sucesso:", response.data);
        this.quadros.push(response.data); // Adiciona o novo quadro à lista local
        this.titulo = "";
        this.backgroundColor = "#ffffff";
        this.textColor = "#000000"; // Reseta o formulário
      } catch (error) {
        console.error("Erro ao criar quadro:", error);
        alert("Erro ao criar quadro");
      }
    },

    // Função para buscar os quadros existentes
    async fetchQuadros() {
      const token = this.getAuthToken();
      if (!token) {
        console.error("Token de autorização não encontrado");
        return;
      }

      try {
        const response = await apiClient.get("/pegarQuadros", {
          headers: {
            Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
          },
        });
        this.quadros = response.data;
      } catch (error) {
        console.error("Erro ao carregar quadros:", error);
        alert("Erro ao carregar os quadros");
      }
    },

    // Função para editar um quadro
    editarQuadro(quadro) {
      this.quadroEmEdicao = { ...quadro }; // Cria uma cópia para edição
    },

    // Função para atualizar um quadro
    async atualizarQuadro() {
      const token = this.getAuthToken();
      if (!token) {
        console.error("Token de autorização não encontrado");
        return;
      }

      try {
        const response = await apiClient.put(
          "/atualizarQuadro",
          {
            id: this.quadroEmEdicao._id,
            titulo: this.quadroEmEdicao.titulo,
            backgroundColor: this.quadroEmEdicao.backgroundColor,
            textColor: this.quadroEmEdicao.textColor,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
            },
          }
        );

        const index = this.quadros.findIndex(
          (q) => q._id === this.quadroEmEdicao._id
        );
        this.quadros[index] = response.data; // Atualiza o quadro na lista local
        this.quadroEmEdicao = null; // Sai do modo de edição
      } catch (error) {
        console.error("Erro ao atualizar quadro:", error);
        alert("Erro ao atualizar quadro");
      }
    },

    // Função para deletar um quadro
    async deletarQuadro(id) {
      const token = this.getAuthToken();
      if (!token) {
        console.error('Token de autorização não encontrado');
        return;
      }

      try {
        // Envia o ID como parte da URL
        await apiClient.delete(`http://localhost:5000/api/deletarQuadro/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
          },
        });

        // Atualiza a lista de quadros no frontend
        this.quadros = this.quadros.filter(quadro => quadro._id !== id);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error('Quadro não encontrado para deletar');
        } else if (error.response && error.response.status === 401) {
          console.error('Erro de autorização: Token inválido ou não encontrado');
        } else {
          console.error('Erro ao deletar quadro', error);
        }
      }
    },
  },
  mounted() {
    this.fetchQuadros(); // Carrega os quadros ao iniciar
  },
};


</script>

<style scoped>
/* Estilos simples */
form {
  margin-bottom: 20px;
}
button {
  margin: 5px;
}
</style>
