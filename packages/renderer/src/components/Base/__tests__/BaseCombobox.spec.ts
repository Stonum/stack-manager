import { mount } from '@vue/test-utils';
import { expect, describe, it, beforeEach } from 'vitest';
import BaseCombobox from '../BaseCombobox.vue';

describe('BaseCombobox', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = mount(BaseCombobox, {
      props: {
        label: 'Test',
        items: [
          'Test1',
          'Test2',
          'Test3',
        ],
        modelValue: 'Test1'
      },
    });
  });

  it('initialize model value', () => {
    expect(wrapper.html()).toContain('Test1');
  });

  it('change value', async () => {
    await wrapper.setProps({ modelValue: 'Test3' });
    expect(wrapper.html()).toContain('Test3');
  });
});
