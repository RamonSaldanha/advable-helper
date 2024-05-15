<template>
  <div>
    <h1>TRT</h1>
    <div v-if="processDetails">
      <ProcessDatatable :processDetails="processDetails" />
    </div>
    <Button label="capturar" @confirm="capture" />
    <Loading v-if="loading" />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import Loading from './Components/Loading.vue';
import Button from './Components/Button.vue';
import ProcessDatatable from './Components/ProcessDatatable.vue';
import { waitForElement, delay } from './utils';

export default defineComponent({
  name: "processPagePJESeabra",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    Loading,
    Button,
    ProcessDatatable
  },
  setup() {
    const loading = ref(false);
    const processDetails = ref(null);

    function extrairDadosProcesso() {
      const dados = {};
      function encontrarDado(labelText) {
          const dts = Array.from(document.querySelectorAll('dt'));
          const dt = dts.find(dt => dt.textContent.trim().includes(labelText));
          if (!dt) return null;
          return dt.nextElementSibling ? dt.nextElementSibling.textContent.trim() : null;
      }
      dados['Órgão julgador'] = encontrarDado("Órgão julgador:");
      dados['Número do Processo'] = encontrarDado("Número do Processo:");
      dados['Distribuído'] = encontrarDado("Distribuído:");
      dados['Autuado'] = encontrarDado("Autuado:");
      dados['Valor da causa'] = encontrarDado("Valor da causa:");
      dados['Prioridade(s)'] = encontrarDado("Prioridade(s):");
      dados['justica gratuita'] = document.querySelector('i.far.fa-check-square') ? "Processo com justiça gratuita deferida" : "Não disponível";
      const assuntosDts = Array.from(document.querySelectorAll('dt')).filter(dt => dt.textContent.trim().includes("Assunto(s):"));
      const assuntosSet = new Set(assuntosDts.map(dt => dt.nextElementSibling ? dt.nextElementSibling.textContent.trim() : ""));
      dados['Assunto(s)'] = Array.from(assuntosSet);  // Convertendo o conjunto de volta para um array

      return dados;
  }


    async function capture() {

      try {
        loading.value = true;
        const modalProcess = document.querySelector("pje-descricao-processo > span:nth-child(2)");
        modalProcess.click();
        await waitForElement('#processo');
        await delay(1500);
        processDetails.value = extrairDadosProcesso();
        loading.value = false;

      } catch (error) {
        console.error(error);
      }

    }

    return {
      processDetails,
      loading,
      capture
    };
  }
});
</script>

<style scoped>
/* Your component's styles go here */
</style>
