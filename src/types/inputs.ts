import type { TextFieldProps } from '@mui/material/TextField';

export type InputChangeHandler = (value: string) => void;
type BaseInputProps = Omit<TextFieldProps, 'value' | 'onChange' | 'variant'>;

export type TextInputProps = BaseInputProps & {
  value: string;
  onChange: InputChangeHandler;
  variant?: 'outlined';
};

export type SelectOption = Readonly<{
  value: string;
  label: string;
  disabled?: boolean;
}>;

export type SelectInputProps = Omit<BaseInputProps, 'select'> & {
  value: string;
  onChange: InputChangeHandler;
  options: ReadonlyArray<SelectOption>;
  variant?: 'outlined';
  placeholder?: string;
};

export type PasswordInputProps = Omit<BaseInputProps, 'type' | 'select'> & {
  value: string;
  onChange: InputChangeHandler;
  variant?: 'outlined';
  showVisibilityToggle?: boolean;
};
