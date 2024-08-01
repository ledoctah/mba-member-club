document.addEventListener('DOMContentLoaded', () => {
  const rewardDialog = document.querySelector('#reward-dialog');

  function closeModal() {
    rewardDialog.close();
  }

  rewardDialog.querySelector('section button').onclick = () => closeModal();
  rewardDialog.onclick = e => {
    if (e.target.id === 'reward-dialog') {
      closeModal();
    }
  };
});
