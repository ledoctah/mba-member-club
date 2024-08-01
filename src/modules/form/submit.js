import { loadCard } from '../cards/loadCard';

const form = document.querySelector('form');
const cardInput = document.querySelector('#card-id');

form.onsubmit = async evt => {
  evt.preventDefault();

  const clientId = cardInput.value;

  await loadCard({ clientId });

  cardInput.value = '';
};
