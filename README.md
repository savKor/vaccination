# External Services - Vaccination test

Like blood_test, but for vaccinations: takes PDFs from a folder and passes them to Sharan.

1. PDFs are put into `ORIGIN_FOLDER`; the file name starts with the vaccination number
   (`Sharan.Vaccination.vaccinationId`), e.g. `5_covid.pdf`
2. the script finds the vaccination and its client in Sharan
3. creates a `Sharan.Attachment` (type `Other`) on the client and uploads the PDF into it
4. moves the file to `ARCHIVE_FOLDER`; unknown vaccination or one without client -> `ERROR_FOLDER`

## Files

- `src/index.ts` - read folder -> find vaccination -> attach -> move
- `src/utils/` - `login`, `find`, `create`, `upload`, `files` (list / move PDFs), `direct`, `request`, `generateId`

## Run

Copy `.env.example` to `.env`, fill `LOGIN` / `PASSWORD` and the three folders (full paths).

```bash
bun install
bun run start
```
