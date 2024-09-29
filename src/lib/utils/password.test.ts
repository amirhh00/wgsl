import { describe, it, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { saltAndHashPassword } from './password.ts';
import nodeCrypto from 'node:crypto';

describe('Password Hashing Functions', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.SALT = 'testSalt123';
  });

  afterEach(() => {
    process.env = originalEnv;
    mock.reset();
  });

  it('should hash password correctly', async () => {
    const email = 'test@example.com';
    const password = 'securePassword123';

    const hashedPassword = await saltAndHashPassword(email, password);

    assert(hashedPassword.startsWith('md5'));
    assert.strictEqual(hashedPassword.length, 35); // 'md5' + 32 characters
  });

  it('should throw error if SALT is not defined', async () => {
    delete process.env.SALT;

    await assert.rejects(async () => await saltAndHashPassword('test@example.com', 'password'), {
      name: 'Error',
      message: 'Salt is not defined in the environment variables.',
    });
  });

  it('should use Node.js crypto when available', async () => {
    const mockCreateHash = mock.fn(() => ({
      update: mock.fn(() => ({
        digest: mock.fn(() => 'mockedHash'),
      })),
    }));

    mock.method(nodeCrypto, 'createHash', mockCreateHash);

    await saltAndHashPassword('test@example.com', 'password');

    assert.strictEqual(mockCreateHash.mock.calls.length, 2);
  });

  it('should fallback to WebCrypto API when Node.js crypto is not available', async () => {
    const originalCreateHash = nodeCrypto.createHash;
    // @ts-expect-error
    nodeCrypto.createHash = null;

    const mockDigest = mock.fn(() => new Uint8Array([1, 2, 3, 4]).buffer);
    mock.method(globalThis.crypto.subtle, 'digest', mockDigest);

    await saltAndHashPassword('test@example.com', 'password');

    assert.strictEqual(mockDigest.mock.calls.length, 2);

    nodeCrypto.createHash = originalCreateHash;
  });

  it('should produce different hashes for different inputs', async () => {
    const hash1 = await saltAndHashPassword('user1@example.com', 'password1');
    const hash2 = await saltAndHashPassword('user2@example.com', 'password2');

    assert.notStrictEqual(hash1, hash2);
  });

  it('should produce the same hash for the same input', async () => {
    const hash1 = await saltAndHashPassword('user@example.com', 'password');
    const hash2 = await saltAndHashPassword('user@example.com', 'password');

    assert.strictEqual(hash1, hash2);
  });
});
