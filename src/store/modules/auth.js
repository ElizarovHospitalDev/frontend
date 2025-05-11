// ... existing code ...
actions: {
  login({ commit }, credentials) {
    // ... login logic ...
    
    // Обновляем путь с /dashboard на /patients
    router.push('/patients');
  }
}
// ... existing code ...