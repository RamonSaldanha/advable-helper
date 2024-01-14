<template>
  <div class="div-principal">
    <div class="margem-b-4">
      <h1 class="titulo">{{ loggedIn ? 'Você está logado!' : 'Faça login para continuar' }}</h1>
    </div>
    <form @submit.prevent="submitForm">
      <div class="margem-b-4">
        <label class="rotulo" for="username">
          Nome de usuário
        </label>
        <input class="campo" v-model="username" type="text" placeholder="Nome de usuário" />
      </div>
      <div class="margem-b-4">
        <label class="rotulo" for="password">
          Senha
        </label>
        <input class="campo" v-model="password" type="password" placeholder="Senha" />
      </div>
      <div class="">
        <button class="botao" type="submit">
          Entrar
        </button>
      </div>
    </form>
    <p class="paragrafo-erro" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive, toRefs } from "vue";
import axios from 'axios';

export default defineComponent({
  setup() {
    const visible = ref(false);
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const loggedIn = ref(false); // novo estado para gerenciar o login
    const apiURL = 'http://127.0.0.1:8000/'

    const state = reactive({
      currentTab: null
    });

    const submitForm = async () => {
      try {
        const options = {
          method: 'POST',
          url: apiURL + 'api/entrar',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          data: { email: username.value, password: password.value }
        };

        axios.request(options).then(function (response) {
          // console.log(response.data.token)
          localStorage.setItem('token', response.data.token);

          // Atualiza o estado para indicar que o login foi bem-sucedido
          loggedIn.value = true;
        }).catch(function (error) {
          let errors = [];
          for (let key in error.response.data.errors) {
            errors.push(...error.response.data.errors[key]);
          }
          errorMessage.value = errors.join(' - ');
        });
      } catch (error) {
        errorMessage.value = error.message;
      }
    };

    return {
      visible,
      username,
      password,
      errorMessage,
      submitForm,
      loggedIn, // retornar o estado de login
      ...toRefs(state)
    };
  }
});
</script>
