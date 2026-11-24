import type { AdminEnv } from "./env";

/**
 * The few GitHub calls the admin app makes (REST, the operator's fine-grained token). Reads come from main; a save is
 * a new branch with one commit and a pull request into main — merging stays the operator's act on GitHub, after the
 * repository's tests have run on it (CLAUDE.md invariant 9: the repository is the source of truth).
 */

export class GitHub {
  constructor(private readonly env: AdminEnv) {}

  private async call<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`https://api.github.com/repos/${this.env.GITHUB_REPO}${path}`, {
      ...init,
      headers: {
        authorization: `Bearer ${this.env.GITHUB_TOKEN}`,
        accept: "application/vnd.github+json",
        "x-github-api-version": "2022-11-28",
        "user-agent": "kigyo-admin",
        ...(init.body ? { "content-type": "application/json" } : {}),
      },
    });
    if (!response.ok) throw new Error(`GitHub ${init.method ?? "GET"} ${path}: ${response.status} ${(await response.text()).slice(0, 200)}`);
    return (await response.json()) as T;
  }

  /** A file on main: its text and blob sha (the version an edit starts from). Null when it does not exist. */
  async file(path: string): Promise<{ text: string; sha: string } | null> {
    try {
      const meta = await this.call<{ sha: string; content?: string; encoding?: string; size: number }>(`/contents/${path}?ref=main`);
      if (meta.content && meta.encoding === "base64") {
        const bytes = Uint8Array.from(atob(meta.content.replace(/\n/g, "")), (c) => c.charCodeAt(0));
        return { text: new TextDecoder().decode(bytes), sha: meta.sha };
      }
      // Over 1 MB the contents API leaves the body out; the blob API still returns it.
      const blob = await this.call<{ content: string }>(`/git/blobs/${meta.sha}`);
      const bytes = Uint8Array.from(atob(blob.content.replace(/\n/g, "")), (c) => c.charCodeAt(0));
      return { text: new TextDecoder().decode(bytes), sha: meta.sha };
    } catch (error) {
      if (String(error).includes(": 404 ")) return null;
      throw error;
    }
  }

  /** The `.json` file ids in a data directory on main (the git tree, so thousands of files are one call). */
  async ids(dir: string): Promise<Set<string>> {
    const parent = await this.call<{ name: string; sha: string; type: string }[]>(`/contents/src/data?ref=main`);
    const entry = parent.find((e) => e.name === dir && e.type === "dir");
    if (!entry) return new Set();
    const tree = await this.call<{ tree: { path: string; type: string }[] }>(`/git/trees/${entry.sha}`);
    return new Set(tree.tree.filter((t) => t.type === "blob" && t.path.endsWith(".json")).map((t) => t.path.slice(0, -5)));
  }

  /** One commit with these files on a new branch from main, and a pull request for it. */
  async propose(input: { branch: string; message: string; title: string; body: string; files: { path: string; text: string }[] }): Promise<{ number: number; url: string }> {
    const ref = await this.call<{ object: { sha: string } }>(`/git/ref/heads/main`);
    const base = await this.call<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`);
    const tree = await this.call<{ sha: string }>(`/git/trees`, {
      method: "POST",
      body: JSON.stringify({ base_tree: base.tree.sha, tree: input.files.map((f) => ({ path: f.path, mode: "100644", type: "blob", content: f.text })) }),
    });
    const commit = await this.call<{ sha: string }>(`/git/commits`, {
      method: "POST",
      body: JSON.stringify({ message: input.message, tree: tree.sha, parents: [ref.object.sha] }),
    });
    await this.call(`/git/refs`, { method: "POST", body: JSON.stringify({ ref: `refs/heads/${input.branch}`, sha: commit.sha }) });
    const pr = await this.call<{ number: number; html_url: string }>(`/pulls`, {
      method: "POST",
      body: JSON.stringify({ title: input.title, head: input.branch, base: "main", body: input.body }),
    });
    return { number: pr.number, url: pr.html_url };
  }

  /** Open pull requests this app made (branches under admin/). */
  async openProposals(): Promise<{ number: number; title: string; url: string; created: string }[]> {
    const pulls = await this.call<{ number: number; title: string; html_url: string; created_at: string; head: { ref: string } }[]>(`/pulls?state=open&per_page=50`);
    return pulls.filter((p) => p.head.ref.startsWith("admin/")).map((p) => ({ number: p.number, title: p.title, url: p.html_url, created: p.created_at }));
  }
}
