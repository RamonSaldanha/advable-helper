<template>
  <div class="adble-tasks">
    <Alert v-if="errorMessage" :message="errorMessage" />
    <Loading v-if="loading" />
    <h5>Tarefas associadas</h5>
    <ul>
      <li v-for="(task, index) in tasks" :key="task.id">
        <input type="checkbox" class="adble-checkbox" :id="'task-' + task.id" v-model="task.completed" @change="toggleTaskCompletion(task)">
        <label :for="'task-' + task.id">{{ index + 1 }}. {{ task.title }}</label>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.adble-checkbox {
  margin-right: 20px;
}
</style>

<script setup>
import { ref } from 'vue';

import Loading from '../components/Loading.vue';
import Alert from '../components/Alert.vue';
import {toggleCompletedTask} from '../toggleCompletedTask.js';

const loading = ref(false);

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  },
  processId: {
    type: Number,
    required: true
  }
});

const toggleTaskCompletion = (task) => {
  console.log('Toggling task completion:', task);
  loading.value = true;
    console.log(task)
  
    chrome.storage.local.get(['token'], function (result) {
      const token = result.token;
      toggleCompletedTask(task, token)
        .then(data => {
          loading.value = false;
        })
        .catch(error => {
          loading.value = false; // Adicione esta linha
          errorMessage.value = "Algum erro ao mudar o status da tarefa";
        });

    });
  // Aqui você pode adicionar lógica adicional, como atualizar o estado no servidor
};
</script>