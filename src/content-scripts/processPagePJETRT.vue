<template>
  <div>
    <Alert v-if="errorMessage" :message="errorMessage" />
    <p v-if="processExists"  style="display: flex; align-items: center;">
      <svg xmlns="http://www.w3.org/2000/svg" style="margin-right: 5px;"  width="16" height="16" fill="green" class="bi bi-check-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
      </svg>
      Processo já cadastrado
    </p>
    <div v-else>
      <div v-if="process">
        <Label title="Número do processo" :value="process.process_num" />
        <Label title="Órgão julgador" :value="process.jurisdiction" />
        <details class="adble-details">
          <summary class="adble-summary">Detalhes do processo</summary>
          <Label title="Distribuído" :value="process.details.distribuido" />
          <Label title="Autuado" :value="process.autuacao" />
          <Label title="Valor da causa" :value="process.details.valorDaCausa" />
          <Label title="Prioridade(s)" :value="process.details.prioridades" />
          <Label title="Justiça gratuita" :value="process.details.justicaGratuita" />
          <Label title="Tutela de urgência" :value="process.details.tutelaDeUrgencia" />
          <Label title="Classe judicial" :value="process.details.classeJudicial" />
          
          <div>
            <label for="assunto">Assunto:</label><br>
            <ul>
              <li v-for="(assunto, index) in process.details.assuntos" :key="index">{{ assunto }}</li>
            </ul>
          </div> 
        </details>
  
        <details class="adble-details">
          <div>
            <input
              type="checkbox"
              id="OnlyThoseIRepresent"
              v-model="OnlyThoseIRepresent"
              value="newsletter" />
            <label for="OnlyThoseIRepresent"> Apenas os que eu represento </label>
          </div>
          <summary class="adble-summary">Partes no processo</summary>
          <div class="adble-person" v-for="(person, index) in filteredPartesProcesso" :key="index">
            <span class="adble-name">
              {{ person.nome }}
              <small>{{ person.documento }}</small>
            </span>
            <span class="adble-badge">{{ person.polo }}</span>
            <button type="button" class="adble-delete-button" @click="deletePerson(index)">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="white" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2h-1v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zM17 7H7v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1zm-2.72-3H9.72l-.333 1h5.226z"/></g></svg>
            </button>
          </div>
  
        </details>
      </div>
      <!-- <PartesProcesso :partesProcesso="filteredPartesProcesso" /> -->
    </div>
    <div class="adble-mb-1" v-if="!process">
      <Button label="Capturar informações deste processo" class="adble-mb-1" @confirm="capture" />
    </div>
    <div class="adble-mb-1" v-else>
      <Button type="button" :loading="loading" label="Cadastrar" @confirm="processAdd" v-if="process && !processExists" />
    </div>
    <Loading v-if="loading" />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import Loading from './Components/Loading.vue';
import Button from './Components/Button.vue';
import Table from './Components/Table.vue';
import PartesProcesso from './Components/PartesProcesso.vue';
import ProcessDatatable from './Components/ProcessDatatable.vue';
import { waitForElement, delay } from './utils';
import { buildData } from './utils';
import Label from './Components/Label.vue';
import { addProcessTRT } from './addProcessTRT';
import Alert from './Components/Alert.vue';
import { getProcess } from './getProcess';

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
    PartesProcesso,
    Label,
    Alert
  },
  setup(props) {
    const loading = ref(false);
    const process = ref(null);
    const partesProcesso = ref(null);
    const OnlyThoseIRepresent = ref(true);
    const processExists = ref(false);
    const errorMessage = ref(null);

    onMounted(async () => {
      const tabUrl = await new Promise(resolve => {
        chrome.runtime.sendMessage({ type: "GET_CURRENT_ROOT" }, response => {
          resolve(response);
        });
      });
      const token = await new Promise(resolve => {
        chrome.storage.local.get(['token'], function (result) {
          resolve(result.token);
        });
      });
      await capture();
      getProcess(process.value.process_num, tabUrl, token).then(data => {
        if(data.process){
          processExists.value = true;
        }
      });
    });

    async function processAdd() {
      loading.value = true;


      chrome.storage.local.get(['token'], function (result) {
        const token = result.token;

        addProcessTRT(process.value, token)
          .then(data => {
            loading.value = false;
            processExists.value = true;
          })
          .catch(error => {
            loading.value = false; // Adicione esta linha
            errorMessage.value = "Algum erro ao adicionar processo";
          });
      });
    }

    const filteredPartesProcesso = computed(() => {
      if (OnlyThoseIRepresent.value) {
        return partesProcesso.value.filter(parte =>
          parte.representantes.map(rep => rep.toUpperCase()).includes(props.user.oab_name.toUpperCase())
        );
      } else {
        return partesProcesso.value;
      }
    });

    const deletePerson = (index) => {
      partesProcesso.value.splice(index, 1);
    };

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

      // Novo formato de dados
      return {
        number: dados['Número do Processo'],
        jurisdiction: dados['Órgão julgador'],
        autuacao: dados['Autuado'],
        details: {
          tutelaDeUrgencia: encontrarDado("Tutela de urgência:"),
          classeJudicial: encontrarDado("Classe Judicial:"),
          valorDaCausa: dados['Valor da causa'],
          assuntos: dados['Assunto(s)'],
        },
      };
    }

    function extrairNumeroProcessoDois() {
      const element = document.querySelector('#inicio-detalhes-modal');
      if (element) {
        const match = element.textContent.match(/(\d{7}-\d{2}\.\d{4}\.\d{1,2}\.\d{2}\.\d{4})/);
        return match ? match[1] : 'Número do processo não encontrado';
      }
      return 'Número do processo não encontrado';
    }

    const extractPartesProcesso = (rootSelector, categoriaSelector, nomeSelector, documentoSelector, enderecoSelector, representanteSelector) => {
      const partes = [];

      const seçõesPartes = document.querySelectorAll(rootSelector);

      seçõesPartes.forEach(seção => {
        const categoriaElemento = seção.querySelector(categoriaSelector);
        if (!categoriaElemento) return;

        const categoriaTexto = categoriaElemento.textContent.trim();
        let polo;

        if (categoriaTexto.toLowerCase().includes('polo ativo')) {
          polo = 'Ativo';
        } else if (categoriaTexto.toLowerCase().includes('polo passivo')) {
          polo = 'Passivo';
        } else if (categoriaTexto.toLowerCase().includes('outros interessados')) {
          polo = 'Terceiro';
        }

        const elementosPartes = seção.querySelectorAll('ul.sem-padding.sem-margem-top.sem-marcacao');

        elementosPartes.forEach(elemento => {
          const reclamadoNomeElement = elemento.querySelector(nomeSelector);
          const documentoElement = Array.from(elemento.querySelectorAll(documentoSelector)).find(el => el.textContent.includes('CPF') || el.textContent.includes('CNPJ') || el.textContent.includes('CPJ'));
          const enderecoElements = Array.from(elemento.querySelectorAll(enderecoSelector)).filter(el => el.textContent.includes('CEP'));

          const reclamadoNome = reclamadoNomeElement ? reclamadoNomeElement.textContent.trim() : 'Nome não encontrado';

          const documentoMatch = documentoElement ? documentoElement.textContent.match(/(CPF|CNPJ|CPJ):\s*([\d\.\-\/]+)/) : null;
          const documento = documentoMatch ? documentoMatch[2] : 'Sem documento';
          const tipo = documentoMatch ? documentoMatch[1] : 'Sem documento';

          const endereco = enderecoElements.map(el => el.textContent.trim()).join(' ');

          const representantes = [];
          const representantesLi = elemento.querySelectorAll(representanteSelector);
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
            representantes: representantes,
            polo: polo
          };

          partes.push(parte);
        });
      });

      return partes;
    };

    const PartesProcessoTRTVersaoConsultaUm = () => {
      return extractPartesProcesso(
        '#processo-partes .is-item-pilha-parte',
        '.polo .polo-header',
        'pje-nome-parte .mat-tooltip-trigger.upperCase.negrito.cursor-pointer',
        'span.ng-star-inserted',
        'span.ng-star-inserted',
        '.partes-hierarquia .partes-representante span'
      );
    };

    const PartesProcessoTRTVersaoConsultaDois = () => {
      return extractPartesProcesso(
        '#colunas-dados-processo .coluna-polo',
        '.titulo-polo h3',
        '.nome-parte.parte-documento-valido',
        'span.ng-star-inserted',
        'span.ng-star-inserted',
        '.partes-hierarquia .partes-representante span'
      );
    };

    const capture = async () => {
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

        console.log('Elemento de processo encontrado: ' + processElement.id);

        await delay(1500);

        let numeroProcesso;
        if (processElement.id === 'processo') {
          process.value = extrairDadosProcesso();
          partesProcesso.value = PartesProcessoTRTVersaoConsultaUm();
        } else if (processElement.id === 'colunas-dados-processo') {
          numeroProcesso = extrairNumeroProcessoDois();
          process.value = {
            ...extrairDadosProcesso(),
            number: numeroProcesso,
          };
          partesProcesso.value = PartesProcessoTRTVersaoConsultaDois();
        }

        const currentUrl = window.location.href;
        process.value = buildData(process, filteredPartesProcesso, currentUrl);
        loading.value = false;
      } catch (error) {
        console.error(error);
        loading.value = false;  // Certifique-se de parar o carregamento em caso de erro
      }
    };

    return {
      process,
      loading,
      capture,
      partesProcesso,
      OnlyThoseIRepresent,
      filteredPartesProcesso,
      deletePerson,
      processAdd,
      errorMessage,
      processExists
    };
  }
});
</script>

<style scoped>
/* Your component's styles go here */
</style>
