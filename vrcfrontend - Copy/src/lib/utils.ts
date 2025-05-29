// Patch: Minimal cn utility to unblock build
export function cn(...args: (string | undefined | null | boolean)[]): string {
  return args.filter(Boolean).join(' ');
}
