import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import ForgotPasswordPage from '@/views/ForgotPasswordPage.vue';
import PatientPage from '@/views/PatientPage.vue';
import AddPatientPage from '@/views/AddPatientPage.vue';
import PatientDetailPage from '@/views/PatientDetailPage.vue';
import ProsthesisInfo from '@/views/PatientProtes.vue';
import PatientComorbidPathologies from '@/views/PatientComorbidPathologies.vue';
import PatientMicroflora from '@/views/PatientMicroflora.vue';
import PatientOperations from '@/views/PatientOperations.vue';
import PatientAnalysis from '@/views/PatientAnalysis.vue';
import PatientOutcomes from '@/views/PatientOutcomes.vue';
import PatientTreatment from '@/views/PatientTreatment.vue';

const routes = [
  {
    path: '/',
    redirect: '/login' // Перенаправление с корня на /login
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { requiresAuth: false }
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
    props: route => ({ patientId: route.params.id })  
  },
  {
    path: '/patients/:id/comorbid-pathologies',
    name: 'PatientComorbidPathologies',
    component: PatientComorbidPathologies,
    meta: { requiresAuth: true },
    props: route => ({ patientId: route.params.id })
  },
  {
    path: '/patients/:id/microflora',
    name: 'PatientMicroflora',
    component: PatientMicroflora,
    meta: { requiresAuth: true },
    props: route => ({ patientId: route.params.id })
  },
  {
    path: '/patients/:id/operations',
    name: 'PatientOperations',
    component: PatientOperations,
    meta: { requiresAuth: true },
    props: route => ({ patientId: route.params.id })
 },
 {
    path: '/patients/:id/analysis',
    name: 'PatientAnalysis',
    component: PatientAnalysis,
    meta: { requiresAuth: true },
    props: route => ({ patientId: route.params.id })
 },
 {
    path: '/patients/:id/outcomes',
    name: 'PatientOutcomes',
    component: PatientOutcomes,
    meta: { requiresAuth: true },
    props: route => ({ patientId: route.params.id })
 },
 {
    path: '/patients/:id/treatment',
    name: 'PatientTreatment',
    component: PatientTreatment,
    meta: { requiresAuth: true },
    props: route => ({ patientId: route.params.id })
 },
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