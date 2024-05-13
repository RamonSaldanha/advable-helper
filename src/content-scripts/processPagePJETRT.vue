<template>
  <div>
    <h1>TRT</h1>
    {{ processDetails }}
    <div v-if="processDetails">
      <div v-for="(value, key) in processDetails" :key="key">
        <strong>{{ key }}:</strong> {{ value }}
      </div>
    </div>
    <Loading v-if="loading" />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import Loading from './Components/Loading.vue';

export default defineComponent({
  name: "processPagePJESeabra",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    Loading
  },
  setup() {
    const loading = ref(true);
    const processDetails = ref(null);

    const getProcessDetails = (htmlContent) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const texto = doc.querySelector('#processo');
      const objeto = {};
      console.log(texto)

      // Função para extrair informação com regex e verificar se a correspondência foi bem-sucedida
      function extrairInformacao(regex) {
          const match = texto.match(regex);
          return match ? match[1].trim() : null;
      }

      objeto["Órgão julgador"] = extrairInformacao(/Órgão julgador:\s*(.*?)\s*Número do Processo:/s);
      objeto["Número do Processo"] = extrairInformacao(/Número do Processo:\s*(.*?)\s*Distribuído:/s);
      objeto["Distribuído"] = extrairInformacao(/Distribuído:\s*(.*?)\s*Autuado:/s) || null;
      objeto["Autuado"] = extrairInformacao(/Autuado:\s*(.*?)\s*Valor da causa:/s);
      objeto["Valor da causa"] = "R$ " + (extrairInformacao(/Valor da causa:\s*(.*?)\s*Prioridade\(s\):/s) || "").replace(/\s+/g, '');
      objeto["Prioridade(s)"] = extrairInformacao(/Prioridade\(s\):\s*(.*?)\s*Processo com justiça gratuita deferida/s);
      objeto["justica gratuita"] = texto.includes("Processo com justiça gratuita deferida") ? "Processo com justiça gratuita deferida" : null;
      
      // Extração de assuntos de uma forma mais segura
      const assuntosMatch = texto.match(/Assunto\(s\):\s*([\s\S]*?)$/);
      if (assuntosMatch && assuntosMatch[1]) {
          objeto["Assunto(s)"] = assuntosMatch[1].split('\n').map(s => s.trim()).filter(s => s.length > 0);
      } else {
          objeto["Assunto(s)"] = [];
      }

      return objeto;
    }

    onMounted(async () => {
      setTimeout(async () => {
        const htmlContent = await new Promise(resolve => {
          chrome.runtime.sendMessage({ type: "GET_HTML_CONTENT" }, response => {
            resolve(response);
          });
        });
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        console.log(doc.querySelector('.oj-cargo').textContent);
        // processDetails.value = getProcessDetails(htmlContent);
        loading.value = false;
      }, 3000); // Espera 3 segundos antes de executar o código dentro do setTimeout
    });
  }
});
</script>

<style scoped>
/* Your component's styles go here */
</style>
