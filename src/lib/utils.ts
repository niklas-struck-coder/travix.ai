import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Escapes RegExp special characters so a free-text string can be used as a
// literal match inside a `new RegExp(...)`, e.g. a `\bword\b` lookup built
// from user input or destination names.
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Moves focus to the current page's <h1>, adding a temporary tabindex if it
// doesn't have one. Used as the dialog/sheet close-focus fallback when the
// opener that triggered them is no longer in the DOM (e.g. a "delete this
// card" trigger whose card just got deleted), and by callers that need to
// redirect close-focus themselves (e.g. MobileNav closing after an actual
// navigation, not just a cancel).
export function focusPageHeading() {
  const heading = document.querySelector("h1")
  if (!(heading instanceof HTMLElement)) return
  const hadTabIndex = heading.hasAttribute("tabindex")
  if (!hadTabIndex) heading.setAttribute("tabindex", "-1")
  heading.focus({ preventScroll: true })
  if (!hadTabIndex) {
    heading.addEventListener(
      "blur",
      () => heading.removeAttribute("tabindex"),
      { once: true }
    )
  }
}
