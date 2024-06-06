<template>
  <div>
    <div v-for="(polo, poloName) in partesProcesso" :key="poloName">
      <h2>{{ poloName }}</h2>
      <div v-for="(parte, index) in polo" :key="index">
        <h3>{{ parte.nome }}</h3>
        <p><strong>Documento:</strong> {{ parte.documento }}</p>
        <p><strong>Tipo:</strong> {{ parte.tipo }}</p>
        <p><strong>Endereço:</strong> {{ parte.endereco }}</p>
        <p><strong>Representantes:</strong> {{ parte.representantes.join(', ') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PartesProcesso',
  props: {
    partesProcesso: {
      type: Object,
      required: true
    }
  }
}
</script>