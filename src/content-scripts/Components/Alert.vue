<template>
  <div v-if="visible" class="adble-alert-yellow">
    <div class="alert-content">
      <div>{{ message }}</div>
      <span class="close" @click="visible = false">&times;</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.adble-alert-yellow{
  padding: .8rem;
  background-color: #f9d71c; /* Cor amarela */
  color: black;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  .alert-content{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .close{
    cursor: pointer;
    margin-left: 1rem;
  }
}

</style>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    message: {
      type: String,
      required: true
    }
  },
  setup() {
    const visible = ref(true);

    return {
      visible
    };
  }
});
</script>