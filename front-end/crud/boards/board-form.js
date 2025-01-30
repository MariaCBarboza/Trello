import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'formulario-board',
  props: ['controlador'],

  data() {
    return {
      titulo: '',
      errorMessage: '',
      board: {
        _id: '',
        title: '',
        backgroundColor: '',
        textColor: '',
        isFavorite: false,
        lists: [],
      },
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
        <span class="headline">{{ titulo }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
            </v-col>

            <!-- Campo para o título -->
            <v-col cols="12">
              <v-text-field
                v-model="board.title"
                label="Título"
                required
              ></v-text-field>
            </v-col>

            <!-- Seleção de cores de fundo -->
            <v-col cols="12" sm="6">
                <v-select
                    v-model="board.backgroundColor"
                    :items="colorOptions"
                    item-text="label"
                    item-value="value"
                    label="Cor de Fundo"
                    required
                >
                </v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                    v-model="board.textColor"
                    :items="textColorOptions"
                    item-text="label"
                    item-value="value"
                    label="Cor do Texto"
                    required
                ></v-select>
              </v-col>


            <!-- Checkbox para Favorito -->
            <v-col cols="12">
              <v-checkbox v-model="board.isFavorite" label="Favorito" :style="{backgroundColor: board.isFavorite ? 'yellow' : 'transparent', color: 'black'}"
>
              </v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="$emit('close')">Cancelar</v-btn>
        <v-btn color="green darken-1" text @click="salvaBoard">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  `,

  methods: {
    prepara() {
      this.errorMessage = '';
      this.board = { ...this.controlador.itemSelecionado };
      this.titulo = this.board._id === '' ? 'Novo Quadro' : 'Editar Quadro';
      console.log(this.$data);
      console.log(this.board)
    },

    async salvaBoard() {
      if (!this.board.title) {
        this.errorMessage = 'O título é obrigatório.';
        return;
      }

      const url = this.board._id
        ? `http://localhost:4331/api/boards/${this.board._id}`
        : 'http://localhost:4331/api/boards';
      const method = this.board._id ? 'put' : 'post';
      const token = localStorage.getItem('authToken');

      try {
        const payload = {
          title: this.board.title,
          backgroundColor: this.board.backgroundColor || '#ffffff',
          textColor: this.board.textColor || '#000000',
          isFavorite: this.board.isFavorite,
        };

        const response = await axios({
          method,
          url,
          data: payload,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.errorMessage = '';
        this.$emit('boardCreated', response.data._id);
      } catch (error) {
        this.errorMessage =
          error.response?.data?.error || 'Erro ao salvar o quadro.';
      }
    },

    getContrastColor(color) {
      // Função simples para verificar contraste baseado no brilho da cor
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 125 ? '#000000' : '#ffffff';
    },
  },
});
