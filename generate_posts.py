#!/usr/bin/env python3
"""Generate platform-optimized social media posts about Claude AI and coworking."""

import anthropic
import argparse
import os
import sys
from datetime import datetime
from pathlib import Path

TOPICS = [
    "Claude AI's ability to help with complex writing and research tasks",
    "How AI coworking spaces are changing the way teams collaborate",
    "Practical ways to use Claude to supercharge your workday productivity",
    "The future of human-AI collaboration in creative work",
    "How Claude helps content creators produce better work faster",
    "Using AI tools to build stronger remote and coworking communities",
    "Why thoughtful AI design matters for everyday professionals",
    "Claude's approach to honest, helpful, and safe AI assistance",
    "How AI is reshaping the modern coworking experience",
    "Getting more done with less stress using Claude as your AI partner",
]

SYSTEM_PROMPT = """You are a social media expert specializing in AI technology and professional workspace content.
You write authentic, engaging posts that resonate with professionals, entrepreneurs, and AI enthusiasts.
Your posts are human, relatable, and never feel robotic or overly promotional.
Always write in first or second person — never third person brand-speak."""

POST_PROMPT_TEMPLATE = """Create social media posts about this topic: {topic}

Write one post for each platform below. Follow the platform's specific requirements exactly.

---

### INSTAGRAM
- Max 2,200 characters
- Engaging hook in the first line (this shows before "more")
- Personal, visual, and community-focused tone
- 10-15 relevant hashtags at the end (mix of popular and niche)
- Include a clear call to action

### TWITTER/X
- Max 280 characters (including spaces and hashtags) — this is a hard limit, count carefully
- Punchy, conversational, and shareable
- 2-3 hashtags woven naturally or at the end
- One clear, quotable idea

### LINKEDIN
- 400-800 words for best performance
- Professional but personable tone — thought leadership, not corporate speak
- Start with a bold hook (not "I'm excited to share...")
- Share a specific insight, lesson, or perspective
- End with a question to drive comments
- 3-5 professional hashtags at the very end

### TIKTOK
- This is the caption for a short video — 100-200 characters works best
- Casual, fun, and direct
- Reference what the video is showing or doing
- 6-10 trending hashtags (#ai #tech #productivity #coworking etc.)
- Creates curiosity or urgency to watch

---

Format your response exactly as shown above with the ### PLATFORM headers.
Write each post completely — do not use placeholders like [your name] or [link]."""


def generate_posts(topic: str, client: anthropic.Anthropic) -> str:
    prompt = POST_PROMPT_TEMPLATE.format(topic=topic)

    print("\n✦ Generating posts", end="", flush=True)

    with client.messages.stream(
        model="claude-opus-4-7",
        max_tokens=4000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        # Show progress dots while generating
        text = ""
        for chunk in stream.text_stream:
            text += chunk
            if len(text) % 100 == 0:
                print(".", end="", flush=True)

    print(" done!\n")
    return text


def parse_posts(raw_text: str) -> dict:
    platforms = ["INSTAGRAM", "TWITTER/X", "LINKEDIN", "TIKTOK"]
    posts = {}

    for i, platform in enumerate(platforms):
        header = f"### {platform}"
        start = raw_text.find(header)
        if start == -1:
            continue

        # Find next platform header or end of text
        content_start = start + len(header)
        next_start = len(raw_text)
        for j in range(i + 1, len(platforms)):
            next_header = f"### {platforms[j]}"
            pos = raw_text.find(next_header)
            if pos != -1:
                next_start = pos
                break

        posts[platform] = raw_text[content_start:next_start].strip()

    return posts


def print_posts(posts: dict, topic: str):
    divider = "─" * 60
    thick_divider = "═" * 60

    print(thick_divider)
    print(f"  SOCIAL MEDIA POSTS")
    print(f"  Topic: {topic[:55]}{'...' if len(topic) > 55 else ''}")
    print(f"  Generated: {datetime.now().strftime('%B %d, %Y')}")
    print(thick_divider)

    platform_display = {
        "INSTAGRAM": "📸  INSTAGRAM",
        "TWITTER/X": "𝕏   TWITTER/X",
        "LINKEDIN": "💼  LINKEDIN",
        "TIKTOK": "🎵  TIKTOK",
    }

    for platform, post in posts.items():
        label = platform_display.get(platform, platform)
        print(f"\n{label}")
        print(divider)
        print(post)

        # Character count for Twitter
        if platform == "TWITTER/X":
            char_count = len(post)
            status = "✓" if char_count <= 280 else "✗ OVER LIMIT"
            print(f"\n  [{char_count}/280 characters {status}]")

        print()

    print(thick_divider)


def save_to_file(posts: dict, raw_text: str, topic: str) -> str:
    output_dir = Path("generated_posts")
    output_dir.mkdir(exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_topic = "".join(c if c.isalnum() or c in " -_" else "" for c in topic[:40])
    safe_topic = safe_topic.strip().replace(" ", "_")
    filename = output_dir / f"posts_{timestamp}_{safe_topic}.txt"

    with open(filename, "w", encoding="utf-8") as f:
        f.write(f"Social Media Posts\n")
        f.write(f"Topic: {topic}\n")
        f.write(f"Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}\n")
        f.write("=" * 60 + "\n\n")
        f.write(raw_text)

    return str(filename)


def pick_topic_interactively() -> str:
    print("\nPick a topic or enter your own:\n")
    for i, topic in enumerate(TOPICS, 1):
        print(f"  {i:2}. {topic}")
    print(f"  {'C':2}. Custom topic\n")

    while True:
        choice = input("Your choice: ").strip()

        if choice.upper() == "C":
            return input("Enter your topic: ").strip()

        try:
            idx = int(choice) - 1
            if 0 <= idx < len(TOPICS):
                return TOPICS[idx]
        except ValueError:
            pass

        print("  Please enter a number 1-10 or C for custom.")


def main():
    parser = argparse.ArgumentParser(
        description="Generate social media posts about Claude AI and coworking",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python generate_posts.py
  python generate_posts.py --topic "How Claude helps with writing"
  python generate_posts.py --topic "AI productivity tips" --save
  python generate_posts.py --list-topics
        """,
    )
    parser.add_argument("--topic", "-t", help="Topic for the posts")
    parser.add_argument("--save", "-s", action="store_true", help="Save posts to a file")
    parser.add_argument("--list-topics", action="store_true", help="Show available topics and exit")
    args = parser.parse_args()

    if args.list_topics:
        print("\nAvailable topics:\n")
        for i, topic in enumerate(TOPICS, 1):
            print(f"  {i:2}. {topic}")
        print()
        return

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set.")
        print("Get your key at https://console.anthropic.com")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    topic = args.topic if args.topic else pick_topic_interactively()

    if not topic:
        print("No topic provided. Exiting.")
        sys.exit(1)

    raw_text = generate_posts(topic, client)
    posts = parse_posts(raw_text)

    if not posts:
        print("Could not parse posts. Raw output:\n")
        print(raw_text)
        sys.exit(1)

    print_posts(posts, topic)

    if args.save:
        filename = save_to_file(posts, raw_text, topic)
        print(f"  Saved to: {filename}\n")
    else:
        print("  Tip: Run with --save to save these posts to a file.\n")


if __name__ == "__main__":
    main()
