<template>
  <div>
    <h5 class="adble-title">Olá {{ firstName }}</h5>
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watchEffect } from "vue"; // Adicione 'computed' aqui
import processPage from './processPage.vue';

export default defineComponent({
  name: "LinkTree",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    processPage
  },
  setup(props) {
    const currentUrl = computed(() => window.location.href);
    const currentComponent = ref('');
    const firstName = computed(() => {
      if (props.user && props.user.name) { 
        return props.user.name.split(' ')[0];
      }
      return '';
    });

    watchEffect(() => {
      if (currentUrl.value.includes('whatsapp')) {
        currentComponent.value = 'MVP';
      } else if (currentUrl.value.includes('Processo/ConsultaProcesso/Detalhe/')) {
        currentComponent.value = 'processPage';
      }
    });

    return { firstName, currentComponent };
  }
});
</script>

<style scoped>
h1 {
  color: #333;
}
</style>