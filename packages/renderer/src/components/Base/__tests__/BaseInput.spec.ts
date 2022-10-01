import { mount } from '@vue/test-utils';
import { expect, describe, it, beforeEach } from 'vitest';
import BaseInput from '../BaseInput.vue';

describe('BaseInput', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = mount(BaseInput, {
      props: {
        label: 'Test',
        required: true,
        modelValue: 'text'
      },
    });
  });

  it(`label required`, () => {
    const label = wrapper.get('.v-label');
    expect(label.text()).toBe('Test*');
  });

  it('initialize model value', () => {
    const input = wrapper.get('input').element;
    expect(input.value).toBe('text');
  });
});
