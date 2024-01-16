<template>
  <div>
    {{ textContent }}
  </div>
</template>
<script>
import { defineComponent, ref, onMounted } from "vue"; // Adicione 'computed' aqui

export default defineComponent({
  name: "processPage",
  setup() {
    const htmlContent = ref("");
    const textContent = ref("");

    onMounted(() => {
      chrome.runtime.sendMessage({ type: "GET_HTML_CONTENT" }, response => {
        htmlContent.value = response;
        const parser = new DOMParser();

        const doc = parser.parseFromString(htmlContent.value, 'text/html');
        const element = doc.querySelector('a.titulo-topo.dropdown-toggle.titulo-topo-desktop');

        if (element) {
          
          textContent.value = element.textContent.trim();
        }

      });
    });

    return { htmlContent, textContent };
  }
});


</script>

<style scoped>
/* Your component's styles go here */
</style>
