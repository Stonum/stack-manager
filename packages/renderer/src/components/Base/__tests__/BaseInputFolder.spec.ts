import { mount } from '@vue/test-utils';
import { expect, describe, it, vi, beforeEach } from 'vitest';
import BaseInputFolder from '../baseinputFolder.vue';

vi.mock('#preload', () => {
  return {
    ipcRenderer: {
      invoke: () => {
        return '/home/dir';
      }
    }
  };
});


describe('BaseInputFolder', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = mount(BaseInputFolder, {
      props: {
        label: 'Test',
        required: true,
        filter: {}
      },
    });
  });

  it(`label required`, () => {
    const label = wrapper.get('.v-label');
    expect(label.text()).toBe('Test*');
  });

  it('select folder', async () => {
    const btn = wrapper.get('.mdi-folder-outline');

    await btn.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('/home/dir');
  });
});
