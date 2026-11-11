#!/usr/bin/env python3
"""Apply GitHub Pages overlays to the publish copy. Idempotent."""
from __future__ import annotations

import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
PUBLISH = Path(__file__).resolve().parent

BUTTON_ORIG = (
    '      html += \'<button type="button" class="builder-render-btn" data-builder-request-render\' + (canRequest ? "" : " disabled") + ">Make a render</button>";\n'
    '      if (!canRequest) html += \'<p class="builder-render-hint">Pick a look and at least one piece first.</p>\';\n'
)
BUTTON_NEW = (
    '      var renderEndpoint = (window.HOUSE_CONFIG && window.HOUSE_CONFIG.RENDER_ENDPOINT) || "";\n'
    '      if (!renderEndpoint) {\n'
    '        html += \'<button type="button" class="builder-render-btn" data-builder-request-render disabled>Make a render</button>\';\n'
    '        html += \'<p class="builder-render-hint">Render requests are being moved — coming back shortly</p>\';\n'
    '      } else {\n'
    '        html += \'<button type="button" class="builder-render-btn" data-builder-request-render\' + (canRequest ? "" : " disabled") + ">Make a render</button>";\n'
    '        if (!canRequest) html += \'<p class="builder-render-hint">Pick a look and at least one piece first.</p>\';\n'
    '      }\n'
)
FETCH_ORIG = '    fetch("/.netlify/functions/request-render", {'
FETCH_NEW = (
    '    var renderEndpoint = (window.HOUSE_CONFIG && window.HOUSE_CONFIG.RENDER_ENDPOINT) || "";\n'
    '    if (!renderEndpoint) {\n'
    '      setRenderStatus(panel, "Render requests are being moved — coming back shortly", "error");\n'
    '      return;\n'
    '    }\n'
    '    fetch(renderEndpoint, {'
)


def fail(msg: str) -> None:
    print("apply_patch: " + msg, file=sys.stderr)
    sys.exit(1)


def write_config() -> None:
    dest = REPO / "js" / "config.js"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text((PUBLISH / "config.js").read_text())
    print("wrote js/config.js")


def write_nojekyll() -> None:
    (REPO / ".nojekyll").write_text("")
    print("wrote .nojekyll")


def write_readme() -> None:
    (REPO / "README.md").write_text((PUBLISH / "README.md").read_text())
    print("wrote README.md")


def write_gitignore() -> None:
    dest = REPO / ".gitignore"
    wanted = ".env\n.env.*\n*.pem\n*.key\n__pycache__/\n*.pyc\n"
    if dest.exists() and dest.read_text() == wanted:
        print("gitignore already current")
        return
    dest.write_text(wanted)
    print("wrote .gitignore")


def patch_index() -> None:
    path = REPO / "index.html"
    if not path.exists():
        fail("index.html missing")
    text = path.read_text()
    tag = '<script src="js/config.js"></script>'
    if tag in text:
        print("index.html already includes js/config.js")
        return
    needle = '  <script src="js/data.js"></script>'
    if needle not in text:
        fail("index.html does not contain the expected js/data.js script tag")
    path.write_text(text.replace(needle, "  " + tag + "\n" + needle, 1))
    print("patched index.html to load js/config.js")


def patch_shop_builder() -> None:
    path = REPO / "js" / "shop-builder.js"
    if not path.exists():
        fail("js/shop-builder.js missing")
    text = path.read_text()
    changed = False

    if "Render requests are being moved — coming back shortly" in text and "HOUSE_CONFIG.RENDER_ENDPOINT" in text and "/.netlify/functions/request-render" not in text:
        print("js/shop-builder.js already patched")
        return

    if BUTTON_ORIG not in text:
        fail("js/shop-builder.js render button block did not match; not patching blindly")
    text = text.replace(BUTTON_ORIG, BUTTON_NEW, 1)
    changed = True

    if FETCH_ORIG in text:
        text = text.replace(FETCH_ORIG, FETCH_NEW, 1)
        changed = True
    elif "fetch(renderEndpoint, {" in text:
        pass
    else:
        fail("js/shop-builder.js render fetch() call did not match")

    if "/.netlify/functions/request-render" in text:
        fail("js/shop-builder.js still references /.netlify/functions/request-render after patch")

    if changed:
        path.write_text(text)
        print("patched js/shop-builder.js")


def main() -> None:
    write_config()
    write_nojekyll()
    write_readme()
    write_gitignore()
    patch_index()
    patch_shop_builder()
    print("apply_patch: ok")


if __name__ == "__main__":
    main()
