/**
 * Last Thursday // Project Data
 *
 * Each project entry represents one week's build.
 * Fill in the fields as projects are completed.
 *
 * Fields:
 *   id          - URL-safe slug (used in hash routing)
 *   week        - Week number
 *   title       - Project name
 *   description - Short summary (1-2 sentences)
 *   tags        - Array of tech/topic tags
 *   hasDemo     - Whether a live demo is available
 *   demo        - Object with demo config (see below)
 *   readme      - HTML string of the project README
 *   videos      - Array of { url, label } for YouTube embeds
 *   resources   - Array of { icon, title, description, url }
 *
 * Demo object:
 *   type: "iframe" | "link" | "none"
 *   url:  URL to embed or link to
 *
 * To add a new project, copy a template block below and fill it in.
 */

const PROJECTS = [
    {
        id: "week-1",
        week: 1,
        title: "Week 1 Project",
        description: "The first thing we built. Replace this with the actual project description.",
        tags: ["HTML", "CSS", "JavaScript"],
        hasDemo: false,
        demo: {
            type: "none",
            url: ""
        },
        readme: `
            <h2>Week 1 Project</h2>
            <p>Replace this with the actual README content from the GitHub repo.</p>
            <p>You can paste raw HTML here or write it inline.</p>
        `,
        videos: [
            // { url: "https://www.youtube.com/embed/VIDEO_ID", label: "Monday // Intro" },
            // { url: "https://www.youtube.com/embed/VIDEO_ID", label: "Tuesday // Build Session" },
        ],
        resources: [
            // { icon: "📦", title: "GitHub Repo", description: "Source code", url: "https://github.com/..." },
            // { icon: "📖", title: "MDN Docs", description: "Reference material", url: "https://developer.mozilla.org/..." },
        ]
    },
    {
        id: "week-2",
        week: 2,
        title: "Week 2 Project",
        description: "Replace this with the actual project description.",
        tags: ["HTML", "CSS", "JavaScript"],
        hasDemo: false,
        demo: {
            type: "none",
            url: ""
        },
        readme: `
            <h2>Week 2 Project</h2>
            <p>Replace this with the actual README content from the GitHub repo.</p>
        `,
        videos: [],
        resources: []
    },
    {
        id: "week-3",
        week: 3,
        title: "Week 3 Project",
        description: "Replace this with the actual project description.",
        tags: ["HTML", "CSS", "JavaScript"],
        hasDemo: false,
        demo: {
            type: "none",
            url: ""
        },
        readme: `
            <h2>Week 3 Project</h2>
            <p>Replace this with the actual README content from the GitHub repo.</p>
        `,
        videos: [],
        resources: []
    },
    {
        id: "last-thursday",
        week: 4,
        title: "Last Thursday",
        description: "This project // a meta-repo that indexes everything we've built in the class.",
        tags: ["HTML", "CSS", "JavaScript", "Meta"],
        hasDemo: true,
        demo: {
            type: "link",
            url: "#"
        },
        readme: `
            <h2>Last Thursday</h2>
            <p>A web-based archive of every project built in the Multiverse Schools Learn to Code class.</p>
            <h3>Features</h3>
            <ul>
                <li>Project cards with at-a-glance info</li>
                <li>Embedded demos for working tools</li>
                <li>README content from each repo</li>
                <li>YouTube session recordings</li>
                <li>Reference materials and resources</li>
            </ul>
        `,
        videos: [],
        resources: [
            { icon: "📦", title: "GitHub Repo", description: "This project's source code", url: "#" },
        ]
    },
];
