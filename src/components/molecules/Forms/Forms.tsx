import React, { FC, Fragment } from 'react';
import { FormProps } from '../../shared';
import { webchatProps } from '../../WebChat/webchat.interface';

interface Props {
  formFields: FormProps[];
}

export const Forms: FC<webchatProps & Props> = function (
  { formFields }, // { fields }
) {
  return (
    <>
      {formFields.map((field) => (
        <>
          <div key={field.name} className="form-field-name-bot__ewc-class">
            {field.name}
          </div>
          <input
            className="form-field-bot__ewc-class"
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            autoComplete="off"
          />
        </>
      ))}
    </>
  );
};
