import * as T from "three";

const OR = 0xff6a13;

function envTex(r: T.WebGLRenderer) {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const g = c.getContext("2d")!;
  const gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, "#26262b"); gr.addColorStop(0.55, "#0c0c0e"); gr.addColorStop(1, "#040404");
  g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
  g.fillStyle = "#fff";
  [[90, 70, 230, 70], [520, 50, 280, 56], [860, 110, 150, 80]].forEach((a) => g.fillRect(a[0]!, a[1]!, a[2]!, a[3]!));
  g.fillStyle = "#ff6a13";
  [[0, 250, 1024, 14], [250, 320, 520, 24], [0, 150, 1024, 8]].forEach((a) => g.fillRect(a[0]!, a[1]!, a[2]!, a[3]!));
  g.fillStyle = "rgba(255,106,19,.55)"; g.fillRect(0, 420, 1024, 60);
  const t = new T.CanvasTexture(c);
  t.mapping = T.EquirectangularReflectionMapping;
  t.colorSpace = T.SRGBColorSpace;
  const pm = new T.PMREMGenerator(r);
  const rt = pm.fromEquirectangular(t);
  pm.dispose();
  return rt.texture;
}

function sevenTex() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#ff6a13"; g.font = "900 200px Arial,sans-serif";
  g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("7", 128, 138);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  return new T.MeshBasicMaterial({ map: t, transparent: true });
}

type Plate = { p: T.Object3D; sd: number; k: number; x0: number };

function makeBarbell() {
  const M = {
    chrome: new T.MeshStandardMaterial({ color: 0xc2c2ca, metalness: 1, roughness: 0.16, envMapIntensity: 1.3 }),
    dark: new T.MeshStandardMaterial({ color: 0x2d2d32, metalness: 0.85, roughness: 0.38, envMapIntensity: 1.1 }),
    neon: new T.MeshBasicMaterial({ color: OR }),
    halo: new T.MeshBasicMaterial({ color: OR, transparent: true, opacity: 0.22, blending: T.AdditiveBlending, depthWrite: false }),
  };
  const sv = sevenTex();
  const g = new T.Group();
  const plates: Plate[] = [];
  const X = <O extends T.Object3D>(a: O) => { a.rotation.z = Math.PI / 2; return a; };
  g.add(X(new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 3.4, 28), M.chrome)));
  [-1, 1].forEach((sd) => {
    let x = 0.5;
    [[1, 0.2], [0.82, 0.17], [0.64, 0.15]].forEach(([r, t], k) => {
      const p = new T.Group();
      p.add(X(new T.Mesh(new T.CylinderGeometry(r!, r!, t!, 56), M.dark)));
      [-1, 1].forEach((f) => {
        const a = new T.Mesh(new T.TorusGeometry(r!, 0.026, 10, 72), M.chrome);
        a.rotation.y = Math.PI / 2; a.position.x = (f * t!) / 2; p.add(a);
        const b = new T.Mesh(new T.TorusGeometry(r! * 0.84, 0.02, 8, 72), M.neon);
        b.rotation.y = Math.PI / 2; b.position.x = f * (t! / 2 + 0.003); p.add(b);
        const c = new T.Mesh(new T.TorusGeometry(r! * 0.84, 0.075, 8, 72), M.halo);
        c.rotation.y = Math.PI / 2; c.position.x = f * (t! / 2 + 0.003); p.add(c);
      });
      p.add(X(new T.Mesh(new T.CylinderGeometry(0.24, 0.24, t! + 0.04, 32), M.chrome)));
      if (k === 2) {
        const d = new T.Mesh(new T.CircleGeometry(r! * 0.5, 40), sv);
        d.rotation.y = (sd * Math.PI) / 2; d.position.x = sd * (t! / 2 + 0.006); p.add(d);
      }
      p.position.x = sd * (x + t! / 2);
      x += t! + 0.03;
      g.add(p);
      plates.push({ p, sd, k, x0: p.position.x });
    });
    const cg = new T.Group();
    cg.add(X(new T.Mesh(new T.CylinderGeometry(0.18, 0.18, 0.14, 32), M.chrome)));
    cg.position.x = sd * (x + 0.07);
    g.add(cg);
    plates.push({ p: cg, sd, k: 3, x0: cg.position.x });
  });
  return { g, plates };
}

/** Mounts the scroll-driven 3D barbell. getProgress returns 0..1 scroll progress. Returns cleanup. */
export function mountBarbell(cv: HTMLCanvasElement, getProgress: () => number) {
  let r: T.WebGLRenderer;
  try { r = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch { return null; }
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  r.outputColorSpace = T.SRGBColorSpace;
  r.toneMapping = T.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.1;
  const sc = new T.Scene();
  const cam = new T.PerspectiveCamera(34, 1, 0.1, 80);
  try { sc.environment = envTex(r); } catch { /* ignore */ }
  sc.add(new T.AmbientLight(0xffffff, 0.35));
  const k = new T.DirectionalLight(0xffffff, 0.9); k.position.set(-4, 5, 6); sc.add(k);
  const pl = new T.PointLight(OR, 30, 16, 1.5); pl.position.set(0, 0, 3.5); sc.add(pl);

  const db = makeBarbell();
  const root = new T.Group();
  db.g.scale.setScalar(1.35);
  root.add(db.g); sc.add(root);
  const grid = new T.GridHelper(20, 40, OR, OR);
  (grid.material as T.Material).transparent = true;
  (grid.material as T.Material).opacity = 0.14;
  grid.position.y = -2.6; sc.add(grid);

  const fit = () => {
    const w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    r.setSize(w, h, false);
    cam.aspect = w / h;
    // Keep the full barbell in frame on narrow (phone) screens
    cam.position.set(0, 0.2, Math.max(9.5 / (0.611 * cam.aspect), 7 / 0.611) * 0.8);
    cam.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(fit); ro.observe(cv); fit();
  let vis = true;
  const io = new IntersectionObserver((e) => { vis = !!e[0]?.isIntersecting; }); io.observe(cv);

  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!vis || document.hidden) return;
    const p = getProgress();
    const e = Math.min(1, Math.sin(Math.PI * p) * 1.5);
    db.plates.forEach((a) => {
      a.p.position.x = a.x0 + a.sd * e * (1 + a.k * 0.9);
      a.p.position.y = Math.sin(a.k * 2.1 + 1) * e * 0.55;
      if (a.k < 3) a.p.rotation.x = e * a.k * 1.1;
    });
    root.rotation.set(0.22, 0.5 + p * 2.4, -0.32 + Math.sin(p * 3) * 0.08);
    r.render(sc, cam);
  };
  loop();
  return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); r.dispose(); };
}
