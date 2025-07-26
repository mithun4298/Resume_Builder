import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const getTemplateStyles = (template: string) => {
  const baseStyles = {
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 30,
    },
    section: {
      marginBottom: 15,
    },
    itemTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 3,
    },
    itemSubtitle: {
      fontSize: 12,
      color: '#666666',
      fontStyle: 'italic',
      marginBottom: 5,
    },
    text: {
      fontSize: 11,
      lineHeight: 1.5,
      marginBottom: 8,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 5,
    },
    skillTag: {
      backgroundColor: '#f3f4f6',
      padding: '3 8',
      borderRadius: 10,
      fontSize: 10,
      marginRight: 5,
      marginBottom: 5,
    },
  };

  const templateStyles = {
    modern: {
      ...baseStyles,
      header: {
        marginBottom: 20,
        textAlign: 'center',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        padding: 15,
        borderRadius: 8,
      },
      name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5,
      },
      contactInfo: {
        fontSize: 12,
        color: '#ffffff',
      },
      sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#2563eb',
        paddingBottom: 3,
      },
    },
    classic: {
      ...baseStyles,
      header: {
        marginBottom: 20,
        textAlign: 'center',
        borderBottomWidth: 3,
        borderBottomColor: '#000000',
        paddingBottom: 10,
      },
      name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 5,
      },
      contactInfo: {
        fontSize: 12,
        color: '#666666',
      },
      sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingBottom: 3,
        textTransform: 'uppercase',
      },
    },
    creative: {
      ...baseStyles,
      header: {
        marginBottom: 20,
        textAlign: 'center',
        backgroundColor: '#7c3aed',
        color: '#ffffff',
        padding: 15,
        borderRadius: 15,
      },
      name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5,
      },
      contactInfo: {
        fontSize: 12,
        color: '#ffffff',
      },
      sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7c3aed',
        marginBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#7c3aed',
        paddingBottom: 3,
        backgroundColor: '#f3e8ff',
        padding: 5,
        borderRadius: 5,
      },
    },
    minimal: {
      ...baseStyles,
      header: {
        marginBottom: 20,
        textAlign: 'left',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 10,
      },
      name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 5,
      },
      contactInfo: {
        fontSize: 11,
        color: '#6b7280',
      },
      sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#d1d5db',
        paddingBottom: 2,
      },
    },
  };

  return StyleSheet.create(templateStyles[template] || templateStyles.modern);
};

interface ResumePDFProps {
  resumeData: any;
  template?: string;
}

export const ResumePDF: React.FC<ResumePDFProps> = ({ resumeData, template = 'modern' }) => {
  const styles = getTemplateStyles(template);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
          </Text>
          <Text style={styles.contactInfo}>
            {[
              resumeData.personalInfo.email,
              resumeData.personalInfo.phone,
              resumeData.personalInfo.location
            ].filter(Boolean).join(' | ')}
          </Text>
        </View>

        {/* Professional Summary */}
        {resumeData.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.text}>{resumeData.summary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {resumeData.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
            {resumeData.experiences.map((exp: any, index: number) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.itemTitle}>{exp.position}</Text>
                <Text style={styles.itemSubtitle}>
                  {exp.company} | {exp.startDate} - {exp.endDate || 'Present'}
                </Text>
                {exp.description && (
                  <Text style={styles.text}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {resumeData.education.map((edu: any, index: number) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                <Text style={styles.itemSubtitle}>
                  {edu.school} | {edu.graduationDate}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SKILLS</Text>
            <View style={styles.skillsContainer}>
              {resumeData.skills.map((skill: any, index: number) => (
                <Text key={index} style={styles.skillTag}>
                  {skill.name}
                </Text>
              ))}
            </View>
          </View>
        )}
        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
            {resumeData.certifications.map((cert: any, index: number) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={styles.itemTitle}>{cert.name}</Text>
                {cert.issuer && (
                  <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
                )}
                {cert.date && (
                  <Text style={styles.text}>{cert.date}</Text>
                )}
              </View>
            ))}
          </View>
        )}
        {/* Projects */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {resumeData.projects.map((proj: any, index: number) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.itemTitle}>{proj.title}</Text>
                {proj.url && (
                  <Text style={styles.itemSubtitle}>{proj.url}</Text>
                )}
                {proj.description && (
                  <Text style={styles.text}>{proj.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

// Export function to generate and download PDF
export const downloadResumePDF = async (resumeData: any, template: string = 'modern') => {
  try {
    const blob = await pdf(<ResumePDF resumeData={resumeData} template={template} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume_${template}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};