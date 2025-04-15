"use client";

export function getSessionCookie() {
  const sessionCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("session="))
    ?.split("=")[1];
  return sessionCookie;
}

export function generateHeaders(isMultipart = false) {
  const sessionCookie = getSessionCookie();
  return {
    "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
    Cookie: `session=${sessionCookie}`,
  };
}

export function calculateTotalPages(totalCount: number, itemsPerPage: number) {
  if (totalCount === 0) {
    return 1;
  }

  return Math.ceil(totalCount / itemsPerPage);
}
