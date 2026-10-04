export function externalReferrerHostname(
  referrer: string,
  currentHostname: string,
) {
  if (!referrer) {
    return undefined;
  }

  try {
    const referrerHostname = new URL(referrer).hostname.toLowerCase();
    const normalizedCurrentHostname = currentHostname.toLowerCase();

    return referrerHostname && referrerHostname !== normalizedCurrentHostname
      ? referrerHostname
      : undefined;
  } catch {
    return undefined;
  }
}
