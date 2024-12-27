import { describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { baseUrl } from './shared/user.server.setup.js';
import { validUserInputs } from './shared/user.test.data.js';
import console from 'node:console';
import userRepository from '../../src/user/user.repository.js';
import EmailService from '../../src/user/email.service.js';

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
  const emailSentFailed = '电子邮件发送失败';

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
    },
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

  it(`should return message: ${emailSentFailed} when email sending have failed in chinese`, async () => {
    const mockSendAccountActivationEmail = vi
      .spyOn(EmailService, 'sendAccountActivationEmail')
      .mockRejectedValue({
        message: '电子邮件发送失败',
      });
    let errorMessage;
    await postForUser(validUserInputs).catch((error) => {
      if (error.response) {
        console.log(error.response);
        errorMessage = error.response.data.message;
      }
    });
    expect(errorMessage).toBe(emailSentFailed);
    mockSendAccountActivationEmail.mockRestore();
  });
});
