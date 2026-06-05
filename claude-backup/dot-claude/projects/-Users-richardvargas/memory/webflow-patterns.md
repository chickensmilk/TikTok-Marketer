# Webflow MCP Patterns

## Known Quirks
- **element_builder depth limit**: max 3 levels deep from schema root
- **set_attributes TypeError**: element IS created correctly despite error — don't retry
- **TextBlock set_text fails at L3**: use Paragraph type instead, or set_text on String child via element_tool
- **Tool reloading after context compaction**: call `ToolSearch select:<tool_name>` before first use
- **Combo classes**: created via `create_style` with `parent_style_name` field; applied via `set_style: ["Base", "Combo"]`
- **CTA Call Block pattern**: always needs a 2nd pass to add Call Label + Call Number children after getting ID
- **style_tool properties**: use longhand only (no `flex`, `border`, `overflow` shorthands)
