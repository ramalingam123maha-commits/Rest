// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.innerHTML = '<span class="eye-icon">👁️‍🗨️</span>';
    } else {
        passwordInput.type = 'password';
        toggleBtn.innerHTML = '<span class="eye-icon">👁️</span>';
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    successText.textContent = message;
    successDiv.style.display = 'flex';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 4000);
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 4000);
}

// Close message
function closeMessage() {
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
}

// Handle form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    // Validation
    if (!email) {
        showError('Please enter your email address');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (!password) {
        showError('Please enter your password');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    // Simulate login API call
    const loginBtn = event.target.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Signing in...';
    loginBtn.disabled = true;
    
    setTimeout(() => {
        // Demo: Simple validation (in real app, call backend API)
        if (email === 'demo@example.com' && password === 'password123') {
            showSuccess('Login successful! Redirecting...');
            
            // Save remember me preference
            if (rememberMe) {
                localStorage.setItem('rememberEmail', email);
            } else {
                localStorage.removeItem('rememberEmail');
            }
            
            // Simulate redirect
            setTimeout(() => {
                window.location.href = '/dashboard'; // Change to your dashboard URL
            }, 1500);
        } else {
            showError('Invalid email or password');
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        }
    }, 1500);
}

// Handle social login
function handleSocialLogin(provider) {
    showSuccess(`Signing in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`);
    console.log(`Social login with ${provider} initiated`);
    
    // In a real application, this would redirect to the OAuth provider
    // For demo purposes, we just show a message
    setTimeout(() => {
        showSuccess(`${provider} login would redirect here`);
    }, 1500);
}

// Load remembered email on page load
document.addEventListener('DOMContentLoaded', function() {
    const rememberEmail = localStorage.getItem('rememberEmail');
    if (rememberEmail) {
        document.getElementById('email').value = rememberEmail;
        document.getElementById('remember').checked = true;
    }
    
    // Demo credentials hint
    console.log('Demo credentials: demo@example.com / password123');
});

// Enter key to submit form
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('password').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }
    });
});
