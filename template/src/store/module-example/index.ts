import { Module } from 'vuex';
import { StoreInterface } from '../index';
import state, { ExampleStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
} as Module<ExampleStateInterface, StoreInterface>;
