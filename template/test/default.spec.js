/*eslint-disable*/
import { expect } from 'chai'
import { shallow } from '@vue/test-utils'
import index from '../src/pages/index.vue'
describe('index.vue', () => {
    const wrapper = shallow (index)
    it(('Should contain img tag'), () => {
      expect(wrapper.contains('img')).to.be.true
    })
})