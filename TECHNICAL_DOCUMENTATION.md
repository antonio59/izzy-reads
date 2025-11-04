# Izzy Reads - Technical Documentation

## Quick Reference

### How Book Covers Work
- Books are searched via Open Library API (free, 20M+ books)
- Cover URLs: `https://covers.openlibrary.org/b/id/{coverID}-L.jpg`
- Automatically fetched when adding books via search
- No maintenance required - Internet Archive maintains the API

### Maintenance Required
**NONE!** This app is designed to be zero-maintenance:
- ✅ Open Library API - Free forever, no keys, maintained by Internet Archive
- ✅ Supabase - Free tier with automatic backups
- ✅ Keep-alive workflow - Runs automatically via GitHub Actions every 6 hours
- ✅ Weekly quotes - Rotate automatically based on date

See full documentation at: https://github.com/your-repo/izzy-reads/blob/master/DOCS.md
