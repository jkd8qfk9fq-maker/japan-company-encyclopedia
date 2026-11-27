/**
 * The print button's fallback flow (JCE-135). window.print() is the only print path the report had,
 * and in some in-app browsers (WKWebView) and home-screen (standalone) web apps it silently does
 * nothing — no dialog, no error — so the reader cannot tell whether anything happened. The button
 * therefore watches for the print dialog's own signal: a click moves the flow to "awaiting", a
 * `beforeprint` event proves the dialog opened and returns it to "idle", and if the wait expires
 * first the flow moves to "guidance", where the button shows how else to reach a PDF. The state
 * machine is pure so the transitions are testable without a browser; the component only adds the
 * timer and the event listener.
 */

export type PrintPanelState = "idle" | "awaiting" | "guidance";

export type PrintPanelEvent = "attempt" | "beforeprint" | "timeout" | "close";

/** How long the button waits for `beforeprint` before it concludes the print dialog never opened. */
export const PRINT_FALLBACK_DELAY_MS = 600;

export function nextPrintPanelState(state: PrintPanelState, event: PrintPanelEvent): PrintPanelState {
  switch (event) {
    case "attempt":
      // A fresh attempt always re-arms the watch, and hides guidance shown by the previous one.
      return "awaiting";
    case "beforeprint":
      // The dialog opened: nothing to guide, whichever state the flow was in.
      return "idle";
    case "timeout":
      // Only an attempt still waiting for its dialog turns into guidance; a stray timer that
      // fires after the dialog opened (or after the reader closed the panel) changes nothing.
      return state === "awaiting" ? "guidance" : state;
    case "close":
      return state === "guidance" ? "idle" : state;
  }
}
