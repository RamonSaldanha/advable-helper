<template>
  <div class="fixed top-0 right-0 m-6 z-50 flex items-center justify-center" v-show="visible">
    <div class="popup bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" >
      <div class="" v-if="loading">
        <p>Carregando...</p>
      </div>
      <div class="" v-if="loggedIn">
        <p>Logado!</p>
      </div> 
      <div v-else>
        <LoginPage v-if="!loggedIn" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive, toRefs } from "vue";
import LoginPage from "./LoginPage.vue";
import axios from 'axios';

export default defineComponent({
  components: {
    LoginPage,
  },
  setup() {
    const visible = ref(false);
    const loggedIn = ref(false); // novo estado para gerenciar o login
    const apiURL = 'http://127.0.0.1:8000/'
    const loading = ref(true);
    const errorMessage = ref('');
    

    const state = reactive({
      currentTab: null
    });

    onMounted(() => {
      const token = localStorage.getItem('token');
      console.log(token)
      const options = {
        method: 'GET',
        url: apiURL + 'api/user',
        headers: { Authorization: `Bearer ${token}` }
      };

      axios.request(options).then(response => {
        loading.value = false;
        if (response.data.user) {
          loggedIn.value = true;
        } else {
          loggedIn.value = false;
        }

        chrome.runtime.sendMessage({ type: "POPUP_INIT" }, async tab => {
          state.currentTab = await tab;
          console.log(state.currentTab);
        });
      }).catch(error => {
        loading.value = false; // Adicione esta linha
        errorMessage.value = error.message;
      });
    });

    return {
      visible,
      loggedIn, // retornar o estado de login
      loading,
      errorMessage,
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