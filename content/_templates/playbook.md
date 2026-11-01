---
title: Playbook title (what the setup is, which index or instrument)
summary: One or two sentences for the card and the lede. Changeable numbers are tokens, e.g. one lot of {{fact:fo-nifty-lot}}; never type a rate, lot size, session time or threshold.
updated: 2026-11-01
level: intermediate
instruments: [Nifty 50 futures, Nifty 50 weekly options]
window: 09:30–11:00 IST
glance_stop: Range midpoint (tight) or the opposite side of the range (loose)
glance_target: One range width, then trail under 5-minute swings
glance_size: 1% of capital per attempt; two attempts a day
evidence: LORE
topics: [orb, breakout]
related: []
tools: []
order: 10
sources:
  - Primary document title (enacted Act section, circular number or study + page) | https://example.org/primary.pdf | accessed 2026-11-01
  - Second source | https://example.org/second | accessed 2026-11-01
---
## Context & instruments

What the setup trades and why it exists; which instrument expresses it best and what the alternatives cost (theta, spread, lot size). Every changeable figure is a token: the lot size is {{fact:fo-nifty-lot}}, derived figures sit in the same sentence (40 × {{fact:fo-nifty-lot}} = ₹2,600 per lot) and the token is reused plain wherever the input reappears.

## Time window (IST)

When the range is marked, when entries are allowed, when to be flat. Session times come from the register, e.g. derivatives trade to {{fact:mkt-fo-session}} today.

## Pre-conditions

- Market state that must hold (gap, overnight news, GIFT Nifty move).
- Range or volatility filter.
- No scheduled release inside the window (link the calendar).

## Entry

The exact trigger (candle close, level, confirmation), one entry per side, the attempt limit.

## Stop

Where the stop sits and what it costs per lot, with the token for every lot size or point value it depends on.

## Target / exit

First target, how the remainder is trailed, the time stop.

## Position-size rule

Lots = floor(risk budget ÷ stop in rupees), with a worked example; for bought options size by premium at risk, not notional. Link the position-size calculator (`tools:` in the front matter adds the rail card).

## When NOT to trade

- Inside days or ranges below the filter.
- A scheduled event inside the window.
- Expiry day of the index traded, unless the playbook is an expiry-day playbook.

## Known failure modes

- **Whipsaw.** What it looks like and which rule limits it.
- **Slippage.** Fast markets, freeze-quantity splits.
- **Over-trading the variant.** Costs per attempt.

## Evidence label

:::evidence Lore, with partial evidence
- {{label:EVIDENCE}} A linked study or data set that supports part of the setup (author, year, what it measured).
- {{label:LORE}} The part practitioners claim without a public study; say so plainly.
:::

## Schematic

<figure class="schematic">
  <svg viewBox="0 0 720 280" role="img" aria-labelledby="sch-title">
    <title id="sch-title">Schematic of the setup: a shaded range band at the left, a price line that breaks above it, a short-dashed stop line at the range midpoint, a long-dashed target line one range width above the range high, and a dotted vertical at the entry. Tick marks on the time axis at the range start, the range end and the last entry time.</title>
    <line class="ax" x1="40" y1="250" x2="700" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="40" y1="20" x2="40" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="60" y1="250" x2="60" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="250" y1="250" x2="250" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="520" y1="250" x2="520" y2="262" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="60" y="150" width="190" height="70" rx="3" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="60,205 85,185 110,210 135,170 160,195 185,160 210,205 235,175 260,165 285,140 310,125 335,135 360,110 385,100 410,118 435,92 460,78 485,88 510,70" vector-effect="non-scaling-stroke"/>
    <line class="stop" x1="250" y1="185" x2="700" y2="185" vector-effect="non-scaling-stroke"/>
    <line class="target" x1="250" y1="80" x2="700" y2="80" vector-effect="non-scaling-stroke"/>
    <line class="entry" x1="285" y1="140" x2="285" y2="250" vector-effect="non-scaling-stroke"/>
  </svg>
  <figcaption class="legend">
    <ul>
      <li><span class="sw sw-band" aria-hidden="true"></span><span>Shaded band — the opening range</span></li>
      <li><span class="sw sw-line sw-price" aria-hidden="true"></span><span>Solid line — price, breaking above the range</span></li>
      <li><span class="sw sw-line sw-entry" aria-hidden="true"></span><span>Dotted vertical — entry: the first close above the range</span></li>
      <li><span class="sw sw-line sw-stop" aria-hidden="true"></span><span>Short-dashed ▼ line — stop at the range midpoint</span></li>
      <li><span class="sw sw-line sw-target" aria-hidden="true"></span><span>Long-dashed ▲ line — target one range width above the range high</span></li>
    </ul>
    <p>Time runs left to right; the tick marks are the range start, the range end and the last entry time. Schematic, not real data.</p>
  </figcaption>
</figure>

<!-- Sources render from the front matter after the body: list every primary document there with its accessed date.
     Rules the build enforces: exactly these eleven h2 in this order (use h3 inside a section); no <text> inside the
     schematic (every word goes in the legend); the legend ends with "Schematic, not real data."; glance_* ≤ 90 chars;
     every {{fact:id}} exists; a tokened fact's value is ≤ 60 chars; 550–1,400 words. -->
