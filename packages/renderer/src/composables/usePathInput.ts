import { fs } from '#preload';

export const usePathInput = (props: { modelValue?: string | undefined }) => {

  const isExistsPath = () => {
    return !props.modelValue || fs.existsSync(props.modelValue as any) || 'Указанный путь не существует';
  };

  return {
    inputRules: [isExistsPath]
  };
};