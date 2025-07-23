// Dummy IT/Technical resume data for template previews
import type { ResumeData } from "../../../shared/schema";
export const dummyITResumeData: ResumeData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    title: "Software Engineer",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "linkedin.com/in/johndoe",
    github: "github.com/johndoe"
  },
  summary: "<p>Experienced software engineer with 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies.</p>",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Corp",
      location: "",
      startDate: "2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Led development of scalable web applications using React and Node.js"
      ]
    },
    {
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "",
      startDate: "2019",
      endDate: "2021",
      current: false,
      bullets: [
        "Built and maintained multiple client applications"
      ]
    }
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "B.S.",
      field: "Computer Science",
      startDate: "2015",
      endDate: "2019",
      gpa: ""
    }
  ],
  skills: {
    technical: [
      "JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "Git"
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
