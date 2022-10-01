import { computed } from 'vue';

export const useInput = (props: { required?: boolean, rules?: any[], label?: string }) => {

  const inputRules = computed<any[]>(() => {
    const rules = props.rules || [];
    if (props.required) {
      rules.push((value: string): boolean | string => {
        return !!value || 'Поле не может быть пустым';
      });
    }
    return rules;
  });

  const inputLabel = computed<string>((): string => {
    if (props.label) {
      return props.required ? props.label + '*' : props.label;
    } else {
      return '';
    }
  });

  return {
    inputRules,
    inputLabel
  };
};