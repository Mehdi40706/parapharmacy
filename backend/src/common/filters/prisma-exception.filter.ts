import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, message } = this.mapError(exception);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  private mapError(
    exception: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError,
  ): { status: number; message: string } {
    // Erreur de validation Prisma (mauvais type, champ manquant côté requête brute...)
    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Données invalides envoyées à la base de données',
      };
    }

    switch (exception.code) {
      // Violation de contrainte unique (ex: email déjà utilisé, slug déjà pris)
      case 'P2002': {
        const field = (exception.meta?.target as string[])?.join(', ') || 'champ';
        return {
          status: HttpStatus.CONFLICT,
          message: `Cette valeur existe déjà`,
        };
      }

      // Enregistrement introuvable (ex: update/delete sur un id inexistant)
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Ressource introuvable',
        };

      // Violation de clé étrangère (ex: suppression d'un produit référencé dans OrderItem)
      case 'P2003': {
        const field = (exception.meta?.field_name as string) || 'une ressource liée';
        return {
          status: HttpStatus.CONFLICT,
          message: `Impossible d'effectuer cette action car elle est liée`,
        };
      }

      // Valeur requise manquante
      case 'P2011':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Un champ obligatoire est manquant',
        };

      // Timeout ou problème de connexion à la base
      case 'P1001':
      case 'P1002':
        return {
          status: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Service temporairement indisponible, réessayez plus tard',
        };

      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Une erreur interne est survenue',
        };
    }
  }
}