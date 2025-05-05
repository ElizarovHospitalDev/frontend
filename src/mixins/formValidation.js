export default {
  data() {
    return {
      errors: {},
      isFormValid: false
    };
  },
  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    validateRequired(value) {
      return value && value.trim().length > 0;
    },
    validatePassword(password) {
      return password && password.length >= 6;
    },
    clearErrors() {
      this.errors = {};
    },
    setError(field, message) {
      this.errors[field] = message;
    },
    validateForm() {
      this.clearErrors();
      let isValid = true;

      if (this.rules) {
        Object.keys(this.rules).forEach(field => {
          const value = this.formData[field];
          const rules = this.rules[field];

          rules.forEach(rule => {
            if (!rule.validator(value)) {
              this.setError(field, rule.message);
              isValid = false;
            }
          });
        });
      }

      this.isFormValid = isValid;
      return isValid;
    }
  }
}; 