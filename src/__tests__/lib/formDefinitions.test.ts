import {
  AUDIO_FILE_SPEC,
  createAudioFileRecordFormSchema,
  createUserFormSchema,
  PASSWORD_SPEC,
  updateUserFormSchema,
  USERNAME_SPEC,
} from "../../lib/formDefinitions";

describe("Form Definitions", () => {
  it("should have correct username specifications", () => {
    expect(USERNAME_SPEC.min.value).toBe(3);
    expect(USERNAME_SPEC.min.message).toBe(
      "Name must be at least 3 characters long."
    );
    expect(USERNAME_SPEC.max.value).toBe(10);
    expect(USERNAME_SPEC.max.message).toBe(
      "Name must be at most 10 characters long."
    );
  });

  it("should have correct password specifications", () => {
    expect(PASSWORD_SPEC.min.value).toBe(3);
    expect(PASSWORD_SPEC.min.message).toBe(
      "Password must be at least 3 characters long."
    );
    expect(PASSWORD_SPEC.max.value).toBe(20);
    expect(PASSWORD_SPEC.max.message).toBe(
      "Password must be at most 20 characters long."
    );
  });

  it("should have correct audio file specifications", () => {
    expect(AUDIO_FILE_SPEC.description.min.value).toBe(3);
    expect(AUDIO_FILE_SPEC.description.min.message).toBe(
      "Description must be at least 3 characters long."
    );
    expect(AUDIO_FILE_SPEC.description.max.value).toBe(100);
    expect(AUDIO_FILE_SPEC.description.max.message).toBe(
      "Description must be at most 100 characters long."
    );
  });

  it("should have correct create user form schema", () => {
    expect(createUserFormSchema).toBeDefined();
    expect(createUserFormSchema.shape.username).toBeDefined();
    expect(createUserFormSchema.shape.password).toBeDefined();
  });

  it("should have correct update user form schema", () => {
    expect(updateUserFormSchema).toBeDefined();
    expect(updateUserFormSchema.shape.username).toBeDefined();
    expect(updateUserFormSchema.shape.newPassword).toBeDefined();
  });

  it("should have correct create audio file record form schema", () => {
    expect(createAudioFileRecordFormSchema).toBeDefined();
    expect(createAudioFileRecordFormSchema.shape.description).toBeDefined();
    expect(createAudioFileRecordFormSchema.shape.category).toBeDefined();
    expect(createAudioFileRecordFormSchema.shape.file).toBeDefined();
  });
});
