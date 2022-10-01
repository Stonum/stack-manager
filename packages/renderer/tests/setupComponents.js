import { config } from '@vue/test-utils';

// import AppBar from '@/components/App/AppBar.vue';

import BaseInput from '@/components/Base/BaseInput.vue';
// import BaseInputFolder from '@/components/Base/BaseInputFolder.vue';
// import BaseInputFile from '@/components/Base/BaseInputFile.vue';
// import BaseCombobox from '@/components/Base/BaseCombobox.vue';
// import BaseInputHistory from '@/components/Base/BaseInputHistory.vue';
// import BaseCheckbox from '@/components/Base/BaseCheckbox.vue';


config.global.components = {
  'base-input': BaseInput,
};