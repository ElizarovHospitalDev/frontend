import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import ForgotPasswordPage from '@/views/ForgotPasswordPage.vue';
import PatientPage from '@/views/PatientPage.vue';
import AddPatientPage from '@/views/AddPatientPage.vue';
import PatientDetailPage from '@/views/PatientDetailPage.vue';
import ProsthesisInfo from '@/views/PatientProtes.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordPage
  },
  {
    path: '/patients',
    name: 'Patients', 
    component: PatientPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/add-patient',
    name: 'AddPatient',
    component: AddPatientPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/patients/:id',
    name: 'PatientDetail',
    component: PatientDetailPage,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/patients/:id/prosthesis',
    name: 'ProsthesisInfo',
    component: ProsthesisInfo,
    meta: { requiresAuth: true },
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    if (isAuthenticated && to.path === '/') {
      next({ path: '/patients' });
    } else {
      next();
    }
  }
});

export default router;