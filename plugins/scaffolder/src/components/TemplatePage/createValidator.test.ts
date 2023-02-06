/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createValidator } from './createValidator';
import { CustomFieldValidator } from '@backstage/plugin-scaffolder-react';
import { ApiHolder } from '@backstage/core-plugin-api';
import { FieldValidation, FormValidation } from '@rjsf/core';

describe('createValidator', () => {
  const validators: Record<string, undefined | CustomFieldValidator<unknown>> =
    {
      CustomPicker: (
        value: unknown,
        fieldValidation: FieldValidation,
        _context: { apiHolder: ApiHolder },
      ) => {
        if (!value || !(value as { value?: unknown }).value) {
          fieldValidation.addError('Error !');
        }
      },
      TagPicker: (
        values: unknown,
        fieldValidation: FieldValidation,
        _context: { apiHolder: ApiHolder },
      ) => {
        const input = values as string[];
        if (input.length === 0) {
          fieldValidation.addError('A tag name can not be empty');
        }
        for (const item of input) {
          if (!/^[a-z0-9-]+$/.test(item)) {
            fieldValidation.addError(
              'A tag name can only contain lowercase letters, numeric characters or dashes',
            );
          }
        }
      },
    };

  const apiHolderMock: jest.Mocked<ApiHolder> = {
    get: jest.fn().mockImplementation(() => {
      return null;
    }),
  };

  const context = {
    apiHolder: apiHolderMock,
  };

  it('Should call validator for object property from a custom field extension', () => {
    /* GIVEN */
    const rootSchema = {
      title: 'Title',
      properties: {
        p1: {
          title: 'PropertyOn',
          type: 'object',
          'ui:field': 'CustomPicker',
        },
      },
    };
    const validator = createValidator(rootSchema, validators, context);

    const formData = {
      p1: {},
    };
    const errors = {
      addError: jest.fn(),
      p1: {
        addError: jest.fn(),
      } as unknown as FormValidation,
    } as unknown as FormValidation;

    /* WHEN */
    const result = validator(formData, errors);

    /* THEN */
    expect(result).not.toBeNull();
    expect(result.p1.addError).toHaveBeenCalledTimes(1);
  });

  it('Should call validator for array property from a custom field extension', () => {
    /* GIVEN */
    const rootSchema = {
      title: 'My form',
      properties: {
        tags: {
          title: 'Tags',
          type: 'array',
          items: {
            type: 'string',
            'ui:field': 'TagPicker',
          },
        },
      },
    };
    const validator = createValidator(rootSchema, validators, context);

    const formData = {
      tags: ['invalid-tag$$'],
    };
    const errors = {
      addError: jest.fn(),
      tags: {
        addError: jest.fn(),
      } as unknown as FormValidation,
    } as unknown as FormValidation;

    /* WHEN */
    const result = validator(formData, errors);

    /* THEN */
    expect(result).not.toBeNull();
    expect(result.tags.addError).toHaveBeenCalledTimes(1);
  });
});
