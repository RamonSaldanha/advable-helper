<template>
  <div>
    <h5 class="adble-title">Olá Dr(a). {{ firstName }}</h5>
    <component :is="currentComponent" :user="user"></component>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watchEffect } from "vue"; // Adicione 'computed' aqui
import processPagePJESeabra from './processPagePJESeabra.vue';
import processPagePJETRT from './processPagePJETRT.vue';

export default defineComponent({
  name: "LinkTree",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    processPagePJESeabra,
    processPagePJETRT
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
        currentComponent.value = 'processPagePJESeabra';
      } else if ( currentUrl.value.includes('jus.br/pjekz/processo/') || currentUrl.value.includes('jus.br/consultaprocessual/detalhe-processo/') ) {
        currentComponent.value = 'processPagePJETRT';
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