import { MutationTree } from 'vuex';
import { ExampleStateInterface } from './state';

export default {
  someMutation (state: ExampleStateInterface) {
    // your code
  }
} as MutationTree<ExampleStateInterface>;
