# Share-image font (JCE-062)

`noto-sans-jp-bold-subset.ttf` — Noto Sans JP, SIL Open Font License 1.1 (`OFL.txt`), from
`https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP[wght].ttf` (version 2.004), 2026-11-17.

The share images are drawn by `next/og`, which reads TTF/OTF/WOFF but not the WOFF2 files the pages use
(`../google`). Only the build reads this file; it is never served.

Made with fontTools (not a project dependency):

```bash
python -m fontTools.varLib.instancer 'NotoSansJP[wght].ttf' wght=700 -o NotoSansJP-Bold.ttf
pyftsubset NotoSansJP-Bold.ttf --text-file=chars.txt --output-file=noto-sans-jp-bold-subset.ttf --layout-features='*' --name-IDs='*'
```

`chars.txt` = printable ASCII, ひらがな U+3041–3096, カタカナ U+30A1–30FC, every industry name in
`src/lib/industry-labels.ts`, and every Japanese string in `src/lib/rankings.ts`, plus `0-9 % . , × ・ （ ） ／ ： 、 。 「 」`.
`tests/rankings.test.ts` fails when a string an image draws has a character this file lacks: re-run the two commands
with the new characters added.
