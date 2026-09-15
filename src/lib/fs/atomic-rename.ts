import { rename } from "node:fs/promises";

const TRANSIENT = new Set(["EPERM", "EBUSY", "EACCES"]);

/**
 * rename() with a short retry for Windows file locks.
 *
 * On Windows, replacing a file fails with EPERM/EBUSY while another process
 * holds it open — antivirus scanning a file that was just written, or the
 * OneDrive client syncing the working tree (this repository lives in a
 * OneDrive folder). The lock lasts milliseconds; failing the save for it
 * would lose a correction or a reader's report. Other errors are thrown at
 * once, and a lock that outlasts the retries is thrown too, never swallowed.
 */
export async function renameWithRetry(from: string, to: string, attempts = 8): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    try {
      await rename(from, to);
      return;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code ?? "";
      if (!TRANSIENT.has(code) || attempt >= attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, 15 * attempt));
    }
  }
}
