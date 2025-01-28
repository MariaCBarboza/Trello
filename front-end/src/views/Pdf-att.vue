<template>
  <div class="pdf-attachments">
    <h3>Anexos (PDFs)</h3>
    <ul>
      <li v-for="pdf in pdfs" :key="pdf.filename">
        <a :href="`${baseUrl}/uploads/${pdf.filename}`" target="_blank">{{ pdf.originalname }}</a>
        <v-btn color="error" small @click="removePdf(pdf.filename)">Remover</v-btn>
      </li>
    </ul>
    <form @submit.prevent="uploadPdf">
      <input type="file" accept="application/pdf" @change="handleFileChange" />
        
    </form>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'PdfAttachments',
  props: {
    cardId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pdfs: [], // Lista de PDFs anexados
      selectedFile: null, // Arquivo selecionado para upload
      baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', // Base URL para exibir os PDFs
    };
  },
  methods: {
    async fetchPdfs() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await api.get(`/api/cards/${this.cardId}/pdfs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.pdfs = response.data;
      } catch (error) {
        console.error('Erro ao buscar PDFs:', error);
      }
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadPdf() {
      if (!this.selectedFile) return;
      try {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('pdf', this.selectedFile);

        const response = await api.post(`/api/cards/${this.cardId}/pdfs`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        this.pdfs.push(response.data);
        this.selectedFile = null;
      } catch (error) {
        console.error('Erro ao fazer upload de PDF:', error);
      }
    },
    async removePdf(filename) {
      try {
        const token = localStorage.getItem('authToken');
        await api.delete(`/api/cards/${this.cardId}/pdfs/${filename}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.pdfs = this.pdfs.filter((pdf) => pdf.filename !== filename);
      } catch (error) {
        console.error('Erro ao remover PDF:', error);
      }
    },
  },
  mounted() {
    this.fetchPdfs();
  },
};
</script>

<style scoped>
.pdf-attachments {
  margin-top: 16px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

form {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
