<template>
  <div class="label-component">
    <div class="adble-label-title">{{ title }}</div>
    <div class="adble-label-value">{{ value }}</div>
  </div>
</template>

<script>
export default {
  name: 'Label',
  props: {
    title: {
      type: String,
      default: 'Não declarado'
    },
    value: {
      type: String,
      default: 'Não declarado'
    }
  }
};
</script>

<style scoped>
.label-component {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 0;
}
.adble-label-title{
  font-size: 1em;
  font-weight: bold;
}
.adble-label-value{
  font-size: 1em;
  font-weight: normal;
}
</style>