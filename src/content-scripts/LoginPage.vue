<template>
  <div class="">
    <div v-if="loggedIn">
      <LinkTree :user="user" />
      <Button label="Sair" @confirm="logout">Sair</Button>
    </div>
    <form @submit.prevent="submitForm" class="" v-else>
      <div class="adble-margin-y">
        <label class="adble-label" for="username">
          Nome de usuário
        </label>
        <input class="adble-input" v-model="username" type="text" placeholder="Nome de usuário" />
      </div>
      <div class="adble-margin-y">
        <label class="adble-label" for="password">
          Senha
        </label>
        <input class="adble-input" v-model="password" type="password" placeholder="Senha" />
      </div>
      <div class="adble-margin-y">
        <Button label="Entrar" type="submit" />
      </div>
    </form>
    <p class="adble-alert-yellow" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive, toRefs } from "vue";
import axios from 'axios';
import { getUser } from './getUser';
import LinkTree from './LinkTree.vue';
import Button from './Components/Button.vue';
import { API_URL, LOGIN_ENDPOINT } from "../apiConfig";

export default defineComponent({
  components: {
    LinkTree,
    Button
  },
  setup() {
    const visible = ref(false);
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const loggedIn = ref(false); // novo estado para gerenciar o login
    const user = ref(null);

    const state = reactive({
      currentTab: null
    });

    const submitForm = async () => {
      errorMessage.value = '';
      try {
        const options = {
          method: 'POST',
          url: API_URL + LOGIN_ENDPOINT,
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          data: { email: username.value, password: password.value }
        };

        axios.request(options).then(function (response) {
          chrome.storage.local.set({ token: response.data.token }, function () {
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

    const logout = () => {
      chrome.storage.local.remove(['token'], function () {
        loggedIn.value = false;
      });
    };

    return {
      visible,
      username,
      password,
      errorMessage,
      submitForm,
      loggedIn, // retornar o estado de login
      user,
      logout,
      ...toRefs(state)
    };
  }
});
</script>
