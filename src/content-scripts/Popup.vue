<template>
  <div class="adble-popup" v-show="visible">
    <div class="" >
      <div class="" v-if="loading">
        <p>Carregando...</p>
      </div>
      <div class="" v-if="loggedIn">
        <LinkTree :user="user" />
        <button class="adble-button" @click="logout">Sair</button>
      </div> 
      <div v-else>
        <LoginPage v-if="!loggedIn" />
        <p class="adble-alert-yellow" v-if="errorMessage">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive, toRefs } from "vue";
import LoginPage from "./LoginPage.vue";
import LinkTree from "./LinkTree.vue";
import { getUser } from './getUser';

export default defineComponent({
  components: {
    LoginPage,
    LinkTree
},
  setup() {
    
    const visible = ref(false);
    const loggedIn = ref(false); // novo estado para gerenciar o login
    const loading = ref(true);
    const errorMessage = ref('');
    const user = ref(null);
    
    const state = reactive({
      currentTab: null
    });

    onMounted(() => {
      chrome.storage.local.get(['token'], function (result) {
        const token = result.token;

        getUser(token)
          .then(data => {
            loading.value = false;
            if (data.user) {
              loggedIn.value = true;
              user.value = data.user;
            } else {
              loggedIn.value = false;
            }

            chrome.runtime.sendMessage({ type: "POPUP_INIT" }, async tab => {
              state.currentTab = await tab;
              console.log(state.currentTab);
            });
          })
          .catch(error => {
            loading.value = false; // Adicione esta linha
            loggedIn.value = false;
            // errorMessage.value = error.message;
          });
      });
    });

    const logout = () => {
      chrome.storage.local.remove(['token'], function () {
        loggedIn.value = false;
      });
    };

    return {
      visible,
      loggedIn, // retornar o estado de login
      loading,
      errorMessage,
      user,
      logout,
      ...toRefs(state)
    };
  }
});
</script>