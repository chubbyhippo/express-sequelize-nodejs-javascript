import { describe, expect, it } from 'vitest';
import axios from 'axios';
import userRepository from '../../src/user/user.repository.js';
import console from 'node:console';
import { baseUrl, validUserInputs } from './shared/user.test.setup.js';

describe('i18n test', () => {
  const postForUser = async (userInputs) =>
    await axios.post(`${baseUrl}/api/users`, userInputs);

  const usernameNull = 'Username is required';
  const usernameLength = 'Username must be between 4 and 32 characters long';
  const passwordNull = 'Password is required';
  const passwordLength = 'Password must be between 6 and 32 characters long';
  const passwordPattern =
    'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  const emailNull = 'Email is required';
  const emailInvalid = 'Email must be valid';
  const emailRegistered = 'Email is already registered';

  it.each`
    field         | value                  | expectedErrorMessage
    ${'username'} | ${null}                | ${usernameNull}
    ${'username'} | ${'usr'}               | ${usernameLength}
    ${'username'} | ${'u'.repeat(33)}      | ${usernameLength}
    ${'password'} | ${null}                | ${passwordNull}
    ${'password'} | ${'p'.repeat(5)}       | ${passwordLength}
    ${'password'} | ${'lowercase'}         | ${passwordPattern}
    ${'password'} | ${'UPPERCASE'}         | ${passwordPattern}
    ${'password'} | ${'UPPERandlowercase'} | ${passwordPattern}
    ${'email'}    | ${null}                | ${emailNull}
    ${'email'}    | ${'test.com'}          | ${emailInvalid}
  `(
    `should return error message: $expectedErrorMessage for field: $field with value: $value`,
    async ({ field, value, expectedErrorMessage }) => {
      const input = {
        username: 'test',
        password: 'P4ssword',
        email: 'test@test.com',
      };

      input[field] = value;
      let errorMessage;
      await postForUser(input).catch((error) => {
        const validationErrors = error.response.data.validationErrors;
        errorMessage = validationErrors[field];
      });
      expect(errorMessage).toBe(expectedErrorMessage);
    }
  );

  it('should return email is already registered when email is already registered', async () => {
    await userRepository.create(validUserInputs);
    let errorMessage;
    await postForUser(validUserInputs).catch((error) => {
      const validationErrors = error.response.data.validationErrors;
      errorMessage = validationErrors.email;
    });
    expect(errorMessage).toBe(emailRegistered);
  });
});

describe('i18n test in Chinese', () => {
  const postForUser = async (userInputs) =>
    await axios.post(`${baseUrl}/api/users`, userInputs, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Language': 'zh',
        'Accept-Language': 'zh',
      },
    });

  const usernameNull = '用户名是必需的';
  const usernameLength = '用户名长度必须在4到32个字符之间';
  const passwordNull = '密码是必需的';
  const passwordLength = '密码长度必须在6到32个字符之间';
  const passwordPattern =
    '密码必须包含至少一个大写字母、一个小写字母和一个数字';
  const emailNull = '邮箱是必需的';
  const emailInvalid = '邮箱必须是有效的';
  const emailRegistered = '邮箱已被注册';

  it.each`
    field         | value                  | expectedErrorMessage
    ${'username'} | ${null}                | ${usernameNull}
    ${'username'} | ${'usr'}               | ${usernameLength}
    ${'username'} | ${'u'.repeat(33)}      | ${usernameLength}
    ${'password'} | ${null}                | ${passwordNull}
    ${'password'} | ${'p'.repeat(5)}       | ${passwordLength}
    ${'password'} | ${'lowercase'}         | ${passwordPattern}
    ${'password'} | ${'UPPERCASE'}         | ${passwordPattern}
    ${'password'} | ${'UPPERandlowercase'} | ${passwordPattern}
    ${'email'}    | ${null}                | ${emailNull}
    ${'email'}    | ${'test.com'}          | ${emailInvalid}
  `(
    `should return error message: $expectedErrorMessage for field: $field with value: $value`,
    async ({ field, value, expectedErrorMessage }) => {
      const input = {
        username: 'test',
        password: 'P4ssword',
        email: 'test@test.com',
      };

      input[field] = value;
      let errorMessage;
      await postForUser(input).catch((error) => {
        const validationErrors = error.response.data.validationErrors;
        errorMessage = validationErrors[field];
      });
      console.log(errorMessage);
      expect(errorMessage).toBe(expectedErrorMessage);
    }
  );

  it(`should return message: ${emailRegistered} when email is already registered`, async () => {
    await userRepository.create(validUserInputs);
    let errorMessage;
    await postForUser(validUserInputs).catch((error) => {
      const validationErrors = error.response.data.validationErrors;
      errorMessage = validationErrors.email;
    });
    expect(errorMessage).toBe(emailRegistered);
  });
});
