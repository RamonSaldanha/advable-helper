<template>
  <div>
    <div v-if="processDetails">
      <Table :rows="Object.entries(processDetails).map(([key, value]) => ({ column: key, value: value }))"/> 
      <div>
        <input
          type="checkbox"
          id="OnlyThoseIRepresent"
          v-model="OnlyThoseIRepresent"
          value="newsletter" />
        <label for="OnlyThoseIRepresent"> Apenas os que eu represento </label>
      </div>
      {{ OnlyThoseIRepresent }}
      <PartesProcesso :partesProcesso="filteredPartesProcesso" />
    </div>
    <Button label="capturar" @confirm="capture" />
    <Loading v-if="loading" />
  </div>
</template>

<script>
import { defineComponent, ref, computed} from "vue";
import Loading from './Components/Loading.vue';
import Button from './Components/Button.vue';
import Table from './Components/Table.vue';
import PartesProcesso from './Components/PartesProcesso.vue';
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
    ProcessDatatable,
    Table,
    PartesProcesso
  },
  setup(props) {
    const loading = ref(false);
    const processDetails = ref(null);
    const partesProcesso = ref(null);
    const OnlyThoseIRepresent = ref(false);

    const filteredPartesProcesso = computed(() => {
      if (OnlyThoseIRepresent.value) {
        let partesQueRepresento = {};

        for (let polo in partesProcesso.value) {
          partesQueRepresento[polo] = partesProcesso.value[polo].filter(parte => 
            parte.representantes.map(rep => rep.toUpperCase()).includes(props.user.oab_name.toUpperCase())
          );
        }

        return partesQueRepresento;
      } else {
        return partesProcesso.value;
      }
    });


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

        const modalProcess = document.querySelector("pje-descricao-processo > span:nth-child(2)") || document.querySelector("#titulo-detalhes > h1");

        if (!modalProcess) {
          throw new Error('Nenhum elemento encontrado');
        }

        modalProcess.click();

        const processElement = await Promise.race([
          waitForElement('#processo'),
          waitForElement('#colunas-dados-processo')
        ]);

        if (!processElement) {
          throw new Error('Nenhum elemento de processo encontrado');
        }

        await delay(1500);
        processDetails.value = extrairDadosProcesso();
        partesProcesso.value = getPartesProcesso();
        
        loading.value = false;

      } catch (error) {
        console.error(error);
        loading.value = false;  // Certifique-se de parar o carregamento em caso de erro
      }
    }

    const getPartesProcesso = () => {
      const categorias = {
        PoloAtivo: [],
        PoloPassivo: [],
        OutrosInteressados: []
      };

      const seçõesPartes = document.querySelectorAll('#processo-partes .is-item-pilha-parte');

      seçõesPartes.forEach(seção => {
        const categoriaElemento = seção.querySelector('.polo .polo-header');
        if (!categoriaElemento) return;

        const categoriaTexto = categoriaElemento.textContent.trim();
        let categoriaArray;

        if (categoriaTexto.includes('Polo Ativo')) {
          categoriaArray = categorias.PoloAtivo;
        } else if (categoriaTexto.includes('Polo Passivo')) {
          categoriaArray = categorias.PoloPassivo;
        } else if (categoriaTexto.includes('Outros Interessados')) {
          categoriaArray = categorias.OutrosInteressados;
        }

        const elementosPartes = seção.querySelectorAll('#partes-processo-autuacao ul.sem-padding.sem-margem-top.sem-marcacao');

        elementosPartes.forEach(elemento => {
          const reclamadoNomeElement = elemento.querySelector('pje-nome-parte .mat-tooltip-trigger.upperCase.negrito.cursor-pointer');
          const documentoElement = Array.from(elemento.querySelectorAll('span.ng-star-inserted')).find(el => el.textContent.includes('CPF') || el.textContent.includes('CNPJ'));
          const enderecoElements = Array.from(elemento.querySelectorAll('span.ng-star-inserted')).filter(el => el.textContent.includes('CEP'));

          const reclamadoNome = reclamadoNomeElement ? reclamadoNomeElement.textContent.trim() : 'Nome não encontrado';

          const documentoMatch = documentoElement ? documentoElement.textContent.match(/(CPF|CNPJ):\s*([\d\.\-\/]+)/) : null;
          const documento = documentoMatch ? documentoMatch[2] : 'Sem documento';
          const tipo = documentoMatch ? documentoMatch[1] : 'Sem documento';

          const endereco = enderecoElements.map(el => el.textContent.trim()).join(' ');

          // Obter os representantes dentro do ul.partes-hierarquia
          const representantes = [];
          const representantesLi = elemento.querySelectorAll('.partes-hierarquia .partes-representante span');
          representantesLi.forEach(li => {
            const nomeAdvogado = li.textContent.trim();
            if (nomeAdvogado.includes('(ADVOGADO)')) {
              representantes.push(nomeAdvogado.split(' (ADVOGADO)')[0].trim());
            }
          });

          const parte = {
            nome: reclamadoNome,
            documento: documento,
            tipo: tipo,
            endereco: endereco,
            representantes: representantes
          };

          if (categoriaArray) {
            categoriaArray.push(parte);
          }
        });
      });

      return categorias;
    };

    return {
      processDetails,
      loading,
      capture,
      partesProcesso,
      OnlyThoseIRepresent,
      filteredPartesProcesso
    };
  }
});
</script>

<style scoped>
/* Your component's styles go here */
</style>
