import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { SharedResumeModel } from "@cv/mongodb/models";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

// Schema para crear un CV compartido
const CreateSharedResumeSchema = z.object({
  resumeData: z.any(), // Los datos completos del CV desde localStorage
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  expiresInDays: z.number().optional() // Días hasta que expire (opcional)
});

// Schema para actualizar un CV compartido
const UpdateSharedResumeSchema = z.object({
  shareId: z.string(),
  resumeData: z.any().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional()
});

export const shareRouter = router({
  // Crear un nuevo CV compartido
  create: publicProcedure
    .input(CreateSharedResumeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Generar un ID único para el enlace
        const shareId = nanoid(12); // ID corto y único

        // Calcular fecha de expiración si se especifica
        let expiresAt = null;
        if (input.expiresInDays && input.expiresInDays > 0) {
          expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + input.expiresInDays);
        }

        // Crear el CV compartido
        const sharedResume = new SharedResumeModel({
          shareId,
          resumeData: input.resumeData,
          title: input.title,
          description: input.description || '',
          isPublic: true,
          viewCount: 0,
          expiresAt
        });

        await sharedResume.save();

        // Detectar la URL base correcta según el entorno
        let baseUrl = process.env.NEXT_PUBLIC_URL;

        if (!baseUrl) {
          if (process.env.VERCEL_URL) {
            // En Vercel, usar la URL automática
            baseUrl = `https://${process.env.VERCEL_URL}`;
          } else if (process.env.NODE_ENV === 'production') {
            // En producción sin VERCEL_URL, usar fallback
            baseUrl = 'https://TU-DOMINIO-REAL.vercel.app'; // Reemplaza con tu dominio de Vercel
          } else {
            // En desarrollo
            baseUrl = 'http://localhost:3000';
          }
        }

        return {
          shareId,
          shareUrl: `${baseUrl}/share/${shareId}`,
          title: input.title,
          description: input.description,
          createdAt: sharedResume.createdAt,
          expiresAt: sharedResume.expiresAt
        };
      } catch (error) {
        console.error('Error creating shared resume:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Error creating shared resume: ${error}`
        });
      }
    }),

  // Obtener un CV compartido por su ID
  getByShareId: publicProcedure
    .input(z.object({ shareId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const sharedResume = await SharedResumeModel.findOne({
          shareId: input.shareId,
          isPublic: true,
          $or: [
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } }
          ]
        });

        if (!sharedResume) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'CV compartido no encontrado o ha expirado'
          });
        }

        // Incrementar contador de vistas
        await SharedResumeModel.updateOne(
          { shareId: input.shareId },
          { $inc: { viewCount: 1 } }
        );

        return {
          shareId: sharedResume.shareId,
          resumeData: sharedResume.resumeData,
          title: sharedResume.title,
          description: sharedResume.description,
          viewCount: sharedResume.viewCount + 1,
          createdAt: sharedResume.createdAt,
          updatedAt: sharedResume.updatedAt
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error fetching shared resume:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Error fetching shared resume: ${error}`
        });
      }
    }),

  // Actualizar un CV compartido
  update: publicProcedure
    .input(UpdateSharedResumeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { shareId, ...updateData } = input;

        const sharedResume = await SharedResumeModel.findOneAndUpdate(
          { shareId },
          updateData,
          { new: true, runValidators: true }
        );

        if (!sharedResume) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'CV compartido no encontrado'
          });
        }

        return {
          shareId: sharedResume.shareId,
          title: sharedResume.title,
          description: sharedResume.description,
          isPublic: sharedResume.isPublic,
          viewCount: sharedResume.viewCount,
          updatedAt: sharedResume.updatedAt
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error updating shared resume:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Error updating shared resume: ${error}`
        });
      }
    }),

  // Eliminar un CV compartido
  delete: publicProcedure
    .input(z.object({ shareId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await SharedResumeModel.deleteOne({ shareId: input.shareId });

        if (result.deletedCount === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'CV compartido no encontrado'
          });
        }

        return { success: true, message: 'CV compartido eliminado correctamente' };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error deleting shared resume:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Error deleting shared resume: ${error}`
        });
      }
    }),

  // Obtener estadísticas de un CV compartido
  getStats: publicProcedure
    .input(z.object({ shareId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const sharedResume = await SharedResumeModel.findOne({
          shareId: input.shareId
        }).select('shareId title viewCount createdAt updatedAt expiresAt isPublic');

        if (!sharedResume) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'CV compartido no encontrado'
          });
        }

        return {
          shareId: sharedResume.shareId,
          title: sharedResume.title,
          viewCount: sharedResume.viewCount,
          isPublic: sharedResume.isPublic,
          createdAt: sharedResume.createdAt,
          updatedAt: sharedResume.updatedAt,
          expiresAt: sharedResume.expiresAt,
          isExpired: sharedResume.expiresAt ? new Date() > sharedResume.expiresAt : false
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error fetching shared resume stats:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Error fetching stats: ${error}`
        });
      }
    }),

  // Debug: Listar todos los CVs compartidos (solo para desarrollo/debug)
  debugList: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const sharedResumes = await SharedResumeModel.find({})
          .select('shareId title description isPublic viewCount createdAt expiresAt')
          .sort({ createdAt: -1 })
          .limit(20);

        return sharedResumes.map(resume => ({
          shareId: resume.shareId,
          title: resume.title,
          description: resume.description,
          isPublic: resume.isPublic,
          viewCount: resume.viewCount,
          createdAt: resume.createdAt,
          expiresAt: resume.expiresAt,
          isExpired: resume.expiresAt ? new Date() > resume.expiresAt : false
        }));
      } catch (error) {
        console.error('Error fetching shared resumes for debug:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Error fetching shared resumes: ${error}`
        });
      }
    })
});