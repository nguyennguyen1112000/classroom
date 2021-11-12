import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { SendInviterEmailDto } from 'src/classrooms/dto/send-invite-email.dto';

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
        name: "Nguyen",
        url:classUrl,
      },
    });
    console.log(sendMail);
  }
}
