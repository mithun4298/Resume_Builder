import React from "react";
import styles from "./MinimalistTemplate.module.css";
import type { ResumeData } from "@shared/schema";


const sectionRenderers: Record<string, (resumeData: ResumeData) => React.ReactNode> = {
  personal: (resumeData) => (
    <header className={styles.header}>
      <h1>{resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}</h1>
      <h2>{resumeData.personalInfo.title}</h2>
      <div className={styles.contact}>
        <span>{resumeData.personalInfo.email}</span> | <span>{resumeData.personalInfo.phone}</span> | <span>{resumeData.personalInfo.location}</span>
      </div>
    </header>
  ),
  summary: (resumeData) => (
    <section className={styles.section}>
      <h3>Summary</h3>
      <div dangerouslySetInnerHTML={{ __html: resumeData.summary }} />
    </section>
  ),
  experience: (resumeData) => (
    <section className={styles.section}>
      <h3>Experience</h3>
      {resumeData.experience.map((exp, i) => (
        <div key={i} className={styles.expItem}>
          <div className={styles.expHeader}>
            <span className={styles.expTitle}>{exp.title}</span> @ <span className={styles.expCompany}>{exp.company}</span>
          </div>
          <div className={styles.expMeta}>
            <span>{exp.location}</span> | <span>{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
          </div>
          <ul className={styles.expBullets}>
            {exp.bullets.map((b, j) => b && <li key={j}>{b}</li>)}
          </ul>
        </div>
      ))}
    </section>
  ),
  education: (resumeData) => (
    <section className={styles.section}>
      <h3>Education</h3>
      {resumeData.education.map((edu, i) => (
        <div key={i} className={styles.eduItem}>
          <span className={styles.eduDegree}>{edu.degree}</span>, {edu.field} - <span className={styles.eduInst}>{edu.institution}</span> ({edu.startDate} - {edu.endDate})
          {edu.gpa && <span className={styles.eduGpa}>GPA: {edu.gpa}</span>}
        </div>
      ))}
    </section>
  ),
  skills: (resumeData) => (
    <section className={styles.section}>
      <h3>Skills</h3>
      <div className={styles.skillsList}>
        {resumeData.skills.technical.map((s, i) => <span key={i} className={styles.skillBadge}>{s}</span>)}
        {resumeData.skills.soft.map((s, i) => <span key={i} className={styles.skillBadge}>{s}</span>)}
      </div>
    </section>
  ),
  certifications: (resumeData) => (
    <section className={styles.section}>
      <h3>Certifications</h3>
      <ul className={styles.certList}>
        {resumeData.certifications.map((cert, i) => (
          <li key={i}><strong>{cert.name}</strong> ({cert.issuer}, {cert.date})</li>
        ))}
      </ul>
    </section>
  ),
  projects: (resumeData) => (
    <section className={styles.section}>
      <h3>Projects</h3>
      {resumeData.projects.map((project, i) => (
        <div key={i} className={styles.expItem}>
          <div className={styles.expHeader}>
            <span className={styles.expTitle}>{project.name}</span>
            {project.url && (
              <span className={styles.expCompany} style={{ marginLeft: 8 }}>
                <a href={project.url} target="_blank" rel="noopener noreferrer">[Link]</a>
              </span>
            )}
          </div>
          <div className={styles.expMeta}>
            {project.technologies && project.technologies.length > 0 && (
              <span>Tech: {project.technologies.join(", ")}</span>
            )}
          </div>
          {project.description && (
            <div className={styles.expBullets}>
              <div dangerouslySetInnerHTML={{ __html: project.description }} />
            </div>
          )}
        </div>
      ))}
    </section>
  ),
};

const MinimalistTemplate: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
  const order = resumeData.sectionOrder && resumeData.sectionOrder.length > 0
    ? resumeData.sectionOrder
    : [
        "personal",
        "summary",
        "experience",
        "skills",
        "education",
        "certifications",
        "projects"
      ];

  return (
    <div className={styles.minimalistResume}>
      {order.map((key) => sectionRenderers[key] ? sectionRenderers[key](resumeData) : null)}
    </div>
  );
};

export default MinimalistTemplate;
