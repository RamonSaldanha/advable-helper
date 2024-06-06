<template>
  <div class="adble-popup" v-show="visible">
    <CloseButton @close="closePopup" />
    <div>
      <div v-if="loading">
        <p>Carregando...</p>
      </div>
      <div v-if="loggedIn">
        <LinkTree :user="user" />
        <Button @confirm="logout" label="Sair" />
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
import Button from "./Components/Button.vue";
import CloseButton from "./Components/ClosePopUpButton.vue";
import { getUser } from './getUser';

export default defineComponent({
  components: {
    LoginPage,
    LinkTree,
    Button,
    CloseButton
  },
  setup() {
    const visible = ref(false);  
    const loggedIn = ref(false);
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
            });
          })
          .catch(error => {
            loading.value = false;
            loggedIn.value = false;
            errorMessage.value = error.message;
          });
      });
    });

    const logout = () => {
      chrome.storage.local.remove(['token'], function () {
        loggedIn.value = false;
      });
    };

    const closePopup = () => {
      visible.value = false;
    };

    return {
      visible,
      loggedIn,
      loading,
      errorMessage,
      user,
      logout,
      closePopup,
      ...toRefs(state)
    };
  }
});
</script>

