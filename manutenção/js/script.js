// Removed <script> tag as it does not belong in a .js file
// Utility Functions
function showPage(pageId) {
  document.querySelectorAll('.container').forEach(container => {
    container.style.display = 'none';
  });
  document.getElementById(pageId).style.display = 'block';
  // Mostrar botão de novo veículo só na página de veículos
  const btnNovoVeiculo = document.getElementById('btnNovoVeiculo');
  if (btnNovoVeiculo) {
    btnNovoVeiculo.style.display = (pageId === 'vehicleListPage') ? 'inline-block' : 'none';
  }
  // Atualizar cards ao entrar na página de veículos
  if (pageId === 'vehicleListPage') {
    atualizarCardsVeiculos();
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  
  document.getElementById('lengthCheck').classList.toggle('valid', hasLength);
  document.getElementById('upperCheck').classList.toggle('valid', hasUpper);
  document.getElementById('numberCheck').classList.toggle('valid', hasNumber);
  document.getElementById('specialCheck').classList.toggle('valid', hasSpecial);
  
  return hasLength && hasUpper && hasNumber && hasSpecial;
}

function abrirImagemTelaCheia(url) {
  const modal = document.createElement('div');
  modal.className = 'modal-imagem';
  modal.innerHTML = `
    <div class='modal-overlay'></div>
    <img src='${url}' class='modal-img' />
    <button class='modal-close'>&times;</button>
  `;
  document.body.appendChild(modal);
  modal.querySelector('.modal-close').onclick = () => modal.remove();
  modal.querySelector('.modal-overlay').onclick = () => modal.remove();
}

function editarVeiculo(index) {
  const v = vehicles[index];
  document.getElementById('marca').value = v.marca;
  document.getElementById('modelo').value = v.modelo;
  document.getElementById('placa').value = v.placa;
  document.getElementById('ano').value = v.ano;
  document.getElementById('foto').value = v.foto;
  vehicles.splice(index, 1);
  showPage('vehicleFormPage');
}

function excluirVeiculo(index) {
  if (confirm('Deseja realmente excluir este veículo?')) {
    vehicles.splice(index, 1);
    atualizarCardsVeiculos();
  }
}

// Event Listeners
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  const password = e.target.querySelector('input[type="password"]').value;
  
  if (validateEmail(email) && password.length > 0) {
    showPage('homePage');
  } else {
    alert('Email ou senha inválidos');
  }
});

document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('recoveryEmail').value;
  const errorElement = document.getElementById('recoveryEmailError');
  const successElement = document.getElementById('recoverySuccess');
  
  if (!validateEmail(email)) {
    errorElement.style.display = 'block';
    successElement.style.display = 'none';
    return;
  }
  
  errorElement.style.display = 'none';
  successElement.style.display = 'block';
  
  setTimeout(() => {
    showPage('loginPage');
  }, 2000);
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  let hasError = false;
  
  if (name.length < 3) {
    document.getElementById('nameError').style.display = 'block';
    hasError = true;
  } else {
    document.getElementById('nameError').style.display = 'none';
  }
  
  if (!validateEmail(email)) {
    document.getElementById('emailError').style.display = 'block';
    hasError = true;
      } else {
    document.getElementById('emailError').style.display = 'none';
  }

  if (!validatePassword(password)) {
    hasError = true;
  }
  
  if (password !== confirmPassword) {
    document.getElementById('passwordError').style.display = 'block';
    hasError = true;
  } else {
    document.getElementById('passwordError').style.display = 'none';
  }
  
  if (!hasError) {
    document.getElementById('registerSuccess').style.display = 'block';
    setTimeout(() => {
      showPage('loginPage');
    }, 2000);
  }
});

document.getElementById('password').addEventListener('input', function(e) {
  validatePassword(e.target.value);
});

// Initial page load
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  
  if (page === 'forgot') {
    showPage('forgotPasswordPage');
  } else if (page === 'register') {
    showPage('registerPage');
  } else {
    showPage('loginPage');
  }
});

// Cadastro de veículos
const vehicleForm = document.getElementById('vehicleForm');
const vehicleSuccess = document.getElementById('vehicleSuccess');
const btnNovoVeiculo = document.getElementById('btnNovoVeiculo');
const vehicleCards = document.getElementById('vehicleCards');

let vehicles = [];

if (btnNovoVeiculo && vehicleForm) {
  btnNovoVeiculo.addEventListener('click', function() {
    showPage('vehicleFormPage');
  });
}

if (vehicleForm) {
  vehicleForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const marca = document.getElementById('marca').value.trim();
    const modelo = document.getElementById('modelo').value.trim();
    const placa = document.getElementById('placa').value.trim().toUpperCase();
    const ano = document.getElementById('ano').value.trim();
    const foto = document.getElementById('foto').value.trim();

    if (!marca || !modelo || !placa || !ano || !foto) return;

    vehicles.push({ marca, modelo, placa, ano, foto });
    vehicleForm.reset();
    showPage('vehicleListPage');
    vehicleSuccess.style.display = 'block';
    setTimeout(() => { vehicleSuccess.style.display = 'none'; }, 2000);
  });
}

function atualizarCardsVeiculos() {
  if (!vehicleCards) return;
  vehicleCards.innerHTML = '';
  if (vehicles.length === 0) {
    vehicleCards.innerHTML = '<p style="color:#888;">Nenhum veículo cadastrado.</p>';
    return;
  }
  vehicles.forEach((v, i) => {
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    card.innerHTML = `
      <div class='vehicle-photo'>${v.foto ? `<img src='${v.foto}' alt='Foto' style='max-width:100px;max-height:70px;border-radius:8px;cursor:pointer;' onclick='abrirImagemTelaCheia(\'${v.foto}\')'>` : ''}</div>
      <div class='vehicle-info'>
        <strong>${v.marca} ${v.modelo}</strong><br>
        <span>Placa: ${v.placa}</span><br>
        <span>Ano: ${v.ano}</span>
      </div>
      <div class='vehicle-actions' style='margin-top:10px;'>
        <button class='edit-btn' onclick='editarVeiculo(${i})'>Editar</button>
        <button class='delete-btn' onclick='excluirVeiculo(${i})'>Excluir</button>
      </div>
    `;
    vehicleCards.appendChild(card);
  });
}