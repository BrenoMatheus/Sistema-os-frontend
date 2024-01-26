import * as React from 'react';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useField } from '@unform/core';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';

type TVTextFieldProps = DatePickerProps<any> & {
  name: string;
}

export const VDateField: React.FC<TVTextFieldProps> = ({ name, ...rest }) => {

  const { fieldName, registerField, defaultValue} = useField(name);

  const [value, setValue] = useState<Dayjs | null>(defaultValue || '');

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, value) => setValue(value),
    });
  }, [registerField, fieldName, value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker 
          {...rest}
          value={dayjs(value)}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};
