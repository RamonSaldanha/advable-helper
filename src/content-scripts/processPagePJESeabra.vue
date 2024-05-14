<template>
  <div>
    <p v-if="processExists"  style="display: flex; align-items: center;">
      <svg xmlns="http://www.w3.org/2000/svg" style="margin-right: 5px;"  width="16" height="16" fill="green" class="bi bi-check-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
      </svg>
      Processo já cadastrado
    </p>
    <form action="" method="post" v-else >
      <label class="adble-label" for="processNumber">Número do processo:</label>
      <div>
        {{ process.number }}
        <!-- <input class="adble-input" type="text" id="processNumber" name="processNumber" v-model="process.number"><br> -->
      </div>

      <label class="adble-label" for="jurisdiction">Jurisdição</label>
      <div>
        {{ process.jurisdiction }}
        <!-- <input class="adble-input" type="text" id="jurisdiction" name="jurisdiction" v-model="process.jurisdiction"><br> -->
      </div>
      <details class="adble-details">
        <summary class="adble-summary">Detalhes do processo</summary>
        <div>
          <label for="classeJudicial">Classe judicial:</label><br>
          {{ process.details.classeJudicial }}
          <!-- <input class="adble-input" type="text" id="classeJudicial" name="classeJudicial" v-model="process.details.classeJudicial"><br> -->
        </div>
        <div>
          <label for="assunto">Assunto:</label><br>
          <ul>
            <li v-for="(assunto, index) in process.details.assuntos" :key="index">{{ assunto }}</li>
          </ul>
        </div> 
        <div>
          <label for="jurisdicao">Jurisdição:</label><br>
          {{ process.details.jurisdicao }}
          <!-- <input class="adble-input" type="text" id="jurisdicao" name="jurisdicao" v-model="process.details.jurisdicao"><br> -->
        </div>
        <div>
          <label for="autuacao">Autuação:</label><br>
          {{ process.details.autuacao }}
          <!-- <input class="adble-input" type="text" id="autuacao" name="autuacao" v-model="process.details.autuacao"><br> -->
        </div>
        <div>
          <label for="valorDaCausa">Valor da causa:</label><br>
          {{ process.details.valorDaCausa }}
          <!-- <input class="adble-input" type="text" id="valorDaCausa" name="valorDaCausa" v-model="process.details.valorDaCausa"><br> -->
        </div>
      </details>
      <!-- Restante do formulário aqui -->

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

        <div class="adble-person" v-for="(person, index) in filteredPeople" :key="index">
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

      <div v-if="errorMessage" class="adble-alert-yellow">{{ errorMessage }}</div>

      <Button type="button" :loading="loading" label="Cadastrar" @confirm="processAdd" />
    </form>
  </div>
</template>
<script>
import { defineComponent, ref, onMounted, computed } from "vue"; // Adicione 'computed' aqui
import { getProcess } from './getProcess';
import Button from './Components/Button.vue';
import { addProcess } from './addProcess';
import { buildData } from './utils'; 

export default defineComponent({
name: "processPage",
props: {
  user: {
    type: Object,
    required: true
  }
},
components: {
  Button
},
setup(props) {

  const loading = ref(false);

  const errorMessage = ref('');

  const process = ref({
    number: "",
    jurisdiction: "",
    people: [],
    autuacao: "",
    details: {}
  });

  const OnlyThoseIRepresent = ref(true);

  const processExists = ref(false);

  onMounted(async () => {
    const htmlContent = await new Promise(resolve => {
      chrome.runtime.sendMessage({ type: "GET_HTML_CONTENT" }, response => {
        resolve(response);
      });
    });

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const maisDetalhes = doc.getElementById('maisDetalhes');
    const dts = maisDetalhes.querySelectorAll('dt');
    const processDetails = {};

    dts.forEach(dt => {
      const dd = dt.nextElementSibling;
      switch (dt.textContent.trim()) {
          case 'Classe judicial':
              processDetails.classeJudicial = dd.textContent.trim();
              break;
          case 'Assunto':
              processDetails.assuntos = Array.from(dd.querySelectorAll('li')).map(li => li.textContent.trim());
              break;
          case 'Jurisdição':
              processDetails.jurisdicao = dd.textContent.trim();
              break;
          case 'Autuação':
              processDetails.autuacao = dd.textContent.trim();
              break;
          case 'Valor da causa':
              processDetails.valorDaCausa = dd.textContent.trim();
              break;
          case 'Tutela/liminar?':
              processDetails.tutelaDeUrgencia = dd.textContent.trim().toUpperCase() === 'SIM';
              break;
      }
    });

    process.value.details = processDetails;

    process.value.number = getNumeroProcesso(doc);
    process.value.jurisdiction = getOrgaoJulgador(doc);
    process.value.autuacao = getAutuacao(doc);

    const poloAtivo = getPoloAtivo(doc).map(person => ({ ...person, polo: 'Ativo' }));
    const poloPassivo = getPoloPassivo(doc).map(person => ({ ...person, polo: 'Passivo' }));
    const terceiros = getTerceiros(doc).map(person => ({ ...person, polo: 'Terceiro' }));

    process.value.people = [...poloAtivo, ...poloPassivo, ...terceiros];
    
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
    
    getProcess(process.value.number, tabUrl, token).then(data => {
      if(data.process){
        processExists.value = true;
      }
    });
  
  });

  const filteredPeople = computed(() => {
    if (OnlyThoseIRepresent.value) {
      return process.value.people.filter(person => 
        person.representantes.includes(props.user.oab_name)
      );
    } else {
      return process.value.people;
    }
  });

  const deletePerson = (index) => {
    process.value.people.splice(index, 1);
  };

  const getNumeroProcesso = (doc) => {
    // O padrão procura uma sequência de dígitos seguida por um hífen, mais dígitos, um ponto, mais dígitos, um ponto, mais dígitos, um ponto e mais dígitos.
    let padrao = /(\d{7}-\d{2}.\d{4}.\d{1}.\d{2}.\d{4})/;
    let texto = doc.querySelector('.titulo-topo').textContent;
    let resultado = padrao.exec(texto);

    return resultado ? resultado[1] : 'Número do processo não encontrado';
  };

  const getAutuacao = (doc) => {
    let padrao = /Autuação<\/dt>\s*<dd>(.*?)<\/dd>/;
    let texto = doc.querySelector('#maisDetalhes').innerHTML;
    let resultado = padrao.exec(texto);

    return resultado ? resultado[1].trim() : 'Data de autuação não encontrada';
  };

  const getOrgaoJulgador = (doc) => {
    let padrao = /Órgão julgador<\/dt>\s*<dd>(.*?)<\/dd>/;
    let texto = doc.querySelector('#maisDetalhes').innerHTML;
    let resultado = padrao.exec(texto);

    return resultado ? resultado[1].trim() : 'Órgão julgador não encontrado';
  };

  function extrairInformacoes(texto) {
    let regex = /^(.*?)\s-\sOAB/;
    let match = texto.match(regex);

    if(match){
      return match[1];
    }
  }

  const getTerceiros = (doc) => {
    let elementosterceiros = doc.querySelectorAll('#outrosInteressados .table tbody tr td');
    let terceiros = [];

    elementosterceiros.forEach(elemento => {
      let texto = elemento.textContent;
      let padrao = /(.+?)(?: - (CPF|CNPJ): (\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{3}\.\d{3}\.\d{3}-\d{2}))?(?=\s*\(|\s*$)/;
      let resultado = padrao.exec(texto);

      // Obter os nomes dentro dos elementos <li>
      let nomesLi = [];
      let lis = elemento.querySelectorAll('ul.tree li');
      lis.forEach(li => {
          let nomeLi = extrairInformacoes(li.textContent.trim()); // ajuste conforme necessário para extrair apenas o nome relevante
          nomesLi.push(nomeLi);
      });

      if (resultado) {
          let documento = resultado[3] || 'Sem documento';
          let tipo = resultado[2] || 'Sem documento';
          terceiros.push({
              nome: resultado[1].trim(),
              documento: documento,
              tipo: tipo,
              representantes: nomesLi
          });
      } else {
          // Caso onde não há CPF ou CNPJ
          terceiros.push({
              nome: texto.trim(),
              documento: 'Sem documento',
              tipo: 'Sem documento',
              outrosNomes: nomesLi
          });
      }
    });

    return terceiros; 
  }

  const getPoloAtivo = (doc) => {
    let elementosPoloAtivo = doc.querySelectorAll('#poloAtivo .table tbody tr td');
    let poloAtivo = [];

    elementosPoloAtivo.forEach(elemento => {
      let texto = elemento.textContent;
      let padrao = /(.+?)(?: - (CPF|CNPJ): (\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{3}\.\d{3}\.\d{3}-\d{2}))?(?=\s*\(|\s*$)/;
      let resultado = padrao.exec(texto);
      // Obter os nomes dentro dos elementos <li>
      let nomesLi = [];
      let lis = elemento.querySelectorAll('ul.tree li');
      lis.forEach(li => {
          // console.log(li.textContent.trim());
          let nomeLi =  extrairInformacoes(li.textContent.trim()); // ajuste conforme necessário para extrair apenas o nome relevante
          nomesLi.push(nomeLi);
      });

      if (resultado) {
        let documento = resultado[3] || 'Sem documento';
        let tipo = resultado[2] || 'Sem documento';
        poloAtivo.push({
          nome: resultado[1].trim(),
          documento: documento,
          tipo: tipo,
          representantes: nomesLi
        });
      } else {
        // Caso onde não há CPF ou CNPJ
        poloAtivo.push({
          nome: texto.trim(),
          documento: 'Sem documento',
          tipo: 'Sem documento',
          outrosNomes: nomesLi
        });
      }
    });

    return poloAtivo;
  };

  const getPoloPassivo = (doc) => {
    let elementosPoloPassivo = doc.querySelectorAll('#poloPassivo .table tbody tr td');
    let poloPassivo = [];

    elementosPoloPassivo.forEach(elemento => {
      let texto = elemento.textContent;
      let padrao = /(.+?)(?: - (CPF|CNPJ): (\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{3}\.\d{3}\.\d{3}-\d{2}))?(?=\s*\(|\s*$)/;
      let resultado = padrao.exec(texto);
      // Obter os nomes dentro dos elementos <li>
      let nomesLi = [];
      let lis = elemento.querySelectorAll('ul.tree li');
      lis.forEach(li => {
          let nomeLi = extrairInformacoes(li.textContent.trim()); // ajuste conforme necessário para extrair apenas o nome relevante
          nomesLi.push(nomeLi);
      });
      if (resultado) {
        let documento = resultado[3] || 'Sem documento';
        let tipo = resultado[2] || 'Sem documento';
        poloPassivo.push({
          nome: resultado[1].trim(),
          documento: documento,
          tipo: tipo,
          representantes: nomesLi
        });
      } else {
        // Caso onde não há CPF ou CNPJ
        poloPassivo.push({
          nome: texto.trim(),
          documento: 'Sem documento',
          tipo: 'Sem documento',
          outrosNomes: nomesLi
        });
      }
    });

    return poloPassivo;
  };

  async function processAdd() {
    loading.value = true;
    
    const currentUrl = await new Promise(resolve => {
      chrome.runtime.sendMessage({ type: "GET_CURRENT_ROOT" }, response => {
        resolve(response);
      });
    });

    const data = buildData(process, filteredPeople, currentUrl);

    chrome.storage.local.get(['token'], function (result) {
      const token = result.token;
      console.log(data)

      addProcess(data, token)
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

  return { 
    deletePerson, 
    process, 
    processExists, 
    OnlyThoseIRepresent,
    filteredPeople,
    processAdd,
    loading,
    errorMessage
  };
}
});


</script>

<style scoped>
/* Your component's styles go here */
</style>