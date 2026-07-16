# Portfolio admin rename checklist (if SQL already applied or rows remain)

In **Admin → Portfolio**, find and rename any rows still matching:

| Bad title / category | Suggested title | Suggested category |
|----------------------|-----------------|--------------------|
| News | Bridal Lehenga — Studio Collection | Bridal |
| News (2nd) | Reception Gown Highlight | Gowns |
| disign | Designer Blouse | Design |
| Disiner | Designer Wear | Design |
| design | Designer Suit Detail | Design |
| category `disign` | — | Design |
| category `news` | — | Bridal (or delete if placeholder) |

Or run the UPDATE statements in `supabase/migrations/content_fixes.sql`.
