// Exp 2: Client-Side Form Validation JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const fields = {
        fullName: document.getElementById('fullName'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        dob: document.getElementById('dob'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirmPassword'),
        terms: document.getElementById('terms')
    };
    const togglePassword = document.getElementById('togglePassword');
    const strengthBar = document.getElementById('strengthBar');
    const successBox = document.getElementById('successBox');

    // Toggle Password Visibility
    togglePassword.addEventListener('click', () => {
        const isPwd = fields.password.type === 'password';
        fields.password.type = isPwd ? 'text' : 'password';
        togglePassword.className = `fa-solid ${isPwd ? 'fa-eye-slash' : 'fa-eye'} toggle-pwd`;
    });

    // Helper: Show Error / Success
    const setError = (fieldKey, message) => {
        const group = document.getElementById(`group-${fieldKey}`);
        group.className = 'form-group error';
        group.querySelector('.error-msg').innerText = message;
        return false;
    };

    const setSuccess = (fieldKey) => {
        const group = document.getElementById(`group-${fieldKey}`);
        group.className = 'form-group success';
        group.querySelector('.error-msg').innerText = '';
        return true;
    };

    // Validation Handlers
    const checkFullName = () => {
        const val = fields.fullName.value.trim();
        if (!val) return setError('fullname', 'Full Name is required');
        if (val.length < 3) return setError('fullname', 'Name must be at least 3 characters');
        if (!/^[a-zA-Z\s]+$/.test(val)) return setError('fullname', 'Name can only contain letters');
        return setSuccess('fullname');
    };

    const checkEmail = () => {
        const val = fields.email.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val) return setError('email', 'Email Address is required');
        if (!regex.test(val)) return setError('email', 'Enter a valid email address');
        return setSuccess('email');
    };

    const checkPhone = () => {
        const val = fields.phone.value.trim();
        if (!val) return setError('phone', 'Phone Number is required');
        if (!/^[0-9]{10}$/.test(val)) return setError('phone', 'Enter a valid 10-digit phone number');
        return setSuccess('phone');
    };

    const checkDOB = () => {
        const val = fields.dob.value;
        if (!val) return setError('dob', 'Date of Birth is required');
        const birthDate = new Date(val);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        if (age < 18) return setError('dob', 'You must be at least 18 years old');
        return setSuccess('dob');
    };

    const checkPassword = () => {
        const val = fields.password.value;
        if (!val) {
            strengthBar.className = 'strength-bar';
            return setError('password', 'Password is required');
        }
        
        // Password Strength calculation
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;

        strengthBar.className = 'strength-bar ' + (score === 1 ? 'strength-weak' : score === 2 ? 'strength-medium' : 'strength-strong');

        if (val.length < 8) return setError('password', 'Password must be at least 8 characters');
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val)) return setError('password', 'Must contain uppercase, lowercase & numbers');
        
        return setSuccess('password');
    };

    const checkConfirmPassword = () => {
        const val = fields.confirmPassword.value;
        if (!val) return setError('confirmPassword', 'Please confirm your password');
        if (val !== fields.password.value) return setError('confirmPassword', 'Passwords do not match');
        return setSuccess('confirmPassword');
    };

    const checkTerms = () => {
        if (!fields.terms.checked) return setError('terms', 'You must accept the terms & conditions');
        return setSuccess('terms');
    };

    // Real-Time Event Listeners
    fields.fullName.addEventListener('input', checkFullName);
    fields.email.addEventListener('input', checkEmail);
    fields.phone.addEventListener('input', checkPhone);
    fields.dob.addEventListener('change', checkDOB);
    fields.password.addEventListener('input', () => { checkPassword(); if (fields.confirmPassword.value) checkConfirmPassword(); });
    fields.confirmPassword.addEventListener('input', checkConfirmPassword);
    fields.terms.addEventListener('change', checkTerms);

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isFullNameValid = checkFullName();
        const isEmailValid = checkEmail();
        const isPhoneValid = checkPhone();
        const isDOBValid = checkDOB();
        const isPasswordValid = checkPassword();
        const isConfirmValid = checkConfirmPassword();
        const isTermsValid = checkTerms();

        const isFormValid = isFullNameValid && isEmailValid && isPhoneValid && isDOBValid && isPasswordValid && isConfirmValid && isTermsValid;

        if (isFormValid) {
            successBox.classList.remove('hidden');
            form.reset();
            strengthBar.className = 'strength-bar';
            document.querySelectorAll('.form-group').forEach(g => g.className = 'form-group');
        } else {
            successBox.classList.add('hidden');
        }
    });

    // Reset Handler
    form.addEventListener('reset', () => {
        document.querySelectorAll('.form-group').forEach(g => g.className = 'form-group');
        strengthBar.className = 'strength-bar';
        successBox.classList.add('hidden');
    });
});
