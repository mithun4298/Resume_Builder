// Dummy IT/Technical resume data for template previews
import type { ResumeData } from "../../../shared/schema";
export const dummyITResumeData: ResumeData = {
  personalInfo: {
    firstName: "Mithun",
    lastName: "Kumar",
    title: "Full Stack Developer",
    email: "mithun.kumar@example.com",
    phone: "+91-9546333144",
    location: "San Francisco, CA",
    website: "https://mithunkumar.dev"
  },
  summary: "<p>Results-driven Full Stack Developer with 6+ years of experience building scalable web applications and leading agile teams. Passionate about cloud, DevOps, and modern JavaScript frameworks.</p>",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "TechNova Solutions",
      location: "Remote",
      startDate: "2021-03",
      endDate: "",
      current: true,
      bullets: [
        "Led a team of 5 engineers to deliver a SaaS analytics platform (React, Node.js, AWS).",
        "Implemented CI/CD pipelines with GitHub Actions and Docker, reducing deployment time by 40%.",
        "Mentored junior developers and conducted code reviews for best practices."
      ]
    },
    {
      title: "Full Stack Developer",
      company: "Cloudify Inc.",
      location: "San Jose, CA",
      startDate: "2018-06",
      endDate: "2021-02",
      current: false,
      bullets: [
        "Developed RESTful APIs and microservices using Node.js and Express.",
        "Built responsive UIs with React and TypeScript, improving user engagement by 30%.",
        "Integrated third-party APIs (Stripe, Auth0) and managed AWS infrastructure."
      ]
    }
  ],
  education: [
    {
      institution: "Stanford University",
      degree: "B.S.",
      field: "Computer Science",
      startDate: "2014-09",
      endDate: "2018-06",
      gpa: "3.8"
    }
  ],
  skills: {
    technical: [
      "JavaScript", "TypeScript", "React", "Node.js", "Express", "AWS", "Docker", "PostgreSQL", "GraphQL", "CI/CD"
    ],
    soft: [
      "Agile Leadership", "Mentoring", "Problem Solving", "Communication"
    ]
  },
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2022-05",
      url: "https://aws.amazon.com/certification/"
    },
    {
      name: "Certified Kubernetes Administrator",
      issuer: "CNCF",
      date: "2023-01",
      url: "https://www.cncf.io/certification/cka/"
    }
  ],
  projects: [
    {
      name: "DevOps Dashboard",
      description: "<ul><li>Built a real-time dashboard for monitoring CI/CD pipelines and cloud resources.</li><li>Stack: React, Node.js, AWS Lambda, DynamoDB.</li></ul>",
      technologies: ["React", "Node.js", "AWS Lambda", "DynamoDB"],
      url: "https://github.com/alexjohnson/devops-dashboard"
    },
    {
      name: "Open Source CLI Tool",
      description: "<ul><li>Created a CLI for automating deployment workflows.</li><li>Published on npm with 1k+ downloads.</li></ul>",
      technologies: ["Node.js", "TypeScript"],
      url: "https://github.com/alexjohnson/cli-tool"
    }
  ],
  sectionOrder: [
    "personal",
    "summary",
    "experience",
    "skills",
    "education",
    "certifications",
    "projects"
  ] as Array<"personal" | "summary" | "experience" | "skills" | "education" | "certifications" | "projects">
};
