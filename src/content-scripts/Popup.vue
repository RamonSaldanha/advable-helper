<template>
  <div class="fixed top-0 right-0 m-6 z-50 flex items-center justify-center" v-show="visible">
    <div class="popup bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <h1 class="block text-gray-700 text-sm font-bold mb-2">{{ loggedIn ? 'Você está logado!' : 'Faça login para continuar' }}</h1>
      </div>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            Nome de usuário
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            v-model="username" type="text" placeholder="Nome de usuário" />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Senha
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            v-model="password" type="password" placeholder="Senha" />
        </div>
        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit">
            Entrar
          </button>
      </div>
    </form>
    <p class="text-red-500 text-xs italic" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
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
    const errorMessage = ref(null);
    const loggedIn = ref(false); // novo estado para gerenciar o login

    const state = reactive({
      currentTab: null
    });

    onMounted(() => {
      chrome.runtime.sendMessage({ type: "POPUP_INIT" }, async tab => {
        state.currentTab = await tab;
        console.log(state.currentTab);
      });
    });

    const submitForm = async () => {
      try {
        const options = {
          method: 'POST',
          url: 'http://127.0.0.1:8000/api/entrar',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          data: { email: username.value, password: password.value }
        };

        axios.request(options).then(function (response) {
          console.log(response.data);
          // Atualiza o estado para indicar que o login foi bem-sucedido
          loggedIn.value = true;
        }).catch(function (error) {
          errorMessage.value = error.message;
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

<style >
.overlay {
  @apply fixed inset-0 w-full h-full bg-black bg-opacity-10 z-50;
}

.popup {
  @apply absolute top-4 right-4 bg-white shadow-lg p-4 rounded-md w-72;
}
</style>