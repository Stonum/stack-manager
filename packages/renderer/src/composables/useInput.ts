import { computed } from 'vue';

export const useInput = (props: { required: boolean, rules: any[], label: string }) => {

  const inputRules = computed<any[]>(() => {
    const rules = props.rules;
    if (props.required) {
      rules.push((value: string): boolean | string => {
        return !!value || 'Поле не может быть пустым';
      });
    }
    return rules;
  });

  const inputLabel = computed<string>(() => {
    return props.label && props.required ? props.label + '*' : props.label;
  });

  return {
    inputRules,
    inputLabel
  };
};