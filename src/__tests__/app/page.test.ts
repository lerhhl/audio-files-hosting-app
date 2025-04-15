import { DEFAULT_HOME_PATH, LOGIN_PATH } from "@/app/constants";
import Root from "@/app/page";
import { redirectToLoginIfSessionNotFound } from "@/lib/auth";
import { redirect } from "next/navigation";

vi.mock("@/lib/auth", () => ({
  redirectToLoginIfSessionNotFound: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Root function", () => {
  it("should call redirectToLoginIfSessionNotFound and redirect to DEFAULT_HOME_PATH", async () => {
    const mockRedirectToLoginIfSessionNotFound = vi.mocked(
      redirectToLoginIfSessionNotFound
    );
    const mockRedirect = vi.mocked(redirect);

    await Root();

    expect(mockRedirectToLoginIfSessionNotFound).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith(DEFAULT_HOME_PATH);
  });

  it("should call redirectToLoginIfSessionNotFound and redirect to LOGIN_PATH without calling mockRedirect", async () => {
    const mockRedirectToLoginIfSessionNotFound = vi.mocked(
      redirectToLoginIfSessionNotFound
    );
    const mockRedirect = vi.mocked(redirect);

    mockRedirectToLoginIfSessionNotFound.mockImplementationOnce(() => {
      redirect(LOGIN_PATH);
    });

    await Root();

    expect(mockRedirectToLoginIfSessionNotFound).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith(LOGIN_PATH);
  });
});
