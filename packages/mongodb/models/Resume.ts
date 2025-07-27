import { modelOptions, prop, Severity } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { ObjectId } from "mongoose";

// Contact subdocument
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class ContactModel {
  @prop()
  website?: string;

  @prop()
  call?: string;

  @prop({ required: true })
  email: string;

  @prop()
  phone?: string;

  @prop()
  cv?: string;

  @prop()
  resume?: string;

  @prop()
  linkedin?: string;

  @prop()
  github?: string;

  @prop()
  npm?: string;

  @prop()
  telegram?: string;

  @prop()
  twitter?: string;

  @prop({ type: () => [Object] })
  socials?: {
    name: string;
    url: string;
    icon: string; // Store as string instead of IconProp
  }[];
}

// Content subdocument
export class ContentModel {
  @prop()
  title?: string;

  @prop()
  description?: string;

  @prop({ type: () => [String] })
  items?: string[];

  @prop()
  link?: string;
}

// Location subdocument
export class LocationModel {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  link: string;
}

// Experience subdocument
export class ExperienceModel {
  @prop({ required: true })
  company: string;

  @prop()
  link?: string;

  @prop({ type: () => [String] })
  badges?: string[];

  @prop({ required: true })
  title: string;

  @prop()
  logo?: string; // Store as string instead of ReactNode

  @prop({ required: true })
  start: string;

  @prop()
  end?: string;

  @prop({ type: () => [ContentModel] })
  contents: ContentModel[];
}

// Education subdocument
export class EducationModel {
  @prop({ required: true })
  company: string;

  @prop()
  link?: string;

  @prop({ type: () => [String] })
  badges?: string[];

  @prop({ required: true })
  title: string;

  @prop()
  logo?: string; // Store as string instead of ReactNode

  @prop({ required: true })
  start: string;

  @prop()
  end?: string;

  @prop({ required: true })
  description: string;
}

// Skill subdocument
export class SkillModel {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  years: number;
}

// Project subdocument
export class ProjectModel {
  @prop({ required: true })
  company: string;

  @prop()
  link?: string;

  @prop()
  image?: string;

  @prop({ type: () => [String] })
  badges?: string[];

  @prop({ required: true })
  title: string;

  @prop()
  logo?: string; // Store as string instead of ReactNode

  @prop()
  start?: string;

  @prop()
  end?: string;

  @prop({ required: true })
  description: string;
}

// Technology subdocument
export class TechnologyModel {
  @prop({ required: true })
  name: string;

  @prop()
  description?: string;

  @prop()
  link?: string;

  @prop({ required: true })
  image: string;

  @prop({ required: true })
  width: number;

  @prop({ required: true })
  height: number;
}

// Contribution subdocument
export class ContributionModel {
  @prop({ required: true })
  name: string;

  @prop()
  description?: string;

  @prop({ required: true })
  link: string;
}

// Main Resume model
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Resume extends TimeStamps {
  _id: ObjectId;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop()
  gender?: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  nick: string;

  @prop({ required: true })
  nameLink: string;

  @prop()
  initials?: string;

  @prop()
  initialsLink?: string;

  @prop({ type: () => [LocationModel] })
  locations: LocationModel[];

  @prop({ type: () => Object })
  languages: Record<string, string>;

  @prop({ type: () => [ContentModel] })
  about: ContentModel[];

  @prop({ required: true })
  aboutLink: string;

  @prop({ type: () => [ContentModel] })
  help: ContentModel[];

  @prop({ required: true })
  helpLink: string;

  @prop({ required: true })
  avatar: string;

  @prop({ required: true })
  avatarLink: string;

  @prop({ required: true })
  summary: string;

  @prop({ required: true })
  summaryLink: string;

  @prop({ required: true })
  website: string;

  @prop({ type: () => ContactModel, required: true })
  contact: ContactModel;

  @prop({ type: () => [TechnologyModel] })
  technologies: TechnologyModel[];

  @prop({ type: () => [ExperienceModel] })
  experiences: ExperienceModel[];

  @prop({ type: () => [EducationModel] })
  educations: EducationModel[];

  @prop({ type: () => [SkillModel] })
  skills: SkillModel[];

  @prop({ type: () => [ProjectModel] })
  projects: ProjectModel[];

  @prop({ type: () => [ContributionModel] })
  contributions: ContributionModel[];

  @prop({ type: () => [String] })
  characteristics: string[];

  @prop({ type: () => [String] })
  keywords: string[];

  // User association
  @prop({ required: true })
  userId: string;

  @prop({ default: true })
  isActive: boolean;
}