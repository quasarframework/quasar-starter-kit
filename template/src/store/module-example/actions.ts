import { ActionTree } from 'vuex';
import { StoreInterface } from '../index';
import { ExampleStateInterface } from './state';

export default {
  someAction (/* context */) {
    // your code
  }
} as ActionTree<ExampleStateInterface, StoreInterface>;
