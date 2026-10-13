import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Image,
} from '@react-pdf/renderer';
import { FullPortfolioData } from '@/lib/validations/portfolio';
import { getDictionary, SupportedLanguage } from '@/lib/i18n/dictionary';
import { sanitizePdfText } from '@/lib/pdf/sanitize-pdf-text';

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 36,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.35,
    color: '#374151',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#111827',
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  fullName: {
    fontSize: 20,
    lineHeight: 1.2,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 5,
    letterSpacing: -0.3,
  },
  headline: {
    fontSize: 10.5,
    lineHeight: 1.3,
    fontFamily: 'Helvetica-Bold',
    color: '#4B5563',
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  contactItem: {
    fontSize: 8.5,
    color: '#4B5563',
  },
  contactLink: {
    fontSize: 8.5,
    color: '#1D4ED8',
    textDecoration: 'none',
  },
  avatarContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    marginLeft: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  section: {
    marginTop: 9,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    borderBottomWidth: 0.75,
    borderBottomColor: '#D1D5DB',
    paddingBottom: 2,
    marginBottom: 5,
  },
  itemBlock: {
    marginBottom: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  itemTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    flex: 1,
  },
  itemSubtitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: '#4B5563',
  },
  itemDateLocation: {
    fontSize: 8,
    color: '#6B7280',
    textAlign: 'right',
    marginLeft: 8,
  },
  itemDescription: {
    fontSize: 8.5,
    color: '#374151',
    marginTop: 2,
    lineHeight: 1.35,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 3,
  },
  tagPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 3,
    fontSize: 7.5,
    color: '#374151',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillItem: {
    backgroundColor: '#F9FAFB',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  skillName: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  skillLevel: {
    fontSize: 7.5,
    color: '#6B7280',
  },
  highlightsList: {
    marginTop: 3,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  bulletDot: {
    fontSize: 9,
    color: '#4B5563',
    marginRight: 4,
  },
  bulletText: {
    fontSize: 8.5,
    color: '#374151',
    flex: 1,
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7.5,
    color: '#9CA3AF',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    paddingTop: 4,
  },
});

function formatCvDate(
  dateVal: string | Date | null | undefined,
  lang: string
): string {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';

  const monthsId = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];
  const monthsEn = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const month = lang === 'en' ? monthsEn[d.getMonth()] : monthsId[d.getMonth()];
  return `${month} ${d.getFullYear()}`;
}

interface CvPdfDocumentProps {
  portfolio: FullPortfolioData;
  language?: SupportedLanguage;
  avatarDataUri?: string | null;
  appDomain?: string;
}

export function CvPdfDocument({
  portfolio,
  language = 'id',
  avatarDataUri,
  appDomain,
}: CvPdfDocumentProps) {
  const t = getDictionary(language);

  const profile = portfolio.profile;
  const contact = portfolio.contactInfo;
  const about = portfolio.about;
  const socialLinks = [...(portfolio.socialLinks || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const experiences = [...(portfolio.experiences || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const educations = [...(portfolio.educations || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const skills = [...(portfolio.skills || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const projects = [...(portfolio.projects || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const certifications = [...(portfolio.certifications || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const testimonials = [...(portfolio.testimonials || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  // Section order from portfolio config, fallback to standard order
  const orderList = portfolio.sectionOrder && portfolio.sectionOrder.length > 0
    ? portfolio.sectionOrder
    : [
        'about',
        'experience',
        'education',
        'skills',
        'projects',
        'certifications',
        'testimonials',
      ];

  const accentColor = portfolio.accentColor || '#111827';

  // Render individual sections dynamically based on key
  const renderSectionByKey = (sectionKey: string) => {
    switch (sectionKey) {
      case 'about': {
        const hasBio = !!about?.bio && about.bio.trim().length > 0;
        const highlights: string[] = Array.isArray(about?.keyHighlights)
          ? (about.keyHighlights as string[]).filter(Boolean)
          : [];

        if (!hasBio && highlights.length === 0) return null;

        return (
          <View key="about" style={styles.section} wrap={false}>
            <Text
              style={[
                styles.sectionTitle,
                { borderBottomColor: accentColor },
              ]}
            >
              {sanitizePdfText(t.sections.about)}
            </Text>
            {hasBio && (
              <Text style={styles.itemDescription}>
                {sanitizePdfText(about!.bio)}
              </Text>
            )}
            {highlights.length > 0 && (
              <View style={styles.highlightsList}>
                {highlights.map((hl, idx) => (
                  <View key={idx} style={styles.bulletPoint}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{sanitizePdfText(hl)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      }

      case 'experience': {
        if (experiences.length === 0) return null;

        return (
          <View key="experience" style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { borderBottomColor: accentColor },
              ]}
            >
              {sanitizePdfText(t.sections.experience)}
            </Text>
            {experiences.map((exp, idx) => {
              const startFormatted = formatCvDate(exp.startDate, language);
              const endFormatted = exp.isCurrent
                ? t.present
                : formatCvDate(exp.endDate, language);
              const dateRange = startFormatted
                ? `${startFormatted} - ${endFormatted || t.present}`
                : '';

              const metaInfo = [exp.employmentType, exp.location]
                .filter(Boolean)
                .join(' • ');

              return (
                <View key={exp.id || idx} style={styles.itemBlock} wrap={false}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>
                      {sanitizePdfText(exp.position)}
                    </Text>
                    <Text style={styles.itemDateLocation}>
                      {sanitizePdfText(dateRange)}
                    </Text>
                  </View>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemSubtitle}>
                      {sanitizePdfText(exp.company)}
                    </Text>
                    {metaInfo ? (
                      <Text style={styles.itemDateLocation}>
                        {sanitizePdfText(metaInfo)}
                      </Text>
                    ) : null}
                  </View>
                  {exp.description ? (
                    <Text style={styles.itemDescription}>
                      {sanitizePdfText(exp.description)}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        );
      }

      case 'education': {
        if (educations.length === 0) return null;

        return (
          <View key="education" style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { borderBottomColor: accentColor },
              ]}
            >
              {sanitizePdfText(t.sections.education)}
            </Text>
            {educations.map((edu, idx) => {
              const startFormatted = formatCvDate(edu.startDate, language);
              const endFormatted = edu.isCurrent
                ? t.present
                : formatCvDate(edu.endDate, language);
              const dateRange = startFormatted
                ? `${startFormatted} - ${endFormatted || t.present}`
                : '';

              const degreeLine = [edu.degree, edu.fieldOfStudy]
                .filter(Boolean)
                .join(', ');

              return (
                <View key={edu.id || idx} style={styles.itemBlock} wrap={false}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>
                      {sanitizePdfText(edu.institution)}
                    </Text>
                    <Text style={styles.itemDateLocation}>
                      {sanitizePdfText(dateRange)}
                    </Text>
                  </View>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemSubtitle}>
                      {sanitizePdfText(degreeLine)}
                    </Text>
                    {edu.gpa ? (
                      <Text style={styles.itemDateLocation}>
                        {sanitizePdfText(`${t.gpa}: ${edu.gpa}`)}
                      </Text>
                    ) : null}
                  </View>
                  {edu.description ? (
                    <Text style={styles.itemDescription}>
                      {sanitizePdfText(edu.description)}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        );
      }

      case 'skills': {
        if (skills.length === 0) return null;

        return (
          <View key="skills" style={styles.section} wrap={false}>
            <Text
              style={[
                styles.sectionTitle,
                { borderBottomColor: accentColor },
              ]}
            >
              {sanitizePdfText(t.sections.skills)}
            </Text>
            <View style={styles.skillsGrid}>
              {skills.map((skill, idx) => (
                <View key={skill.id || idx} style={styles.skillItem}>
                  <Text style={styles.skillName}>
                    {sanitizePdfText(skill.name)}
                  </Text>
                  {skill.level ? (
                    <Text style={styles.skillLevel}>
                      ({sanitizePdfText(skill.level)})
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        );
      }

      case 'projects': {
        if (projects.length === 0) return null;

        return (
          <View key="projects" style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { borderBottomColor: accentColor },
              ]}
            >
              {sanitizePdfText(t.sections.projects)}
            </Text>
            {projects.map((proj, idx) => {
              const tagsList: string[] = Array.isArray(proj.tags)
                ? (proj.tags as string[]).filter(Boolean)
                : [];

              return (
                <View key={proj.id || idx} style={styles.itemBlock} wrap={false}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>
                      {sanitizePdfText(proj.title)}
                    </Text>
                    {proj.liveUrl ? (
                      <Link src={proj.liveUrl} style={styles.contactLink}>
                        {sanitizePdfText(t.viewStudy)}
                      </Link>
                    ) : proj.githubUrl ? (
                      <Link src={proj.githubUrl} style={styles.contactLink}>
                        {sanitizePdfText(t.sourceCode)}
                      </Link>
                    ) : null}
                  </View>
                  {proj.tagline ? (
                    <Text style={styles.itemSubtitle}>
                      {sanitizePdfText(proj.tagline)}
                    </Text>
                  ) : null}
                  {proj.description ? (
                    <Text style={styles.itemDescription}>
                      {sanitizePdfText(proj.description)}
                    </Text>
                  ) : null}
                  {tagsList.length > 0 && (
                    <View style={styles.tagsRow}>
                      {tagsList.map((tag, tIdx) => (
                        <Text key={tIdx} style={styles.tagPill}>
                          {sanitizePdfText(tag)}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        );
      }

      case 'certifications': {
        if (certifications.length === 0) return null;

        return (
          <View key="certifications" style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { borderBottomColor: accentColor },
              ]}
            >
              {sanitizePdfText(t.sections.certifications)}
            </Text>
            {certifications.map((cert, idx) => {
              const issueFormatted = formatCvDate(cert.issueDate, language);

              return (
                <View key={cert.id || idx} style={styles.itemBlock} wrap={false}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>
                      {sanitizePdfText(cert.title)}
                    </Text>
                    {issueFormatted ? (
                      <Text style={styles.itemDateLocation}>
                        {sanitizePdfText(issueFormatted)}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemSubtitle}>
                      {sanitizePdfText(cert.issuer)}
                    </Text>
                    {cert.credentialId ? (
                      <Text style={styles.itemDateLocation}>
                        {sanitizePdfText(`${t.credentialId}: ${cert.credentialId}`)}
                      </Text>
                    ) : null}
                  </View>
                  {cert.credentialUrl ? (
                    <Link src={cert.credentialUrl} style={styles.contactLink}>
                      {sanitizePdfText(t.verifyCredential)}
                    </Link>
                  ) : null}
                </View>
              );
            })}
          </View>
        );
      }

      case 'testimonials': {
        if (testimonials.length === 0) return null;

        return (
          <View key="testimonials" style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { borderBottomColor: accentColor },
              ]}
            >
              {sanitizePdfText(t.sections.testimonials)}
            </Text>
            {testimonials.map((testi, idx) => (
              <View key={testi.id || idx} style={styles.itemBlock} wrap={false}>
                <Text style={[styles.itemDescription, { fontStyle: 'italic' }]}>
                  {`"${sanitizePdfText(testi.quote)}"`}
                </Text>
                <Text style={styles.itemSubtitle}>
                  - {sanitizePdfText(testi.name)}
                  {testi.role ? `, ${sanitizePdfText(testi.role)}` : ''}
                  {testi.company ? ` (${sanitizePdfText(testi.company)})` : ''}
                </Text>
              </View>
            ))}
          </View>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Document
      title={sanitizePdfText(`CV - ${profile?.fullName || portfolio.slug}`)}
      author={sanitizePdfText(profile?.fullName || 'Portfolio Builder')}
      subject={sanitizePdfText(t.cvDossier)}
    >
      <Page size="A4" style={styles.page} wrap>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.fullName}>
              {sanitizePdfText(profile?.fullName || 'Full Name')}
            </Text>

            {profile?.headline ? (
              <Text style={styles.headline}>
                {sanitizePdfText(profile.headline)}
              </Text>
            ) : null}

            {/* CONTACT ROW */}
            <View style={styles.contactRow}>
              {contact?.email ? (
                <Text style={styles.contactItem}>
                  {sanitizePdfText(t.contact.email)}: {sanitizePdfText(contact.email)}
                </Text>
              ) : null}

              {contact?.phone ? (
                <Text style={styles.contactItem}>
                  {sanitizePdfText(t.contact.phone)}: {sanitizePdfText(contact.phone)}
                </Text>
              ) : null}

              {contact?.whatsapp ? (
                <Text style={styles.contactItem}>
                  {sanitizePdfText(t.contact.whatsapp)}: {sanitizePdfText(contact.whatsapp)}
                </Text>
              ) : null}

              {profile?.location ? (
                <Text style={styles.contactItem}>
                  {sanitizePdfText(t.atAGlance.location)}: {sanitizePdfText(profile.location)}
                </Text>
              ) : null}

              {portfolio.slug ? (() => {
                const baseHost = appDomain
                  ? appDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')
                  : typeof window !== 'undefined' && window.location.host
                  ? window.location.host
                  : 'portfolio-builder.com';
                const fullUrl = `https://${baseHost}/u/${portfolio.slug}`;
                const displayUrl = `${baseHost}/u/${portfolio.slug}`;

                return (
                  <Text style={styles.contactItem}>
                    {sanitizePdfText(t.cvExport.curatedPortfolio)}:{' '}
                    <Link src={fullUrl} style={styles.contactLink}>
                      {sanitizePdfText(displayUrl)}
                    </Link>
                  </Text>
                );
              })() : null}

              {/* SOCIAL / PORTFOLIO LINKS */}
              {socialLinks.map((s, idx) => (
                <Link key={s.id || idx} src={s.url} style={styles.contactLink}>
                  {sanitizePdfText(s.platform)}
                </Link>
              ))}
            </View>
          </View>

          {/* AVATAR (Optional) */}
          {avatarDataUri ? (
            <View style={styles.avatarContainer}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={avatarDataUri} style={styles.avatar} />
            </View>
          ) : null}
        </View>

        {/* DYNAMIC SECTIONS FOLLOWING SECTION ORDER */}
        {orderList.map((secKey) => renderSectionByKey(secKey))}

        {/* FOOTER PAGINATION */}
        <View style={styles.footerText} fixed>
          <Text>
            {sanitizePdfText(profile?.fullName || '')} • {sanitizePdfText(t.cvDossier)}
          </Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${sanitizePdfText(t.cvExport.page)} ${pageNumber} ${sanitizePdfText(t.cvExport.of)} ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
