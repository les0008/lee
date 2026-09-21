# Unblocking the permission classifier

I cannot write this file myself — the classifier blocks an agent editing its own
permissions, and it is right to. You have to create it.

**Create `.claude/settings.json` in the repo root** with exactly this:

```json
{
  "permissions": {
    "allow": [
      "mcp__mcp_meta_ads__ads_create_campaign",
      "mcp__mcp_meta_ads__ads_create_ad_set",
      "mcp__mcp_meta_ads__ads_create_ad",
      "mcp__mcp_meta_ads__ads_create_creative",
      "mcp__mcp_meta_ads__ads_creative_upload_media",
      "mcp__mcp_meta_ads__ads_get_ad_preview",
      "mcp__mcp_meta_ads__ads_get_ad_entities",
      "mcp__mcp_meta_ads__ads_library_search"
    ],
    "ask": [
      "mcp__mcp_meta_ads__ads_activate_entity",
      "mcp__mcp_meta_ads__ads_update_entity"
    ]
  },
  "autoMode": {
    "allow": [
      "$defaults",
      "Creating Meta ad objects (campaigns, ad sets, ads, creatives) in the LEAF ad account. The Meta MCP creates every object PAUSED, so creation cannot spend money; only activation can, and it is gated separately."
    ]
  }
}
```

What this does:

- **allow** — creating campaigns, ad sets, ads and creatives stops being
  classified as a real-world transaction. Every one of those objects is created
  PAUSED by the Meta MCP, so none of it can spend money.
- **ask** — activating an entity or changing a live one still prompts you. That
  is the line where money starts, and it should stay in your hands.

The settings watcher only watches `.claude/` if the directory existed when the
session started. It did not, so after creating the file either open `/hooks`
once (which reloads config) or start a fresh session.

Faster alternative for right now: switch the session's permission mode off
`auto` in the Claude Code UI.
