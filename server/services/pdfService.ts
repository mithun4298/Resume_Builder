import puppeteer from "puppeteer";
import type { ResumeData } from "@shared/schema";

class PDFService {
  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  private generateHTMLTemplate(data: ResumeData, templateId: string): string {
    const { personalInfo, summary, experience, education, skills, projects, certifications } = data;
    // Helper to safely render HTML (for summary/project.description)
    const renderHTML = (html: string) => html || '';
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${personalInfo.firstName} ${personalInfo.lastName} - Resume</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.7; 
          color: #222;
          font-size: 12px;
          background: #f8fafc;
        }
        .container { max-width: 820px; margin: 0 auto; padding: 28px; background: #fff; border-radius: 12px; box-shadow: 0 2px 16px #0001; }
        .header { text-align: center; border-bottom: 3px solid #2563EB; padding-bottom: 18px; margin-bottom: 28px; }
        .name { font-size: 32px; font-weight: bold; margin-bottom: 6px; color: #1a1a1a; letter-spacing: 1px; }
        .title { font-size: 18px; color: #2563EB; margin-bottom: 12px; font-weight: 500; }
        .contact { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; font-size: 12px; color: #444; margin-bottom: 2px; }
        .section { margin-bottom: 28px; }
        .section-title { 
          font-size: 17px; 
          font-weight: bold; 
          color: #2563EB; 
          border-bottom: 2px solid #e5e5e5; 
          padding-bottom: 6px; 
          margin-bottom: 14px; 
          letter-spacing: 1px;
        }
        .experience-item, .education-item, .project-item, .cert-item { margin-bottom: 18px; }
        .job-header, .edu-header, .project-header, .cert-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start; 
          margin-bottom: 6px; 
        }
        .job-title, .degree, .project-name, .cert-name { font-weight: bold; font-size: 14px; }
        .company, .institution, .cert-issuer { color: #2563EB; font-size: 12px; font-weight: 500; }
        .date { color: #888; font-size: 11px; font-style: italic; }
        .bullets { margin-left: 18px; }
        .bullets li { margin-bottom: 4px; }
        .skills-grid { display: flex; gap: 36px; }
        .skill-category { flex: 1; }
        .skill-category h4 { font-weight: bold; margin-bottom: 6px; font-size: 12px; color: #2563EB; }
        .skill-tags { display: flex; flex-wrap: wrap; gap: 7px; }
        .skill-tag { 
          background: #e0e7ff; 
          color: #2563EB;
          padding: 3px 10px; 
          border-radius: 4px; 
          font-size: 10px; 
          font-weight: 500;
        }
        .summary-text { text-align: justify; margin-bottom: 2px; }
        @media print {
          body { font-size: 11px; }
          .container { padding: 10px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="name">${personalInfo.firstName} ${personalInfo.lastName}</div>
          <div class="title">${personalInfo.title}</div>
          <div class="contact">
            <span>${personalInfo.email}</span>
            <span>${personalInfo.phone}</span>
            ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ''}
            ${personalInfo.website ? `<span>${personalInfo.website}</span>` : ''}
          </div>
        </div>

        ${summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <div class="summary-text">${renderHTML(summary)}</div>
        </div>
        ` : ''}

        ${experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Work Experience</div>
          ${experience.map(exp => `
            <div class="experience-item">
              <div class="job-header">
                <div>
                  <div class="job-title">${exp.title}</div>
                  <div class="company">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
                </div>
                <div class="date">${this.formatDate(exp.startDate)} - ${exp.current ? 'Present' : this.formatDate(exp.endDate || '')}</div>
              </div>
              ${exp.bullets.length > 0 ? `
                <ul class="bullets">
                  ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${education.map(edu => `
            <div class="education-item">
              <div class="edu-header">
                <div>
                  <div class="degree">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
                  <div class="institution">${edu.institution}</div>
                </div>
                <div class="date">${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate || '')}</div>
              </div>
              ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${(skills.technical.length > 0 || skills.soft.length > 0) ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-grid">
            ${skills.technical.length > 0 ? `
              <div class="skill-category">
                <h4>Technical Skills</h4>
                <div class="skill-tags">
                  ${skills.technical.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            ${skills.soft.length > 0 ? `
              <div class="skill-category">
                <h4>Soft Skills</h4>
                <div class="skill-tags">
                  ${skills.soft.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
        ` : ''}

        ${projects.length > 0 ? `
        <div class="section">
          <div class="section-title">Projects</div>
          ${projects.map(project => `
            <div class="project-item">
              <div class="project-header">
                <div class="project-name">${project.name}</div>
                ${project.url ? `<div class="date">${project.url}</div>` : ''}
              </div>
              <div>${renderHTML(project.description)}</div>
              ${project.technologies.length > 0 ? `
                <div class="skill-tags" style="margin-top: 5px;">
                  ${project.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${certifications.length > 0 ? `
        <div class="section">
          <div class="section-title">Certifications</div>
          ${certifications.map(cert => `
            <div class="cert-item">
              <div class="cert-header">
                <div>
                  <div class="cert-name">${cert.name}</div>
                  <div class="cert-issuer">${cert.issuer}</div>
                </div>
                <div class="date">${this.formatDate(cert.date)}</div>
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </body>
    </html>
    `;
  }

  async generatePDF(data: ResumeData, templateId: string = "modern"): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      const html = this.generateHTMLTemplate(data, templateId);
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      });
      // Ensure we always return a Node.js Buffer
      return Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}

export const pdfService = new PDFService();
