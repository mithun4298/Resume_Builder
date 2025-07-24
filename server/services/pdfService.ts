import PDFDocument from 'pdfkit';
import { ResumeData } from '../shared/schema.js'; // Fixed import path

export class PDFService {
  async generatePDF(data: ResumeData, _templateId: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Generate PDF content
        this.generateHTMLTemplate(data);
        
        // Add content to PDF
        this.addPersonalInfo(doc, data);
        this.addSummary(doc, data);
        this.addExperience(doc, data);
        this.addEducation(doc, data);
        this.addSkills(doc, data);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private generateHTMLTemplate(data: ResumeData): string {
    return `<html><body>${data.personalInfo.firstName} ${data.personalInfo.lastName}</body></html>`;
  }

  private addPersonalInfo(doc: InstanceType<typeof PDFDocument>, data: ResumeData): void {
    doc.fontSize(20).text(`${data.personalInfo.firstName} ${data.personalInfo.lastName}`, 50, 50);
    doc.fontSize(12).text(data.personalInfo.email, 50, 80);
    if (data.personalInfo.phone) {
      doc.text(data.personalInfo.phone, 50, 95);
    }
  }

  private addSummary(doc: InstanceType<typeof PDFDocument>, data: ResumeData): void {
    if (data.summary) {
      doc.fontSize(16).text('Summary', 50, 130);
      doc.fontSize(12).text(data.summary, 50, 150);
    }
  }

  private addExperience(doc: InstanceType<typeof PDFDocument>, data: ResumeData): void {
    let yPosition = 200;
    doc.fontSize(16).text('Experience', 50, yPosition);
    yPosition += 20;

    data.experience.forEach((exp) => {
      doc.fontSize(14).text(exp.title, 50, yPosition);
      doc.fontSize(12).text(exp.company, 50, yPosition + 15);
      doc.fontSize(11).text(`${this.formatDate(exp.startDate)} - ${exp.endDate ? this.formatDate(exp.endDate) : 'Present'}`, 50, yPosition + 30);
      
      // Use bullets instead of description
      if (exp.bullets && exp.bullets.length > 0) {
        let bulletY = yPosition + 45;
        exp.bullets.forEach((bullet) => {
          doc.fontSize(10).text(`• ${bullet}`, 50, bulletY, { width: 500 });
          bulletY += 15;
        });
      }
      
      yPosition += 80;
    });
  }

  private addEducation(doc: InstanceType<typeof PDFDocument>, data: ResumeData): void {
    let yPosition = 400;
    doc.fontSize(16).text('Education', 50, yPosition);
    yPosition += 20;

    data.education.forEach((edu) => {
      doc.fontSize(14).text(edu.degree, 50, yPosition);
      doc.fontSize(12).text(edu.institution, 50, yPosition + 15);
      doc.fontSize(11).text(`${this.formatDate(edu.startDate)} - ${edu.endDate ? this.formatDate(edu.endDate) : 'Present'}`, 50, yPosition + 30);
      yPosition += 60;
    });
  }

  private addSkills(doc: InstanceType<typeof PDFDocument>, data: ResumeData): void {
    let yPosition = 500;
    doc.fontSize(16).text('Skills', 50, yPosition);
    yPosition += 20;

    // Handle skills object structure
    if (data.skills.technical && data.skills.technical.length > 0) {
      doc.fontSize(12).text('Technical Skills:', 50, yPosition);
      doc.fontSize(10).text(data.skills.technical.join(', '), 50, yPosition + 15, { width: 500 });
      yPosition += 40;
    }

    if (data.skills.soft && data.skills.soft.length > 0) {
      doc.fontSize(12).text('Soft Skills:', 50, yPosition);
      doc.fontSize(10).text(data.skills.soft.join(', '), 50, yPosition + 15, { width: 500 });
      yPosition += 40;
    }
    if (data.skills.technical && data.skills.technical.length > 0) {
      doc.fontSize(12).text('Languages:', 50, yPosition);
      doc.fontSize(10).text(data.skills.technical.join(', '), 50, yPosition + 15, { width: 500 });
    }
  }

  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    } catch {
      return dateString;
    }
  }
}

export const pdfService = new PDFService();