import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'BoardEditForm',
  props: {
    controlador: Object, // Controlador opcional para gerenciar o estado
    board: Object,       // Dados do board a serem editados
  },
  data() {
    return {
      boardData: { ...this.board }, // Cópia dos dados do board
      errorMessage: '',
      colorOptions: [
        { title: 'Azul Claro', value: '#90caf9' },
        { title: 'Azul Escuro', value: '#1565c0' },
        { title: 'Verde Claro', value: '#a5d6a7' },
        { title: 'Verde Escuro', value: '#2e7d32' },
        { title: 'Amarelo', value: '#fff59d' },
        { title: 'Laranja', value: '#ffab91' },
        { title: 'Cinza Claro', value: '#e0e0e0' },
        { title: 'Cinza Escuro', value: '#424242' },
      ],
      textColorOptions: [
        { title: 'Preto', value: '#000000' },
        { title: 'Branco', value: '#ffffff' },
        { title: 'Cinza Escuro', value: '#424242' },
      ],
    };
  },
  template: `
    <v-card>
      <v-card-title>
        <span class="headline">Editar Board</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>

              <v-text-field
                v-model="boardData.title"
                label="Título"
                required
              ></v-text-field>
              <v-select
                v-model="boardData.backgroundColor"
                label="Cor de Fundo"
                :items = "colorOptions"
                item-value="value"
                item-text="title"
              ></v-select>
              <v-select
                v-model="boardData.textColor"
                :items = "textColorOptions"
                item-value="value"
                item-text="title"
                label="Cor do Texto"
              ></v-select>
              <v-checkbox
                v-model="boardData.isFavorite"
                label="Favorito"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="$emit('close')">Cancelar</v-btn>
        <v-btn color="primary" @click="saveBoard">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  `,
  methods: {
    async saveBoard() {
      const token = localStorage.getItem('authToken');
      const url = `http://localhost:4331/api/boards/${this.boardData._id}`;
      try {
        // Requisição para atualizar o board
        const response = await axios.put(url, this.boardData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.errorMessage = '';
        this.$emit('boardUpdated', response.data); // Emite o evento com os dados do board atualizado
      } catch (error) {
        this.errorMessage =
          error.response?.data?.error || 'Erro ao salvar o quadro.';
      }
    },
  },
  watch: {
    // Atualiza os dados do formulário quando a prop `board` mudar
    board: {
      immediate: true,
      handler(newBoard) {
        this.boardData = { ...newBoard };
      },
    },
  },
});
