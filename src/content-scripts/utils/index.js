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

export async function waitForElement(selector, delay = 50, tries = 20) {
  const element = document.querySelector(selector);
  if (element) {
    return element;
  } else if (tries - 1 > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
    return waitForElement(selector, delay, tries - 1);
  } else {
    throw new Error('Element not found');
  }
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}