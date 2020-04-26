import { GetterTree } from 'vuex';
import { StoreInterface } from '../index';
import { ExampleStateInterface } from './state';

export default {
  someGetter (/* state */) {
    // return state.prop;
  }
} as GetterTree<ExampleStateInterface, StoreInterface>;
