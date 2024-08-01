import { AppError } from '../errors/AppError';

import { fetchClient } from '../services/fetchClient';

const main = document.querySelector('main.container');
const dialog = document.querySelector('dialog');

function buildUserInfo({ imageUrl, name, clientSince }) {
  const aside = document.createElement('aside');
  aside.classList.add('card', 'user-info');

  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');

  const image = document.createElement('img');
  image.setAttribute('src', imageUrl);
  image.setAttribute('alt', `Foto de ${name}`);

  imageContainer.append(image);

  const userAdditionalInfoContainer = document.createElement('div');

  const nameText = document.createElement('h1');
  nameText.innerText = name;

  const clientSinceText = document.createElement('p');
  clientSinceText.innerText = `Cliente desde ${clientSince}`;

  userAdditionalInfoContainer.append(nameText, clientSinceText);

  aside.append(imageContainer, userAdditionalInfoContainer);

  return aside;
}

function buildCardInfo({ id: clientId, loyaltyCard }) {
  const section = document.createElement('section');
  section.classList.add('card', 'card-info');

  const header = document.createElement('header');

  const headerTitleContainer = document.createElement('div');

  const headerTitle = document.createElement('h2');
  headerTitle.innerText = 'Cartão fidelidade';

  const headerDescription = document.createElement('p');
  headerDescription.innerText =
    'Ao fazer cortes de cabelo, o décimo sai de graça!';

  const tag = document.createElement('div');
  tag.classList.add('tag');
  tag.innerText = `ID: ${clientId}`;

  headerTitleContainer.append(headerTitle, headerDescription);

  header.append(headerTitleContainer, tag);

  const list = document.createElement('ul');

  Array.from({ length: loyaltyCard.cutsNeeded }).forEach((_, index) => {
    const listItem = document.createElement('li');

    const image = document.createElement('img');

    if (index < loyaltyCard.totalCuts) {
      image.setAttribute('src', './assets/check-color.svg');
      image.setAttribute('alt', 'Ícone de sucesso');

      listItem.append(image);
    } else if (index === loyaltyCard.cutsNeeded - 1) {
      image.setAttribute('src', './assets/gift-disabled.svg');
      image.setAttribute('alt', 'Ícone de presente');

      listItem.append(image);
    }

    list.append(listItem);
  });

  section.append(header, list);

  return section;
}

function buildNextReward({ loyaltyCard }) {
  const section = document.createElement('section');
  section.classList.add('card', 'next-reward');

  const rewardContainer = document.createElement('div');

  const rewardsRemaining = document.createElement('h3');
  rewardsRemaining.innerText = loyaltyCard.cutsRemaining;

  const rewardsSpan = document.createElement('span');
  rewardsSpan.innerText = ' cortes restantes';

  rewardsRemaining.append(rewardsSpan);

  const barContainer = document.createElement('div');

  const separator = document.createElement('hr');
  separator.style = `--reward-percentage: ${
    (loyaltyCard.totalCuts / loyaltyCard.cutsNeeded) * 100
  }%`;

  const remainingInfo = document.createElement('span');
  remainingInfo.innerText = `${loyaltyCard.totalCuts} de ${loyaltyCard.cutsNeeded}`;

  barContainer.append(separator, remainingInfo);

  rewardContainer.append(rewardsRemaining, barContainer);

  const img = document.createElement('img');
  img.setAttribute('src', './assets/gift-color.svg');
  img.setAttribute('alt', 'Ícone de presente');

  section.append(rewardContainer, img);

  return section;
}

function buildHistoryInfo({ appointmentHistory }) {
  const section = document.createElement('section');
  section.classList.add('card', 'history');

  const header = document.createElement('header');

  const headerTitle = document.createElement('h2');
  headerTitle.innerText = 'Histórico';

  const headerDescription = document.createElement('p');
  headerDescription.innerText = `${appointmentHistory.length} cortes`;

  header.append(headerTitle, headerDescription);

  const list = document.createElement('ul');

  appointmentHistory.forEach(item => {
    const listItem = document.createElement('li');

    const dateTimeContainer = document.createElement('div');

    const date = document.createElement('h3');
    date.innerText = item.date;

    const time = document.createElement('p');
    time.innerText = item.time;

    dateTimeContainer.append(date, time);

    const image = document.createElement('img');
    image.setAttribute('src', './assets/check.svg');
    image.setAttribute('alt', 'Ícone de sucesso');

    listItem.append(dateTimeContainer, image);

    list.append(listItem);
  });

  section.append(header, list);

  return section;
}

export async function loadCard({ clientId }) {
  try {
    const client = await fetchClient({ clientId });

    main.innerHTML = '';

    const userInfoContainer = buildUserInfo(client);
    const cardInfoContainer = buildCardInfo(client);
    const nextRewardContainer = buildNextReward(client);
    const historyContainer = buildHistoryInfo(client);

    main.append(
      userInfoContainer,
      cardInfoContainer,
      nextRewardContainer,
      historyContainer,
    );

    const { loyaltyCard } = client;

    if (loyaltyCard.totalCuts === loyaltyCard.cutsNeeded) {
      dialog.showModal();
    }
  } catch (e) {
    if (e instanceof AppError && e.status === 404) {
      // eslint-disable-next-line no-alert
      alert('O cartão não foi encontrado');
      return;
    }

    // eslint-disable-next-line no-console
    console.error(e);

    // eslint-disable-next-line no-alert
    alert('Ocorreu um erro ao carregar o cartão');
  }
}
