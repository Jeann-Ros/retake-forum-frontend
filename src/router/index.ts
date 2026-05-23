import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import UserProfileView from "../views/UserProfileView.vue";
import CreateContentView from "../views/CreateContentView.vue";
import DetailView from "../views/DetailView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/perfil",
    name: "profile",
    component: UserProfileView,
  },
  {
    path: "/criar/:tipo",
    name: "create-content",
    component: CreateContentView,
  },
  {
    path: "/detalhe/:tipo/:id",
    name: "detail",
    component: DetailView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
