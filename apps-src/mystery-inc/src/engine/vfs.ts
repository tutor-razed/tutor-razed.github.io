import type { FileMetadata, FileSeed, MysteryManifest, VfsNode } from "./types";

const DEFAULT_META: FileMetadata = {
  createdAt: "1989-10-03T09:00:00",
  modifiedAt: "1989-10-03T09:00:00",
  owner: "student",
  permissions: "rw-r--r--",
};

const normalize = (rawPath: string): string => {
  const p = rawPath.replace(/\\/g, "/").trim();
  if (!p || p === "/") return "/";
  return `/${p.replace(/^\/+/, "").replace(/\/+$/, "")}`;
};

const dirname = (path: string): string => {
  if (path === "/") return "/";
  const idx = path.lastIndexOf("/");
  return idx <= 0 ? "/" : path.slice(0, idx);
};

const basename = (path: string): string => {
  if (path === "/") return "/";
  const parts = path.split("/");
  return parts[parts.length - 1] ?? path;
};

const ensureDir = (store: Map<string, VfsNode>, path: string): void => {
  const p = normalize(path);
  if (store.has(p)) return;
  if (p !== "/") ensureDir(store, dirname(p));
  store.set(p, {
    path: p,
    name: basename(p),
    type: "dir",
    children: [],
    hidden: false,
    binary: false,
    revealed: true,
    metadata: { ...DEFAULT_META },
  });
};

const addChild = (store: Map<string, VfsNode>, parentPath: string, childPath: string): void => {
  const parent = store.get(parentPath);
  if (!parent || parent.type !== "dir") return;
  if (!parent.children.includes(childPath)) {
    parent.children.push(childPath);
    parent.children.sort((a, b) => a.localeCompare(b));
  }
};

export interface VfsBuildResult {
  nodes: Map<string, VfsNode>;
  root: string;
}

export const buildVfs = (manifest: MysteryManifest, seeds: FileSeed[]): VfsBuildResult => {
  const nodes = new Map<string, VfsNode>();
  ensureDir(nodes, "/");

  const configMap = new Map(
    manifest.fileConfig.map((cfg) => [normalize(cfg.path), cfg] as const),
  );

  for (const seed of seeds) {
    const path = normalize(seed.path);
    const parent = dirname(path);
    ensureDir(nodes, parent);

    const cfg = configMap.get(path);
    const meta = { ...DEFAULT_META, ...(cfg?.metadata ?? {}) };
    nodes.set(path, {
      path,
      name: basename(path),
      type: "file",
      children: [],
      content: seed.content,
      hidden: cfg?.hidden ?? false,
      binary: cfg?.binary ?? false,
      lock: cfg?.lock,
      revealed: cfg?.revealed ?? true,
      metadata: meta,
    });
    addChild(nodes, parent, path);
  }

  for (const cfg of manifest.fileConfig) {
    const path = normalize(cfg.path);
    if (nodes.has(path)) continue;
    ensureDir(nodes, path);
    const node = nodes.get(path);
    if (!node) continue;
    node.hidden = cfg.hidden ?? false;
    node.revealed = cfg.revealed ?? true;
    node.lock = cfg.lock;
    node.metadata = { ...DEFAULT_META, ...(cfg.metadata ?? {}) };
    if (path !== "/") {
      addChild(nodes, dirname(path), path);
    }
  }

  return { nodes, root: "/" };
};

export const normalizePath = normalize;
export const parentPath = dirname;
