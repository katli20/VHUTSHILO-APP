window.onload = function() {
  const logo = document.querySelector('.logo-container');
  logo.style.opacity = 0;
  logo.style.transform = 'translateY(-20px)';
  setTimeout(() => {
    logo.style.transition = 'all 0.8s ease';
    logo.style.opacity = 1;
    logo.style.transform = 'translateY(0)';
  }, 200);
};

function goToDashboard() {
  window.location.href = "dashboard.html";
}

function goToSignup() {
  window.location.href = "signup.html";
}

// User management functions
function saveUser(userData) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  users.push(userData);
  localStorage.setItem('users', JSON.stringify(users));
}

function findUser(phone, password) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.find(user => user.phone === phone && user.password === password);
}

// Form handling functions
function handleSignup(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const userData = {
    name: formData.get('name'),
    location: formData.get('location'),
    farmingType: formData.get('farmingType'),
    phone: formData.get('phone'),
    password: formData.get('password')
  };
  
  // Check if user already exists
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const userExists = existingUsers.find(user => user.phone === userData.phone);
  
  if (userExists) {
    showMessage('User with this phone number already exists!', 'error');
    return;
  }
  
  // Save user and redirect
  saveUser(userData);
  showMessage('Account created successfully! Redirecting...', 'success');
  
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1500);
}

function handleLogin(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const phone = formData.get('phone');
  const password = formData.get('password');
  
  const user = findUser(phone, password);
  
  if (user) {
    // Save current user session
    localStorage.setItem('currentUser', JSON.stringify(user));
    showMessage('Login successful! Redirecting...', 'success');
    
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  } else {
    showMessage('Invalid phone number or password!', 'error');
  }
}

function showMessage(message, type) {
  const messageDiv = document.getElementById('form-message');
  messageDiv.textContent = message;
  messageDiv.className = `form-message ${type}`;
  
  // Clear message after 3 seconds
  setTimeout(() => {
    messageDiv.textContent = '';
    messageDiv.className = 'form-message';
  }, 3000);
}

// Check if user is logged in (for dashboard protection)
function checkAuth() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = 'index.html';
  }
}

// Logout function
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Initialize forms when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Signup form
  const signupForm = document.querySelector('.signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  // Login form
  const loginForm = document.querySelector('.signup-form');
  if (loginForm && window.location.pathname.includes('login.html')) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Check auth for dashboard
  if (window.location.pathname.includes('dashboard.html')) {
    checkAuth();
  }
});

