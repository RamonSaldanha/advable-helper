<template>
  <div class="">
    <LinkTree v-if="loggedIn" :user="user" />
    <form @submit.prevent="submitForm" class="" v-else>
      <div class="tw-mb-4">
        <label class="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2" for="username">
          Nome de usuário
        </label>
        <input class="tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight tw-focus:outline-none tw-focus:shadow-outline" v-model="username" type="text" placeholder="Nome de usuário" />
      </div>
      <div class="tw-mb-4">
        <label class="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2" for="password">
          Senha
        </label>
        <input class="tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight tw-focus:outline-none tw-focus:shadow-outline" v-model="password" type="password" placeholder="Senha" />
      </div>
      <div class="tw-flex tw-items-center tw-justify-between">
        <button class="tw-bg-blue-500 tw-hover:bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded tw-focus:outline-none tw-focus:shadow-outline" type="submit">
          Entrar
        </button>
      </div>
    </form>
    <p class="tw-text-red-500 tw-text-xs tw-italic tw-mt-2" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive, toRefs } from "vue";
import axios from 'axios';
import { getUser } from './getUser';
import LinkTree from './LinkTree.vue';


export default defineComponent({
  components: {
    LinkTree
  },
  setup() {
    const visible = ref(false);
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const loggedIn = ref(false); // novo estado para gerenciar o login
    const apiURL = 'http://127.0.0.1:8000/'
    const user = ref(null);

    const state = reactive({
      currentTab: null
    });

    const submitForm = async () => {
      errorMessage.value = '';
      try {
        const options = {
          method: 'POST',
          url: apiURL + 'api/entrar',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          data: { email: username.value, password: password.value }
        };

        axios.request(options).then(function (response) {
          chrome.storage.local.set({ token: response.data.token }, function () {
            console.log('O valor foi definido para o token');

            chrome.storage.local.get(['token'], function (result) {
              const token = result.token;

              getUser(token)
                .then(data => {
                  user.value = data.user;
                  loggedIn.value = true;
                })
                .catch(error => {
                  errorMessage.value = error.message;
                });
            });
          });
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
      user,
      ...toRefs(state)
    };
  }
});
</script>
