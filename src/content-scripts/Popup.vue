<template>
  <div class="fixed tw-top-0 tw-right-0 tw-m-6 tw-flex tw-items-center tw-justify-center" v-show="visible">
    <div class="popup tw-bg-white tw-shadow-md tw-rounded tw-px-8 tw-pt-6 tw-pb-8 tw-mb-4" >
      <div class="" v-if="loading">
        <p>Carregando...</p>
      </div>
      <div class="" v-if="loggedIn">
        <LinkTree :user="user" />
      </div> 
      <div v-else>
        <LoginPage v-if="!loggedIn" />
        <p class="tw-text-red-500 tw-text-sm tw-mt-2" v-if="errorMessage">{{ errorMessage }}</p>
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
            // errorMessage.value = error.message;
          });
      });
    });

    return {
      visible,
      loggedIn, // retornar o estado de login
      loading,
      errorMessage,
      user,
      ...toRefs(state)
    };
  }
});
</script>

<style >
.overlay {
  @apply tw-fixed tw-inset-0 tw-w-full tw-h-full tw-bg-black tw-bg-opacity-10;
  z-index: 9998 !important;
}

.popup {
  @apply tw-absolute tw-top-4 tw-right-4 tw-bg-white tw-shadow-lg tw-p-4 tw-rounded-md;
  z-index: 9999 !important;
}
</style>