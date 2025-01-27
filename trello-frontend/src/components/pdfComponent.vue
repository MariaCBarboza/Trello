<template>
    <div>
      <input type="file" accept="application/pdf" @change="uploadPDF" />
    </div>
  </template>
  
  <script>
  export default {
    props: ['cardId'],
    methods: {
      async uploadPDF(event) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('cardId', this.cardId);
  
        await axios.post('/api/cards/anexarPDF', formData);
        this.$emit('atualizar');
      },
    },
  };
  </script>
  