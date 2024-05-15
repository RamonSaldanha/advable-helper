<template>

  <div class="table">
    <div class="row">
      <div class="cell title">Órgão julgador:</div>
      <div class="cell">{{ processDetails['Órgão julgador'] }}</div>
    </div>
    <div class="row">
      <div class="cell title">Número do Processo:</div>
      <div class="cell">{{ processDetails['Número do Processo'] }}</div>
    </div>
    <div class="row">
      <div class="cell title">Distribuído:</div>
      <div class="cell">{{ processDetails['Distribuído'] }}</div>
    </div>
    <div class="row">
      <div class="cell title">Autuado:</div>
      <div class="cell">{{ processDetails['Autuado'] }}</div>
    </div>
    <div class="row">
      <div class="cell title">Valor da causa:</div>
      <div class="cell">{{ processDetails['Valor da causa'] }}</div>
    </div>
    <div class="row">
      <div class="cell title">Prioridade(s):</div>
      <div class="cell">{{ processDetails['Prioridade(s)'] }}</div>
    </div>
    <div class="row">
      <div class="cell title">Justiça gratuita:</div>
      <div class="cell">{{ processDetails['justica gratuita'] }}</div>
    </div>
    <div class="row">
      <div class="cell title">Assunto(s):</div>
      <div class="cell">{{ processDetails['Assunto(s)'] }}</div>
    </div>

  </div>

</template>

<script>
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "ProcessDatatable",
  props: {
    processDetails: {
      type: Object,
      required: true
    }
  },
  components: {
  },
  setup() {
  
  }
});

</script>


<style scoped>
.table {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
}

.cell {
  margin-right: 10px;
}

.cell.title {
  font-weight: bold;
  width: 130px;
}
</style>