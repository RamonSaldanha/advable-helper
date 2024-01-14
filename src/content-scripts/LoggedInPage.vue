<template>
  <div>
    <h1>Bem-vindo!</h1>
    <p>Você está logado.</p>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoggedInPage",
});
</script>

<style scoped>
h1 {
  color: #333;
}
</style>