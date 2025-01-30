<template>
  <div class="pdf-attachments">
    <h3>Anexos (PDFs)</h3>

    <!-- Exibir nome do PDF dentro do card -->
    <ul>
      <li v-for="pdf in pdfs" :key="pdf.filename" class="pdf-item">
        <div class="pdf-info">
          <!-- Exibir apenas o nome do arquivo PDF -->
          <span>{{ pdf.filename }}</span>
        </div>

        <!-- Botões para visualizar e remover -->
        <div class="pdf-buttons">
          <!-- Botão para visualizar o PDF em nova aba -->
          <v-btn color="primary" @click="viewPdfInNewTab(pdf.filename)">
            Visualizar PDF
          </v-btn>

          <!-- Botão para remover o PDF -->
          <v-btn color="error" small @click="removePdf(pdf.filename)">
            Remover
          </v-btn>
        </div>
      </li>
    </ul>

    <!-- Formulário de upload dentro do card -->
    <form @submit.prevent="uploadPdf" class="upload-form">
      <div>
        <!-- Input de arquivo -->
        <input type="file" accept="application/pdf" @change="handleFileChange" />
      </div>
      <div>
        <!-- Botão de Upload -->
        <v-btn color="primary" type="submit" :disabled="!selectedFile">Upload</v-btn>
      </div>
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
      baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4331', // Base URL para exibir os PDFs
    };
  },
  methods: {
    async fetchPdfs() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await api.get(`/api/pdf/${this.cardId}/attachments`, {
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
      if (!this.selectedFile) {
        console.error('Nenhum arquivo selecionado.');
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('file', this.selectedFile);  // Certifique-se que 'file' seja o nome do campo no backend

        const response = await api.post(`/api/pdf/${this.cardId}/attachments`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        this.pdfs.push(response.data.attachment);  // Atualize a lista de anexos
        this.selectedFile = null;
      } catch (error) {
        console.error('Erro ao fazer upload de PDF:', error);
        alert('Erro ao fazer upload do PDF.');
      }
    },

    async removePdf(filename) {
      try {
        const token = localStorage.getItem('authToken');
        await api.delete(`/api/pdf/${this.cardId}/attachments/${filename}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.pdfs = this.pdfs.filter((pdf) => pdf.filename !== filename);  // Remove o PDF da lista
      } catch (error) {
        console.error('Erro ao remover PDF:', error);
      }
    },

    viewPdfInNewTab(filename) {
      // Abrir o PDF em uma nova aba
      const pdfUrl = `${this.baseUrl}/uploads/${filename}`;
      window.open(pdfUrl, '_blank');
    },
  },

  mounted() {
    this.fetchPdfs(); // Buscar os PDFs ao carregar o componente
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
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 16px;
}

.pdf-info {
  margin-bottom: 8px;
}

.pdf-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-form {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-form > div {
  margin-bottom: 8px;
}

iframe {
  border: none;
  margin-bottom: 8px;
}
</style>
