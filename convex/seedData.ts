export interface SeedInsight {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  content: string;
}

/** Initial articles, mirrored from `src/content/insights/*.mdx`. */
export const seedInsights: SeedInsight[] = [
  {
    slug: "choosing-an-audit-firm",
    title: "Choosing an Audit Firm: Five Questions to Ask Before You Sign",
    description:
      "Fees matter, but independence, staffing and timeline are what determine whether an audit adds value or just paperwork.",
    date: "2026-09-12",
    readingTime: "4 min read",
    content: `An audit is a statutory requirement for many organisations, but the firm you choose shapes how smoothly the process runs — and how much you learn from it. Before signing an engagement letter, these five questions are worth asking.

## 1. Are they truly independent?

Independence is not a formality — it is the foundation of an audit opinion. Ask what other work the firm does for you (tax, advisory, bookkeeping) and how they safeguard their objectivity. An audit firm that also prepares your financial statements cannot audit them.

## 2. Who will actually do the work?

Audit teams are often staffed with juniors and supervised remotely. Ask how many hours the engagement partner will personally spend on your file, and who your day-to-day contact will be. A named, reachable team prevents the mid-fieldwork scramble.

## 3. Do they understand your sector?

A charity's grant compliance, a manufacturer's inventory counts and a tech firm's revenue recognition each demand different experience. Ask for examples of audits in your sector — not client names, just the type of work.

## 4. What is the realistic timeline?

Firms quote fee and deadline, but rarely the dependency chain: when your books must be ready, how long fieldwork takes, when the board can review. Agree these dates up front so filing deadlines are not negotiated in a panic.

## 5. What will you get beyond the opinion?

The best audits produce a management letter with concrete, prioritised recommendations. Ask whether that is included, and whether a closing meeting to walk through findings is standard.

## The bottom line

Fee is the easiest number to compare and the least predictive of value. A slightly higher fee from a team that understands your sector, meets its deadlines and delivers a useful management letter is almost always the cheaper option in the long run.`,
  },
  {
    slug: "cash-flow-forecasting-for-smes",
    title: "Cash Flow Forecasting: A Practical Starting Point for SMEs",
    description:
      "A simple 13-week cash flow forecast helps you see shortfalls before they happen — here is how to build one.",
    date: "2026-09-26",
    readingTime: "5 min read",
    content: `Most small businesses do not fail because they are unprofitable — they fail because cash runs out before the money they are owed arrives. A rolling 13-week cash flow forecast is the simplest tool for seeing those gaps in advance.

## Why 13 weeks?

A year-long forecast is too coarse to act on; a weekly view of the next quarter is short enough to be accurate and long enough to give you room to respond. It answers one question: *on which weeks will my bank balance dip below zero?*

## What you need to start

- Opening bank balance
- Expected cash sales and collections on outstanding invoices (by expected week, not invoice date)
- Fixed outflows: rent, salaries, loan repayments
- Variable outflows: suppliers, utilities, tax instalments due

No accounting package required — a spreadsheet with one column per week is enough to begin.

## Building the forecast

1. **List your inflows by week.** Use your receivables ageing, and be honest about who pays late. A customer who usually pays in 60 days does not pay in 30 because you wrote it down.
2. **List your outflows by week.** Payroll and rent are fixed dates; suppliers vary, so use actual payment patterns.
3. **Net the two and carry the balance forward.** Week two starts with week one's closing balance. The rolling mechanic is what makes the forecast self-correcting.
4. **Flag the danger weeks.** Highlight any week where the balance turns negative or falls below a buffer you choose.

## What to do with the answer

A projected shortfall is information, not a verdict. Common responses include pulling forward a collection call, delaying a non-critical purchase, negotiating a payment plan with a supplier, or arranging a facility *before* the week in question — not during it.

## Keep it alive

The forecast is only useful if it reflects reality. Update it weekly against actual bank balances, and investigate variances: an invoice that did not land when expected is often an early warning about a customer, not just a forecasting error.

## The bottom line

Thirteen weeks of visibility changes decisions from reactive to deliberate. Start with rough numbers this week, refine them as patterns emerge, and you will know about a cash crunch while there is still time to plan around it.`,
  },
];
