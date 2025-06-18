import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as nodemailer from 'nodemailer';
import { User } from 'src/user/user.model';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailHelperService {
  private transporter: nodemailer.Transporter<SentMessageInfo, Options>;

  constructor(@InjectModel(User) private userModel: typeof User) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendTemporalPass(mail: string, temporalPassword: string) {
    const mailOptions = {
      from: '"Soporte Food Diet" <no-reply@fooddiet.com>',
      to: mail,
      subject: 'Cambio de contraseña - Food Diet',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #2e7d32;">Food Diet - Recuperación de Contraseña</h2>
        <p>Hola,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña. Aquí tienes tu contraseña temporal:</p>
        <p style="font-size: 20px; font-weight: bold; color: #d32f2f;">${temporalPassword}</p>
        <p>Esta contraseña expira en 15 minutos.</p>
        <p style="margin-top: 20px;">Si no solicitaste esto, podés ignorar este mensaje.</p>
        <br/>
        <p>Saludos,</p>
        <p>Equipo de soporte de Food Diet</p>
      </div>
    `,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
