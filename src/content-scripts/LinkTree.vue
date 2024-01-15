<template>
  <div>
    <h1>Olá {{ firstName }}</h1>
    <p>Você está logado.</p>
    <p>{{ currentComponent }}</p>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watchEffect } from "vue"; // Adicione 'computed' aqui

export default defineComponent({
  name: "LinkTree",
  props: {
    user: {
      type: Object,
      required: true
    }
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
      } else if (currentUrl.value.includes('pje1g')) {
        currentComponent.value = 'Processos';
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