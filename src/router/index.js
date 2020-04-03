import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Lights from '../views/Lights.vue';
import Camera from '../views/Camera.vue';
import Character from "../views/Character";
import Word from "../views/Word";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/lights',
    name: 'lights',
    component: Lights,
  },
  {
    path: '/camera',
    name: 'camera',
    component: Camera,
  },
  {
    path: '/character',
    name: 'character',
    component: Character,
  },
  {
    path: '/word',
    name: 'word',
    component: Word,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router
