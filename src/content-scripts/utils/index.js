export function buildData(process, filteredPeople, currentUrl) {
  return {
    process_num: process.value.number,
    jurisdiction: process.value.jurisdiction,
    people: filteredPeople,
    autuacao: process.value.autuacao,
    details: process.value.details, // tutelaDeUrgencia, classeJudicial, valorDaCausa, assuntos
    current_url: currentUrl
  };
}