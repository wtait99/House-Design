# Main house · Howell, Michigan

Design ideas for the main house in Howell, Michigan. This is a planning view, not a construction set. It does not purchase, submit, or approve anything.

Live site: <https://wtait99.github.io/House-Design/>

This public GitHub Pages site is the hosted copy of the dashboard. Render requests from the room builder go to a Cloudflare Worker at `https://house-render-request.wtait99.workers.dev`.

## Update the site

From the machine that holds the source dashboard and the token:

```
cd /workspace/house-design-gh
./publish.sh
```

`GITHUB_DASHBOARD_TOKEN` must already be set in the environment. Do not put the token in the remote URL, in `.git/config`, or in this repository. Optional environment variables: `SOURCE` (defaults to `/workspace/howell-main-house-prototype`) and `MESSAGE` (commit message).

The script copies the source, reapplies the GitHub Pages render-endpoint patch, and pushes `main`. Netlify is left untouched.
