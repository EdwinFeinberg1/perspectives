import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import { Prayer } from "@/app/constants/prayers";

interface PrayerNotificationEmailProps {
  userName?: string;
  prayers: Prayer[];
  frequency: "daily" | "weekly" | "monthly";
  appUrl?: string;
}

export const PrayerNotificationEmail: React.FC<
  Readonly<PrayerNotificationEmailProps>
> = ({ userName = "Friend", prayers, frequency, appUrl = "" }) => {
  const previewText = `Your ${frequency} prayer reminder - ${
    prayers.length
  } prayer${prayers.length !== 1 ? "s" : ""} to inspire your day`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your {frequency} Prayer Reminder</Heading>

          <Text style={greeting}>Dear {userName},</Text>

          <Text style={paragraph}>
            Here are your favorite prayers to inspire and guide you{" "}
            {frequency === "daily"
              ? "today"
              : frequency === "weekly"
                ? "this week"
                : "this month"}
            .
          </Text>

          {prayers.map((prayer, index) => (
            <Section key={prayer.id} style={prayerSection}>
              <Text style={prayerTitle}>{prayer.title}</Text>
              <Text style={prayerFaith}>
                {prayer.faith} • {prayer.category}
              </Text>
              <Text style={prayerText}>{prayer.text}</Text>
              {prayer.translation && (
                <Text style={prayerTranslation}>
                  Translation: {prayer.translation}
                </Text>
              )}
              {index < prayers.length - 1 && <Hr style={divider} />}
            </Section>
          ))}

          <Hr style={divider} />

          <Text style={footer}>
            You're receiving this email because you've enabled prayer
            notifications in your Sephira account. To manage your notification
            preferences, visit your{" "}
            <Link href={`${appUrl}/prayer/settings`} style={link}>
              notification settings
            </Link>
            .
          </Text>

          <Text style={signature}>
            With peace and blessings,
            <br />
            The Sephira Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
  padding: "0 48px",
};

const greeting = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 10px",
  padding: "0 48px",
};

const paragraph = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 30px",
  padding: "0 48px",
};

const prayerSection = {
  padding: "0 48px",
  marginBottom: "30px",
};

const prayerTitle = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "600",
  lineHeight: "24px",
  margin: "0 0 8px",
};

const prayerFaith = {
  color: "#888",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "0 0 12px",
  textTransform: "capitalize" as const,
};

const prayerText = {
  color: "#555",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const prayerTranslation = {
  color: "#777",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "12px 0 0",
  fontStyle: "italic",
};

const divider = {
  borderColor: "#e6e6e6",
  margin: "30px 0",
};

const footer = {
  color: "#999",
  fontSize: "12px",
  lineHeight: "20px",
  margin: "0",
  padding: "0 48px",
};

const link = {
  color: "#556cd6",
  textDecoration: "underline",
};

const signature = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "30px 0 0",
  padding: "0 48px",
};

export default PrayerNotificationEmail;
