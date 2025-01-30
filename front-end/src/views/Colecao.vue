<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="display-1">Minhas Coleções</h1>
          <v-btn color="primary" dark large class="mb-5" @click="showCreateDialog = true">
            Criar nova coleção
          </v-btn>
        </v-col>
      </v-row>
  
      <!-- Exibição das coleções existentes -->
      <v-row>
        <v-col v-for="collection in collections" :key="collection._id" cols="12" sm="6" md="4" class="mb-4">
          <v-card class="ma-3 elevation-5">
            <v-card-title class="headline">{{ collection.name }}</v-card-title>
            <v-card-text>
              <ul>
                <li v-for="board in collection.boards" :key="board._id">
                  {{ board.title }}
                  <v-btn small class="mt-2 details-btn" @click="viewBoardDetails(board._id)">Ver Detalhes</v-btn>
                </li>
              </ul>
            </v-card-text>
            <v-card-actions>
              <v-btn color="blue" @click="openEditDialog(collection)">Editar</v-btn>
              <v-btn color="red" @click="deleteCollection(collection._id)">Remover</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Diálogo para criar nova coleção -->
      <v-dialog v-model="showCreateDialog" max-width="500px">
        <v-card>
          <v-card-title>Criar Coleção</v-card-title>
          <v-card-text>
            <v-text-field label="Nome da coleção" v-model="newCollectionName"></v-text-field>
            <v-select multiple label="Selecionar Quadros" :items="userBoards" item-title="title" item-value="_id" v-model="selectedBoards"></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="green" @click="createCollection">Criar</v-btn>
            <v-btn color="grey" @click="showCreateDialog = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Diálogo para editar uma coleção -->
      <v-dialog v-model="showEditDialog" max-width="500px">
        <v-card>
          <v-card-title>Editar Coleção</v-card-title>
          <v-card-text>
            <v-text-field label="Nome da coleção" v-model="editCollectionName"></v-text-field>
            <v-select multiple label="Selecionar Quadros" :items="userBoards" item-title="title" item-value="_id" v-model="editSelectedBoards"></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue" @click="updateCollection">Salvar</v-btn>
            <v-btn color="grey" @click="showEditDialog = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import api from '@/services/api';
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const router = useRouter();
      const collections = ref([]);
      const userBoards = ref([]);
      const showCreateDialog = ref(false);
      const showEditDialog = ref(false);
      const newCollectionName = ref('');
      const selectedBoards = ref([]);
      const editCollectionId = ref(null);
      const editCollectionName = ref('');
      const editSelectedBoards = ref([]);
  
      const loadCollections = async () => {
        const response = await api.get('/api/collections');
        collections.value = response.data;
      };
  
      const loadBoards = async () => {
        const response = await api.get('/api/boards');
        userBoards.value = response.data;
      };
  
      const openEditDialog = (collection) => {
        editCollectionId.value = collection._id;
        editCollectionName.value = collection.name;
        editSelectedBoards.value = collection.boards.map(board => board._id);
        showEditDialog.value = true;
      };
  
      const updateCollection = async () => {
        try {
          await api.put(`/api/collections/${editCollectionId.value}`, {
            name: editCollectionName.value,
            boards: editSelectedBoards.value,
          });
          showEditDialog.value = false;
          loadCollections();
        } catch (error) {
          console.error('Erro ao atualizar a coleção:', error);
        }
      };
  
      const deleteCollection = async (collectionId) => {
        try {
          await api.delete(`/api/collections/${collectionId}`);
          collections.value = collections.value.filter(collection => collection._id !== collectionId);
          loadBoards();
        } catch (error) {
          console.error('Erro ao remover coleção:', error);
        }
      };
  
      const createCollection = async () => {
        try {
          const response = await api.post('/api/collections', {
            name: newCollectionName.value,
            boards: selectedBoards.value,
          });
          collections.value.push(response.data);
          showCreateDialog.value = false;
          loadCollections();
        } catch (error) {
          console.error('Erro ao criar coleção:', error);
        }
      };
  
      const viewBoardDetails = (boardId) => {
        router.push(`/board/${boardId}`);
      };
  
      onMounted(() => {
        loadCollections();
        loadBoards();
      });
  
      return {
        collections,
        userBoards,
        showCreateDialog,
        showEditDialog,
        newCollectionName,
        selectedBoards,
        editCollectionName,
        editSelectedBoards,
        openEditDialog,
        updateCollection,
        deleteCollection,
        createCollection,
        viewBoardDetails,
      };
    },
  };
  </script>
  
  <style scoped>
  .v-col {
    padding-bottom: 16px;
  }
  
  .details-btn {
    padding: 4px 8px;
    font-size: 12px;
    height: 28px;
    min-width: 90px;
    margin-top: 8px;
  }
  </style>
  