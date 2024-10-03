// JavaScript om wachtwoord zichtbaar/onzichtbaar te maken
const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');

togglePassword.addEventListener('click', function () {
    // Wissel het type van het wachtwoordveld
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    
    // Wissel het slotpictogram tussen gesloten en open
    this.classList.toggle('bxs-lock-alt');
    this.classList.toggle('bxs-lock-open');
});
