import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'formulario-compartilhar-board',
  props: {
    controlador: Object,
    board: Object,       
  },

  data() {
    return {
      titulo: '',
      errorMessage: '',
      boardShare: {
        _id: '',
        board: '',
        user: '',
        email: "",
        canEdit: false,
      },
      options: [
        { title: 'Editar', value: true },
        { title: 'Apenas Visualizar', value: false },
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
              id="email"
                v-model="boardShare.email"
                label="Email para compartilhar"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">

             <v-select
                v-model="boardShare.canEdit"

                :items = "options"
                item-value="value"
                item-text="title"
                label="Permissão do usuário"
                required
              ></v-select>
            </v-col>


            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="$emit('close')">Cancelar</v-btn>
        <v-btn color="green darken-1" text @click="compartilhaBoard">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  `,

  methods: {
    prepara() {
      this.errorMessage = '';
      this.boardShare = { ...this.controlador.itemSelecionado };
    },


    async compartilhaBoard(){
      if (!this.boardShare.email ) {
        this.errorMessage = 'Email é obrigatório.';
        return;
      }
      let url = `http://localhost:4331/api/users/findByEmail/` + this.boardShare.email;

      let method = 'get';
      const token = localStorage.getItem('authToken');
      
      try{
  
        const response = await axios({
          method,
          url,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        this.errorMessage = '';
        this.boardShare.user = response.data._id;
      } 
      catch (error) {
        this.errorMessage =
          error.response?.data?.error || 'Erro ao compartilhar quadro';
          return;
      }
      
      try{
      

      url = `http://localhost:4331/api/boardsPermissions/${this.board._id}`

      method = 'post'
      const payload = {
        board: this.board._id,
        user: this.boardShare.user,
        canEdit: this.boardShare.canEdit
      };
      const response = await axios({
        method,
        url,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("admaofmaomfoa")
      this.errorMessage = '';

    } catch (error) {
      this.errorMessage =
        error.response?.data?.error || 'Erro ao compartilhar quadro';
    }
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
    
  },
});
