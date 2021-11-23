import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMailInvitation(
    fromUser: String,
    toUser: string,
    classroomName: String,
    classUrl: String,
    role,
  ) {    
    
    const sendMail = await this.mailerService.sendMail({
      from: 'onl.class123@gmail.com',
      to: toUser,
      subject: `Mời tham gia lớp học ${classroomName} `,
      template: './welcome', 
      context: {
        fromUser,
        classUrl,
        classroomName,
        role
      },
    });
  }
}
