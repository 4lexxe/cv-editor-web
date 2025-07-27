import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { ResumeModel } from "@cv/mongodb/models";

// Zod schemas for validation
const ContactSchema = z.object({
  website: z.string().optional(),
  call: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  cv: z.string().optional(),
  resume: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  npm: z.string().optional(),
  telegram: z.string().optional(),
  twitter: z.string().optional(),
  socials: z.array(z.object({
    name: z.string(),
    url: z.string(),
    icon: z.string()
  })).optional()
});

const ContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  items: z.array(z.string()).optional(),
  link: z.string().optional()
});

const LocationSchema = z.object({
  name: z.string(),
  link: z.string()
});

const ExperienceSchema = z.object({
  company: z.string(),
  link: z.string().optional(),
  badges: z.array(z.string()).optional(),
  title: z.string(),
  logo: z.string().optional(),
  start: z.string(),
  end: z.string().optional(),
  contents: z.array(ContentSchema)
});

const EducationSchema = z.object({
  company: z.string(),
  link: z.string().optional(),
  badges: z.array(z.string()).optional(),
  title: z.string(),
  logo: z.string().optional(),
  start: z.string(),
  end: z.string().optional(),
  description: z.string()
});

const SkillSchema = z.object({
  name: z.string(),
  years: z.number()
});

const ProjectSchema = z.object({
  company: z.string(),
  link: z.string().optional(),
  image: z.string().optional(),
  badges: z.array(z.string()).optional(),
  title: z.string(),
  logo: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  description: z.string()
});

const TechnologySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  link: z.string().optional(),
  image: z.string(),
  width: z.number(),
  height: z.number()
});

const ContributionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  link: z.string()
});

const ResumeSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string().optional(),
  name: z.string(),
  nick: z.string(),
  nameLink: z.string(),
  initials: z.string().optional(),
  initialsLink: z.string().optional(),
  locations: z.array(LocationSchema),
  languages: z.record(z.string(), z.string()),
  about: z.array(ContentSchema),
  aboutLink: z.string(),
  help: z.array(ContentSchema),
  helpLink: z.string(),
  avatar: z.string(),
  avatarLink: z.string(),
  summary: z.string(),
  summaryLink: z.string(),
  website: z.string(),
  contact: ContactSchema,
  technologies: z.array(TechnologySchema),
  experiences: z.array(ExperienceSchema),
  educations: z.array(EducationSchema),
  skills: z.array(SkillSchema),
  projects: z.array(ProjectSchema),
  contributions: z.array(ContributionSchema),
  characteristics: z.array(z.string()),
  keywords: z.array(z.string()),
  userId: z.string().optional(),
  isActive: z.boolean().optional()
});

const UpdateResumeSchema = ResumeSchema.partial().extend({
  id: z.string()
});

export const resumeRouter = router({
  // Get all resumes for a user
  getByUserId: publicProcedure
    .input(z.object({ 
      userId: z.string(),
      includeInactive: z.boolean().optional().default(false)
    }))
    .query(async ({ ctx, input }) => {
      try {
        const filter: any = { userId: input.userId };
        if (!input.includeInactive) {
          filter.isActive = true;
        }
        const resumes = await ResumeModel.find(filter).sort({ updatedAt: -1 });
        return resumes;
      } catch (error) {
        throw new Error(`Error fetching resumes: ${error}`);
      }
    }),

  // Get all resumes (for admin or general listing)
  getAll: publicProcedure
    .input(z.object({ 
      includeInactive: z.boolean().optional().default(false)
    }))
    .query(async ({ ctx, input }) => {
      try {
        const filter: any = {};
        if (!input.includeInactive) {
          filter.isActive = true;
        }
        const resumes = await ResumeModel.find(filter).sort({ updatedAt: -1 });
        return resumes;
      } catch (error) {
        throw new Error(`Error fetching all resumes: ${error}`);
      }
    }),

  // Get a specific resume by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const resume = await ResumeModel.findById(input.id);
        if (!resume) {
          throw new Error('Resume not found');
        }
        return resume;
      } catch (error) {
        throw new Error(`Error fetching resume: ${error}`);
      }
    }),

  // Create a new resume
  create: publicProcedure
    .input(ResumeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const resume = new ResumeModel({
          ...input,
          isActive: true
        });
        await resume.save();
        return resume;
      } catch (error) {
        throw new Error(`Error creating resume: ${error}`);
      }
    }),

  // Update an existing resume
  update: publicProcedure
    .input(UpdateResumeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;
        const resume = await ResumeModel.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );
        if (!resume) {
          throw new Error('Resume not found');
        }
        return resume;
      } catch (error) {
        throw new Error(`Error updating resume: ${error}`);
      }
    }),

  // Delete a resume (soft delete)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const resume = await ResumeModel.findByIdAndUpdate(
          input.id,
          { isActive: false },
          { new: true }
        );
        if (!resume) {
          throw new Error('Resume not found');
        }
        return { success: true, message: 'Resume deleted successfully' };
      } catch (error) {
        throw new Error(`Error deleting resume: ${error}`);
      }
    }),

  // Update personal info
  updatePersonalInfo: publicProcedure
    .input(z.object({
      id: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      name: z.string().optional(),
      summary: z.string().optional(),
      avatar: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;
        const resume = await ResumeModel.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );
        if (!resume) {
          throw new Error('Resume not found');
        }
        return resume;
      } catch (error) {
        throw new Error(`Error updating personal info: ${error}`);
      }
    }),

  // Update contact info
  updateContact: publicProcedure
    .input(z.object({
      id: z.string(),
      contact: ContactSchema.partial()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const resume = await ResumeModel.findById(input.id);
        if (!resume) {
          throw new Error('Resume not found');
        }
        
        resume.contact = { ...resume.contact, ...input.contact };
        await resume.save();
        return resume;
      } catch (error) {
        throw new Error(`Error updating contact: ${error}`);
      }
    }),

  // Update about section
  updateAbout: publicProcedure
    .input(z.object({
      id: z.string(),
      about: z.array(ContentSchema)
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const resume = await ResumeModel.findByIdAndUpdate(
          input.id,
          { about: input.about },
          { new: true, runValidators: true }
        );
        if (!resume) {
          throw new Error('Resume not found');
        }
        return resume;
      } catch (error) {
        throw new Error(`Error updating about: ${error}`);
      }
    }),

  // Update experiences
  updateExperiences: publicProcedure
    .input(z.object({
      id: z.string(),
      experiences: z.array(ExperienceSchema)
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const resume = await ResumeModel.findByIdAndUpdate(
          input.id,
          { experiences: input.experiences },
          { new: true, runValidators: true }
        );
        if (!resume) {
          throw new Error('Resume not found');
        }
        return resume;
      } catch (error) {
        throw new Error(`Error updating experiences: ${error}`);
      }
    }),

  // Update educations
  updateEducations: publicProcedure
    .input(z.object({
      id: z.string(),
      educations: z.array(EducationSchema)
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const resume = await ResumeModel.findByIdAndUpdate(
          input.id,
          { educations: input.educations },
          { new: true, runValidators: true }
        );
        if (!resume) {
          throw new Error('Resume not found');
        }
        return resume;
      } catch (error) {
        throw new Error(`Error updating educations: ${error}`);
      }
    }),

  // Update skills
  updateSkills: publicProcedure
    .input(z.object({
      id: z.string(),
      skills: z.array(SkillSchema)
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const resume = await ResumeModel.findByIdAndUpdate(
          input.id,
          { skills: input.skills },
          { new: true, runValidators: true }
        );
        if (!resume) {
          throw new Error('Resume not found');
        }
        return resume;
      } catch (error) {
        throw new Error(`Error updating skills: ${error}`);
      }
    }),

  // Update projects
  updateProjects: publicProcedure
    .input(z.object({
      id: z.string(),
      projects: z.array(ProjectSchema)
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const resume = await ResumeModel.findByIdAndUpdate(
          input.id,
          { projects: input.projects },
          { new: true, runValidators: true }
        );
        if (!resume) {
          throw new Error('Resume not found');
        }
        return resume;
      } catch (error) {
        throw new Error(`Error updating projects: ${error}`);
      }
    }),

  // Update technologies
  updateTechnologies: publicProcedure
    .input(z.object({
      id: z.string(),
      technologies: z.array(TechnologySchema)
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const resume = await ResumeModel.findByIdAndUpdate(
          input.id,
          { technologies: input.technologies },
          { new: true, runValidators: true }
        );
        if (!resume) {
          throw new Error('Resume not found');
        }
        return resume;
      } catch (error) {
        throw new Error(`Error updating technologies: ${error}`);
      }
    }),

  // Update contributions
  updateContributions: publicProcedure
    .input(z.object({
      id: z.string(),
      contributions: z.array(ContributionSchema)
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const resume = await ResumeModel.findByIdAndUpdate(
          input.id,
          { contributions: input.contributions },
          { new: true, runValidators: true }
        );
        if (!resume) {
          throw new Error('Resume not found');
        }
        return resume;
      } catch (error) {
        throw new Error(`Error updating contributions: ${error}`);
      }
    })
});