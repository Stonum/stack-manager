import { mount } from '@vue/test-utils';
import { expect, describe, it, vi, beforeEach } from 'vitest';
import BaseInputFile from '../BaseInputFile.vue';

vi.mock('#preload', () => {
  return {
    ipcRenderer: {
      invoke: () => { return '/home/dir'; },
      on: () => { }
    }
  };
});


describe('BaseInputFile', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = mount(BaseInputFile, {
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

  it('select file', async () => {
    const btn = wrapper.get('.mdi-file-document-outline');

    await btn.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('/home/dir');
  });
});
