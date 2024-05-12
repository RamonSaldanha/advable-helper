<template>
  <div>
    <h1>TRT</h1>
    <div v-if="processDetails">
      <p>Órgão Julgador: {{ processDetails.judicialBody }}</p>
      <p>Número do Processo: {{ processDetails.caseNumber }}</p>
      <p>Distribuído: {{ processDetails.distributed }}</p>
      <p>Autuado: {{ processDetails.filed }}</p>
      <p>Valor da Causa: {{ processDetails.caseValue }}</p>
      <p>Prioridade(s): {{ processDetails.priority }}</p>
      <p>Assunto(s): {{ processDetails.subjects.join(', ') }}</p>
      <p>Justiça Gratuita Deferida: {{ processDetails.freeJustice ? 'Sim' : 'Não' }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import Button from './Components/Button.vue';

export default defineComponent({
  name: "processPagePJESeabra",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    Button
  },
  setup() {
    const processDetails = ref(null);

    const getProcessDetails = (htmlContent) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      // Substitua 'maisDetalhes' pelo ID ou elemento apropriado do seu HTML, se necessário
      const dts = doc.querySelectorAll('dt'); // Se estiverem todos sob um elemento específico, ajuste conforme necessário
      const details = {
        subjects: [], // Inicializa como array vazio
        freeJustice: false // Assume false por padrão
      };

      dts.forEach(dt => {
        const dd = dt.nextElementSibling;
        switch(dt.textContent.trim()) {
          case "Órgão julgador:":
            details.judicialBody = dd.textContent.trim();
            break;
          case "Número do Processo:":
            details.caseNumber = dd.textContent.trim();
            break;
          case "Distribuído:":
            details.distributed = dd.textContent.trim();
            break;
          case "Autuado:":
            details.filed = dd.textContent.trim();
            break;
          case "Valor da causa:":
            details.caseValue = dd.textContent.trim();
            break;
          case "Prioridade(s):":
            details.priority = dd.textContent.trim();
            break;
          case "Assunto(s):":
            details.subjects = Array.from(dd.querySelectorAll('span')).map(span => span.textContent.trim());
            break;
          case "Processo com justiça gratuita deferida":
            details.freeJustice = true;
            break;
        }
      });

      return details;
    };

    onMounted(async () => {
      const htmlContent = await new Promise(resolve => {
        chrome.runtime.sendMessage({ type: "GET_HTML_CONTENT" }, response => {
          resolve(response);
        });
      });

      processDetails.value = getProcessDetails(htmlContent);
    });

    return { processDetails };
  }
});
</script>

<style scoped>
/* Your component's styles go here */
</style>
