<template>
    <v-container class="d-flex align-center justify-center" style="height: 100vh;">
        <v-card class="pa-8" width="600">
            <v-card-title>Redefinir Senha</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="resetPassword">
                    <v-text-field v-model="password"
                                  label="Nova Senha"
                                  type="password"
                                  :error-messages="passwordError"
                                  outlined />
                    <v-text-field v-model="confirmPassword"
                                  label="Confirmar Nova Senha"
                                  type="password"
                                  :error-messages="confirmPasswordError"
                                  outlined />
                    <v-btn type="submit" class="mt-4" block color="primary">
                        Redefinir Senha
                    </v-btn>
                    <v-card-actions class="d-flex flex-column">
                        <router-link to="/login" class="mt-2">Página de login</router-link>
                    </v-card-actions>
                </v-form>
                <v-alert v-if="message" type="info" class="mt-4">
                    {{ message }}
                </v-alert>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "ResetPassword",
  data() {
    return {
      password: "",
      confirmPassword: "",
      passwordError: "",
      confirmPasswordError: "",
      message: "",
    };
  },
  methods: {
    async resetPassword() {
    this.passwordError = "";
    this.confirmPasswordError = "";

    // Validação dos campos
    if (!this.password) {
        this.passwordError = "A senha é obrigatória.";
    }
    if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = "As senhas não coincidem.";
    }

    // Se houver erros, não continua
    if (this.passwordError || this.confirmPasswordError) return;

    try {
        const token = this.$route.query.token;  // Pega o token da URL
        const response = await axios.post("http://localhost:4331/api/auth/reset-password", { newPassword: this.password, token });

        // Exibe mensagem de sucesso
        this.message = response.data.message || "Senha redefinida com sucesso!";
    } catch (error) {
        // Exibe mensagem de erro detalhada, se possível
        if (error.response) {
            this.message = error.response.data.message || "Erro ao redefinir senha.";
        } else {
            this.message = "Erro de comunicação com o servidor.";
        }
    }
}
  },
};
</script>
<style scoped>
    .mt-2 {
        margin-top: 8px;
        text-decoration: none;
        color: #1976D2;
        font-size: 0.875rem;
        font-weight: 500;
    }
</style>