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
        <label class="adble-label" for="processNumber">Número do processo:</label><br>
        <input class="adble-input" type="text" id="processNumber" name="processNumber" v-model="process.number"><br>

        <label class="adble-label" for="jurisdiction">Jurisdição</label><br>
        <input class="adble-input" type="text" id="jurisdiction" name="jurisdiction" v-model="process.jurisdiction"><br>

        <!-- Restante do formulário aqui -->

        <details class="adble-details">
          <summary class="adble-summary">Partes no processo</summary>

          <div class="adble-person" v-for="(person, index) in process.people" :key="index">
            <span class="adble-name">
              {{ person.nome }}
              <small>{{ person.documento }}</small>
            </span>
            <span class="adble-badge">{{ person.polo }}</span>
            <button class="adble-delete-button" @click="deletePerson(index)">Deletar</button>
          </div>

        </details>

        <input class="adble-button" type="submit" value="Cadastrar">
      </form>
    </div>
</template>
<script>
import { defineComponent, ref, onMounted } from "vue"; // Adicione 'computed' aqui
import { getProcess } from './getProcess';

export default defineComponent({
  name: "processPage",
  setup() {

    const process = ref({
      number: "",
      jurisdiction: "",
      people: [],
      autuacao: "",
    });

    const processExists = ref(false);

    onMounted(async () => {
      const htmlContent = await new Promise(resolve => {
        chrome.runtime.sendMessage({ type: "GET_HTML_CONTENT" }, response => {
          resolve(response);
        });
      });

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      process.value.number = getNumeroProcesso(doc);
      process.value.jurisdiction = getOrgaoJulgador(doc);
      process.value.autuacao = getAutuacao(doc);

      const poloAtivo = getPoloAtivo(doc).map(person => ({ ...person, polo: 'Ativo' }));
      const poloPassivo = getPoloPassivo(doc).map(person => ({ ...person, polo: 'Passivo' }));

      process.value.people = [...poloAtivo, ...poloPassivo];
      
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

    const getPoloAtivo = (doc) => {
      let elementosPoloAtivo = doc.querySelectorAll('#poloAtivo .table tbody tr td');
      let poloAtivo = [];

      elementosPoloAtivo.forEach(elemento => {
        let texto = elemento.textContent;
        let padrao = /(.+?)(?: - (CPF|CNPJ): (\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{3}\.\d{3}\.\d{3}-\d{2}))?(?=\s*\(|\s*$)/;
        let resultado = padrao.exec(texto);

        if (resultado) {
          let documento = resultado[3] || 'Sem documento';
          let tipo = resultado[2] || 'Sem documento';
          poloAtivo.push({
            nome: resultado[1].trim(),
            documento: documento,
            tipo: tipo
          });
        } else {
          // Caso onde não há CPF ou CNPJ
          poloAtivo.push({
            nome: texto.trim(),
            documento: 'Sem documento',
            tipo: 'Sem documento'
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

        if (resultado) {
          let documento = resultado[3] || 'Sem documento';
          let tipo = resultado[2] || 'Sem documento';
          poloPassivo.push({
            nome: resultado[1].trim(),
            documento: documento,
            tipo: tipo
          });
        } else {
          // Caso onde não há CPF ou CNPJ
          poloPassivo.push({
            nome: texto.trim(),
            documento: 'Sem documento',
            tipo: 'Sem documento'
          });
        }
      });

      return poloPassivo;
    };

    return { deletePerson, process, processExists };
  }
});


</script>

<style scoped>
/* Your component's styles go here */
</style>
