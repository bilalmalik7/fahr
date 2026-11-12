// "This week in AI" data. A scheduled task replaces this file every week.
// Keep the shape: updated (text), items (3-5, newest week), archive (older weeks, max 8).
window.WEEKLY = {
  updated: "12 November 2026",
  items: [
    {
      title: "Google releases Gemini 4 Carbon",
      what: "Google put its new model Gemini 4 Carbon on the paid API on 10 November. News sites report it leads several tests for agent work, and it has a feature that turns one prompt into a team of agents.",
      why: "Agent teams are becoming normal. The skill that stays valuable is checking what the agents did and giving them clean data.",
      tryit: "Read AI station K5 (Agents) and write down three tasks in your job that need several steps and a tool.",
      source: "AI Weekly",
      url: "https://aiweekly.co/ai-news-today"
    },
    {
      title: "IBM and Microsoft link agents to Fabric",
      what: "On 10 November IBM and Microsoft showed Imagine Enterprise, a platform that joins thousands of ready-made IBM agents with Microsoft tools, and Fabric is one of them.",
      why: "This is your exact direction. Companies want agents that work on governed data, and Fabric is where Microsoft keeps that data.",
      tryit: "Open Fabric station F9 (Security) and do the three questions. Agents only see what security lets them see.",
      source: "AI Weekly",
      url: "https://aiweekly.co/ai-news-today"
    },
    {
      title: "An open model with a 1-million-token memory",
      what: "The Chinese company Meituan published the weights of its model LongCat-2.5 on 9 November under the free MIT licence. It can read about 1 million tokens at once and is built for long agent tasks.",
      why: "Open models can run inside a company, which matters in Germany because of data protection. Long context does not replace RAG; it only moves the limit.",
      tryit: "In AI station K3, ask the RAG demo a question and look at how few chunks are needed for a good answer.",
      source: "AI Weekly",
      url: "https://aiweekly.co/ai-news-today"
    },
    {
      title: "AWS ships a tool written by AI agents",
      what: "AWS released a free local emulator for more than 200 of its services. The company says agents wrote all of the code.",
      why: "Writing routine code is getting cheap. Testing, reviewing and deploying it safely is the human part, and that is what the DevOps line teaches.",
      tryit: "Run the pipeline simulator in DevOps station O3 with the bug switch on and see how a test protects production.",
      source: "RIO Rundown",
      url: "https://riorundown.substack.com/p/ai-news-nov-12-2026-ai-agents-infrastructure"
    }
  ],
  archive: []
};
